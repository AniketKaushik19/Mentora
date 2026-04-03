import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
You are a helpful, professional AI Career Coach.
Guide users in job search, interviews, resumes, skills, and career growth.
If user asks unrelated topics, politely redirect to career questions.
Respond clearly and practically.
`;

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: "userInput is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInput,
      config: {
        systemInstruction,
      },
    });

    const output = response.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({
        content: output,
        role: "model",
        type: "text"
    });
  } catch (error) {
    console.error("AI Career Chat Agent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
