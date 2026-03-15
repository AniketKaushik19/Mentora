import { createAgent, gemini } from "@inngest/agent-kit";

/* =========================================================
   SAFE GEMINI MODEL LOADER
========================================================= */

function getGeminiModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  return gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
    maxOutputTokens: 2048,
  });
}

/* =========================================================
   1️⃣ CAREER CHAT AGENT
========================================================= */

export const AiCareerChatAgent = createAgent({
  name: "AiCareerAgent",
  description: "AI agent that answers career related questions.",
  system: `
You are a helpful, professional AI Career Coach.
Guide users in job search, interviews, resumes, skills, and career growth.
If user asks unrelated topics, politely redirect to career questions.
Respond clearly and practically.
`,
  model: getGeminiModel(),
});

/* =========================================================
   2️⃣ COVER LETTER GENERATOR AGENT
========================================================= */

export const CoverLetterGeneratorAgent = createAgent({
  name: "CoverLetterGeneratorAgent",
  description: "Generates professional Indian-standard cover letters.",
  system: `
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
`,
  model: getGeminiModel(),
});

/* =========================================================
   3️⃣ RESUME ANALYZER AGENT
========================================================= */

export const AiResumeAnalyzerAgent = createAgent({
  name: "AiResumeAnalyzerAgent",
  description: "Analyzes resume and returns structured JSON report.",
  system: `
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
`,
  model: getGeminiModel(),
});

/* =========================================================
   4️⃣ ROADMAP GENERATOR AGENT
========================================================= */

export const AiRoadmapGeneratorAgent = createAgent({
  name: "AiRoadmapGeneratorAgent",
  description: "Generates structured learning roadmap JSON.",
  system: `
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
`,
  model: getGeminiModel(),
});