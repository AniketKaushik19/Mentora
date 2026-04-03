import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import ImageKit from "imagekit";
import { db } from "@/config/db";
import { HistoryTable } from "@/config/schema";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
You are an advanced AI Resume Analyzer.

You must return ONLY valid JSON in this structure:

{
  "overall_score": number,
  "overall_feedback": "string",
  "summary_comment": "string",
  "sections": {
    "contact_info": { "score": number, "comment": "string" },
    "experience": { "score": number, "comment": "string" },
    "education": { "score": number, "comment": "string" },
    "skills": { "score": number, "comment": "string" }
  },
  "tips_for_improvement": ["string"],
  "whats_good": ["string"],
  "needs_improvement": ["string"]
}

Do not wrap in markdown.
Do not explain anything.
Return JSON only.
`;

export async function POST(req) {
  try {
    const user = await currentUser();
    const formData = await req.formData();
    const resumeFile = formData.get("resumeFile");
    const recordId = formData.get("recordId");

    if (!resumeFile) {
      throw new Error("Missing resume file");
    }

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      throw new Error("Missing userEmail");
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🧠 Attempt to extract text using pdfreader (optional fallback)
    let pdfText = "";
    try {
      pdfText = await extractTextFromPDF(buffer);
    } catch (e) {
      console.warn("pdfreader failed, relying entirely on Gemini vision/multimodal capabilities.");
    }

    const base64 = buffer.toString("base64");

    // Upload to ImageKit
    const uploaded = await imagekit.upload({
      file: base64,
      fileName: `${Date.now()}.pdf`,
      isPublished: true,
    });

    const uploadFileUrl = uploaded.url;

    // Call Gemini with the PDF directly
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: base64,
            mimeType: "application/pdf",
          },
        },
        pdfText ? `Parsed text fallback:\n${pdfText}` : "Analyze this resume document.",
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    let rawContent = response.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    rawContent = rawContent
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

    // Save to Database
    await db.insert(HistoryTable).values({
      recordId,
      content: parsedJson,
      aiAgentType: "/ai-tools/ai-resume-analyzer",
      createdAt: new Date().toISOString(),
      userEmail,
      metaData: uploadFileUrl,
    });

    return NextResponse.json({
      success: true,
      recordId,
      summary: parsedJson,
      fileUrl: uploadFileUrl,
    });
  } catch (error) {
    console.error("❌ Error processing resume:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}