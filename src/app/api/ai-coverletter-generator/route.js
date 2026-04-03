import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
You are an AI Cover Letter Generator.

Generate formal, concise and professional cover letters 
as per Indian business communication standards.

Follow this structure:
- Recipient Info
- Subject
- Salutation
- Introduction
- Body
- Closing
- Sign Off

200–250 words.
No placeholders.
No meta-text.
Output only final formatted cover letter.
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
    console.error("AI Cover Letter Generator Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
