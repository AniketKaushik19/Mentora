import { HistoryTable } from "@/config/schema";
import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";
import ImageKit from "imagekit";
import { db } from "@/config/db";
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

var imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

export const AiCareerChatAgent = createAgent({
  name: "AiCareerAgent",
  description: "An AI agent that answers career related question.",
  system:
    "You are a helpful, professional AI Career Coach Agent. Your role is to guide users with questions related to careers, including job search advice, interview preparation, resume improvement, skill development, career transitions, and industry trends. Always respond with clarity, encouragement, and actionable advice tailored to the user's needs. If the user asks something unrelated to careers (e.g., topics like health, relationships, coding help, or general trivia), gently inform them that you are a career coach and suggest relevant career-focused questions instead.",
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});

export const AiCareerAgent = inngest.createFunction(
  { id: "AiCareerAgent" },
  { event: "AiCareerAgent" },
  async ({ event, step }) => {
    const userInput = event?.data?.userInput;
    const result = await AiCareerChatAgent.run(userInput);
    return result;
  }
);


export const CoverLetterGeneratorAgent = createAgent({
  name: "CoverLetterGeneratorAgent",
  description: "An AI agent that generates professional cover letters.",
  system: `
You are a skilled AI Cover Letter Generator. Your role is to craft compelling, personalized, and well-structured cover letters for job applications. 
Always maintain a professional and polished tone, highlighting the user's strengths, skills, and relevant experience. 
Ensure the letter aligns with the job type and professional standards.

Follow these guidelines strictly:
- Present the output as a formal, properly formatted cover letter with standard structure (Header, Greeting, Introduction, Body, Closing, Signature).
- Do not include or mention any meta-text, commentary, or requests for additional information.
- If the user provides unrelated content, gently redirect them to focus on cover letter generation.
- Do not include or mention the following lines anywhere in the output:
  "Okay, I can definitely help you craft a strong cover letter based on that information! Here's a first draft, incorporating the details you provided:"
  or any request such as:
  "Now, to make this even better, could you tell me a little more about the specific requirements mentioned in the job description?"
  or similar clarifying prompts.
Your only task is to generate the final, complete, professional cover letter using the details from user input.
`,
  examples: [
    {
      input: `
userinput:
Company Name: Priya Mehta Pvt Ltd
Job Title: Software Developer
Description: JavaScript, React, Node.js, problem-solving, teamwork
`,
      output: `
Dear Hiring Manager,  
[Company Name]  
[Location]  

Date:  

Subject: Application for the Software Developer Position  

I am writing to express my interest in the Software Developer position. With a strong foundation in JavaScript, React, and Node.js, along with hands-on experience gained through a six-month internship in web development, I am confident in my ability to contribute effectively to your team.  

During my internship, I worked on building responsive and user-friendly web applications, gaining valuable insights into front-end and back-end integration. I also developed my own personal portfolio site and contributed to open-source projects, which strengthened my problem-solving and collaboration skills.  

I am eager to bring my technical knowledge, enthusiasm for innovation, and commitment to continuous learning to your organization. I believe my adaptability and passion for development make me a strong fit for this role.  

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experiences can align with your team’s goals.  

Sincerely,  
Priya Mehta  
Email: [Your Email ID]  
LinkedIn: [LinkedIn Profile] | GitHub: [GitHub ID] | Portfolio: [Portfolio Link]
`,
    },
  ],
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});


export const CoverLetterGeneratorFunction = inngest.createFunction(
  { id: "CoverLetterGeneratorFunction" },
  { event: "CoverLetterGeneratorFunction" },
  async ({ event, step }) => {
    const userInput = event?.data?.userInput;
    const result = await CoverLetterGeneratorAgent.run(userInput);
    return result;
  }
);

