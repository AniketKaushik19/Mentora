import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import axios from "axios";

// ---------- PROMPT TEMPLATE ----------
const PROMPT = (courseName, noOfChapters) => `
You are a strict JSON generator.
Respond ONLY with valid JSON (no markdown, no comments, no explanations).

Generate a detailed learning course based on the following details:

Course Name: ${courseName}
Number of Chapters: ${noOfChapters}

Include the following fields:
- Course Name
- Description
- Number of Chapters
- Whether video content is included
- Level (Beginner, Intermediate, Advanced)
- Category
- Chapters array: each with chapterName, duration, topics, and imagePrompt.

Image Prompt:
"Create a modern, flat-style 2D digital illustration representing the user Topic. Focus on UI/UX design elements such as mockup screens, icons, text blocks, buttons, and creative workspace tools. Add symbolic and conceptual visuals only — no human characters or faces. Use a vibrant color palette (blues, purples, oranges, pinks) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing digital learning concepts."

Respond strictly in this JSON schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "noOfChapters": "number",
    "includeVideo": "boolean",
    "level": "string",
    "category": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": ["string"],
        "imagePrompt": "string"
      }
    ]
  }
}
`;

// ---------- GOOGLE GEN AI CONFIG ----------
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ---------- MAIN POST HANDLER ----------
export async function POST(req) {
  try {
    const { courseId, ...formData } = await req.json();
    const user = await currentUser();

    const config = { responseMimeType: "text/plain" };
    const model = "gemini-2.5-flash";

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: PROMPT(formData.name, formData.noOfChapters),
          },
        ],
      },
    ];

    // ---------- GENERATE COURSE STRUCTURE ----------
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const rawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const rawJson = rawResp.replace("```json", "").replace("```", "");
    const jsonResp = JSON.parse(rawJson);

    // pick first chapter's image prompt (since "course.imagePrompt" doesn’t exist)
    const imagePrompt = jsonResp.course?.chapters?.[0]?.imagePrompt || "Digital learning concept";

    // ---------- GENERATE BANNER IMAGE ----------
    const bannerImageUrl = await GenerateImage(imagePrompt);

    // ---------- SAVE TO DATABASE ----------
    await db.insert(coursesTable).values({
      ...formData,
      courseJson: jsonResp,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid: courseId,
      bannerImageUrl,
    });

    return NextResponse.json({ success: true, courseId });
  } catch (error) {
    console.error("❌ Error generating course layout:", error.message, error.response?.data);
    return NextResponse.json(
      { error: "Failed to generate course layout", details: error.message },
      { status: 500 }
    );
  }
}

// ---------- HELPER: GENERATE IMAGE ----------
const GenerateImage = async (imagePrompt) => {
  const BASE_URL = "https://aigurulab.tech";

  const finalPrompt = `
  ${imagePrompt}
  Create a modern flat 2D digital illustration with NO human characters, NO faces, and NO people.
  Focus only on UI elements, technology, workspace tools, icons, and design components.
  Style: futuristic, clean, vibrant, educational.
  `;

  try {
    const result = await axios.post(
      `${BASE_URL}/api/generate-image`,
      {
        width: 1024,
        height: 1024,
        input: finalPrompt,
        model: "flux",
        aspectRatio: "16:9",
        negativePrompt:
          "human, person, man, woman, face, body, people, portrait, character, hands, figure, head, silhouette, humanoid",
      },
      {
        headers: {
          "x-api-key": process.env.AI_GURU_LAB_API,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Image generated successfully");
    return result.data.image;
  } catch (error) {
    console.error("❌ Image generation failed:", error.response?.data || error.message);
    return "/default-banner.jpg"; // fallback banner
  }
};
