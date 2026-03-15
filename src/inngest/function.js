import { HistoryTable } from "@/config/schema";
import ImageKit from "imagekit";
import { db } from "@/config/db";
import { inngest } from ".";

import {
  AiCareerChatAgent,
  CoverLetterGeneratorAgent,
  AiResumeAnalyzerAgent,
  AiRoadmapGeneratorAgent} from "./agents"

/* =========================================================
   IMAGEKIT INITIALIZATION
========================================================= */

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

/* =========================================================
   1️⃣ HELLO WORLD TEST FUNCTION
========================================================= */

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");

    return {
      message: `Hello ${event?.data?.email || "User"}!`,
    };
  }
);

/* =========================================================
   2️⃣ CAREER CHAT AGENT
========================================================= */

export const AiCareerAgent = inngest.createFunction(
  { id: "ai-career-agent" , retries: 2},
  { event: "career/ask" },
  async ({ event }) => {
    try {
      const userInput = event?.data?.userInput;

      if (!userInput || typeof userInput !== "string") {
        throw new Error("Invalid or missing userInput");
      }

      const result = await AiCareerChatAgent.run({
        input: userInput,
      });

      if (!result) {
        throw new Error("Empty AI response");
      }

      return result;
    } catch (error) {
      console.error("AiCareerAgent Error:", error.message);
      throw error;
    }
  }
);

/* =========================================================
   3️⃣ COVER LETTER GENERATOR
========================================================= */

export const CoverLetterGeneratorFunction = inngest.createFunction(
  { id: "cover-letter-generator" , retries: 2},
  { event: "coverletter/generate" },
  async ({ event }) => {
    try {
      const userInput = event?.data?.userInput;

      if (!userInput) {
        throw new Error("Missing userInput");
      }

      const result = await CoverLetterGeneratorAgent.run({
        input: userInput,
      });

      return result;
    } catch (error) {
      console.error("CoverLetterGenerator Error:", error.message);
      throw error;
    }
  }
);

/* =========================================================
   4️⃣ RESUME ANALYZER AGENT
========================================================= */

export const AiResumeAgent = inngest.createFunction(
  { id: "AiResumeAgent" , retries: 2},
  { event: "AiResumeAgent" },
  async ({ event, step }) => {
    try {
      const {
        recordId,
        base64ResumeFile,
        pdfText,
        aiAgentType,
        userEmail,
      } = event.data || {};

      /* ---------- VALIDATION ---------- */

      if (!recordId || !userEmail) {
        throw new Error("Missing recordId or userEmail");
      }

      if (!pdfText || pdfText.trim().length === 0) {
        throw new Error("Invalid pdfText");
      }

      /* ---------- UPLOAD TO IMAGEKIT ---------- */

      const uploadFileUrl = await step.run("uploadResume", async () => {
        const uploaded = await imagekit.upload({
          file: base64ResumeFile,
          fileName: `${Date.now()}.pdf`,
          isPublished: true,
        });

        return uploaded.url;
      });

      /* ---------- RUN AI ANALYZER ---------- */

      const aiResponse = await AiResumeAnalyzerAgent.run({
        input: pdfText,
      });

      if (!aiResponse?.output?.[0]?.content) {
        throw new Error("Invalid AI response format");
      }

      /* ---------- CLEAN JSON ---------- */

      let rawContent = aiResponse.output[0].content
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      let parsedJson;

      try {
        parsedJson = JSON.parse(rawContent);
      } catch (err) {
        console.error("AI RAW OUTPUT:", rawContent);
        throw new Error("Failed to parse AI response JSON.");
      }

      /* ---------- SAVE TO DATABASE ---------- */

      await step.run("saveToDb", async () => {
        await db.insert(HistoryTable).values({
          recordId,
          content: parsedJson,
          aiAgentType,
          createdAt: new Date().toISOString(),
          userEmail,
          metaData: uploadFileUrl,
        });
      });

      return {
        success: true,
        recordId,
        summary: parsedJson,
        fileUrl: uploadFileUrl,
      };
    } catch (error) {
      console.error("AiResumeAgent Error:", error.message);
      throw error;
    }
  }
);

/* =========================================================
   5️⃣ ROADMAP GENERATOR
========================================================= */

export const AiRoadmapAgent = inngest.createFunction(
  { id: "roadmap-generator-function" , retries: 2},
  { event: "roadmap/generate" },
  async ({ event, step }) => {
    try {
      const { roadmapId, userInput, userEmail } = event.data || {};

      if (!roadmapId || !userInput || !userEmail) {
        throw new Error("Missing required fields");
      }

      const roadmapResult = await AiRoadmapGeneratorAgent.run({
        input: userInput,
      });

      if (!roadmapResult?.output?.[0]?.content) {
        throw new Error("Invalid AI response");
      }

      let rawContent = roadmapResult.output[0].content
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      let parsedJson;

      try {
        parsedJson = JSON.parse(rawContent);
      } catch (err) {
        console.error("Roadmap RAW OUTPUT:", rawContent);
        throw new Error("Failed to parse AI response JSON.");
      }

      await step.run("saveRoadmapToDb", async () => {
        await db.insert(HistoryTable).values({
          recordId: roadmapId,
          content: parsedJson,
          aiAgentType: "/ai-tools/ai-roadmap-agent",
          createdAt: new Date().toISOString(),
          userEmail,
          metaData: userInput,
        });
      });

      return parsedJson;
    } catch (error) {
      console.error("AiRoadmapAgent Error:", error.message);
      throw error;
    }
  }
);