export const AiResumeAnalyzerAgent = createAgent({
  name: "AiResumeAnalyzerAgent",
  description: "AI Resume Analyzer Agent help to return Report.",
  system:
    "You are an advanced AI Resume Analyzer Agent. Your task is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format. The schema must match the layout and structure of a visual UI that includes overall score, section scores, summary feedback, improvement tips, strengths, and weaknesses. INPUT: I will provide a plain text resume. GOAL: Output a JSON report as per the schema below. The report should reflect: overall_score: (0-100) overall_feedback (short message e.g., “Excellent”, “Needs improvement”) summary_comment (1–2 sentence evaluation summary) Section scores for: Contact Info, Experience, Education, Skills Each section should include: score (as percentage) Optional comment about that section Tips for improvement (3–5 tips) What’s Good (1–3 strengths) Needs Improvement (1–3 weaknesses) Output JSON Schema: { “overall_score”: 85, “overall_feedback”: “Excellent”, “summary_comment”: “Your resume is strong, but there are areas to refine.”, “sections”: { “contact_info”: { “score”: 90, “comment”: “Perfectly structured and complete.” }, “experience”: { “score”: 88, “comment”: “Strong bullet points and impact.” }, “education”: { “score”: 84, “comment”: “Consider adding relevant coursework.” }, “skills”: { “score”: 80, “comment”: “Expand on specific skill proficiencies.” } }, “tips_for_improvement”: [ “Add more numeric and metric to your experience section to show impact.”, “Integrate more industry-specific keywords relevant to your target roles.”, “Start bullet points with strong action verbs to make your achievements stand out.” ], “whats_good”: [ “Clear and professional formatting.”, “Concise and precise contact information.”, “Relevant work experience.” ], “needs_improvement”: [ “Skills section lacks detail.”, “Some experience bullet points could be stronger.”, “Missing a professional summary/objective.” ] }  ",
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});

export const AiResumeAgent = inngest.createFunction(
  { id: "AiResumeAgent" },
  { event: "AiResumeAgent" },
  async ({ event, step }) => {
    const { recordId, base64ResumeFile, pdfText, aiAgentType, userEmail } = event.data;
    if (!pdfText || typeof pdfText !== "string" || pdfText.trim().length === 0) {
      throw new Error("Missing or invalid PDF text.");
    }

    const uploadFileUrl = await step.run("uploadImage", async () => {
      const imageKitFile = await imagekit.upload({
        file: base64ResumeFile,
        fileName: `${Date.now()}.pdf`,
        isPublished: true,
      });
      return imageKitFile.url;
    });

    const aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText);

    if (
      !aiResumeReport ||
      !aiResumeReport.output ||
      !Array.isArray(aiResumeReport.output) ||
      aiResumeReport.output.length === 0 ||
      !aiResumeReport.output[0].content
    ) {
      throw new Error("Invalid or empty response from AiResumeAnalyzerAgent.");
    }

    const rawContent = aiResumeReport.output[0].content;
    const rawContentJson = rawContent.replace("```json", "").replace("```", "").trim();

    let parseJson;
    try {
      parseJson = JSON.parse(rawContentJson);
    } catch (err) {
      console.error("JSON parsing error:", err.message);
      throw new Error("Failed to parse AI response as JSON.");
    }

    await step.run("SaveToDb", async () => {
      await db.insert(HistoryTable).values({
        recordId,
        content: parseJson,
        aiAgentType,
        createdAt: new Date().toString(),
        userEmail,
        metaData: uploadFileUrl,
      });
    });
   return {
  success: true,
  recordId,
  summary: parseJson.summary || null,
};
  }
);

export const AiRoadmapGeneratorAgent=createAgent({
  name:"AiRoadmapGeneratorAgent",
  desc:"Generate Details Tree Like Flow Roadmap",
  system:'Generate a React flow tree-structured learning roadmap for user input position/skills the following format:vertical tree structure with meaningful x/y positions to form a flow • Structure should be similar to roadmap.sh layout • Steps should be ordered from fundamentals to advanced • Include branching for different specializations (if applicable) • Each node must have a title, short description, and learning resource link • Use unique IDs for all nodes and edges • make it more spacious node position, • Response in JSON format {roadmapTitle: "",  description: "<3-5 Lines>",  duration: "",  initialNodes: [  {  id: "1", type: "turbo",      position: { x: 0, y: 0 },data: {title: "Step Title", description: "Short two-line explanation of what the step covers.", link: "Helpful link for learning this step",}, }, ...], initialEdges: [{id: "e1-2",source: "1",    target: "2", }, ...]}',
    model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
})

export const AiRoadmapAgent=inngest.createFunction({id:"AiRoadMapAgent"},
  {event:'AiRoadmapAgent'},
  async({event,step})=>{
    const {roadmapId,userInput,userEmail}=await event.data;
    const roadmapResult=await AiRoadmapGeneratorAgent.run("userInput : "+ userInput)
    const rawContent=roadmapResult.output[0].content;
const rawContentJson=rawContent.replace('```json','').replace('```','')

    let parseJson;
    try {
      parseJson = JSON.parse(rawContentJson);
    } catch (err) {
      console.error("JSON parsing error:", err.message);
      throw new Error("Failed to parse AI response as JSON.");
    }

    await step.run("SaveToDb", async () => {
    const result=  await db.insert(HistoryTable).values({
        recordId:roadmapId,
        content: parseJson,
        aiAgentType:'/ai-tools/ai-roadmap-agent',
        createdAt: new Date().toString(),
        userEmail,
        metaData: userInput,
      });

    });

return parseJson;

  }
);