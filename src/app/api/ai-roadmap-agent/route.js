import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/config/db";
import { HistoryTable } from "@/config/schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
Generate a structured learning roadmap in JSON format.

Return ONLY JSON with this structure:

{
  "roadmapTitle": "",
  "description": "",
  "duration": "",
  "initialNodes": [
    {
      "id": "1",
      "type": "turbo",
      "position": { "x": 0, "y": 0 },
      "data": {
        "title": "",
        "description": "",
        "link": ""
      }
    }
  ],
  "initialEdges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ]
}

No markdown.
No explanation.
Return valid JSON only.
`;

export async function POST(req) {
  try {
    const user = await currentUser();
    const { roadmapId, userInput } = await req.json();

    if (!roadmapId || !userInput) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    
    if (!userEmail) {
       return NextResponse.json({ error: "User unauthorized" }, { status: 401 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInput,
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
      console.error("Roadmap RAW OUTPUT:", rawContent);
      throw new Error("Failed to parse AI response JSON.");
    }

    await db.insert(HistoryTable).values({
      recordId: roadmapId,
      content: parsedJson,
      aiAgentType: "/ai-tools/ai-roadmap-agent",
      createdAt: new Date().toISOString(),
      userEmail,
      metaData: userInput,
    });

    // The frontend was expecting `runStatus.data?.[0].output || runStatus.data?.[0].output?.output[0]`
    // When using inngest `return parsedJson` in `function.js` evaluated to `runStatus.data[0].output`.
    // So we should directly return `parsedJson`.
    return NextResponse.json(parsedJson);

  } catch (error) {
    console.error("AiRoadmapAgent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
