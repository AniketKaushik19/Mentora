import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import axios from "axios";

export async function POST(req) {

  


  const formData = await req.formData();
  const resumeFile = formData.get("resumeFile");
  const recordId = formData.get("recordId");
  const loader = new WebPDFLoader(resumeFile);
  const docs = await loader.load();

  console.log(docs[0]); //Raw pdf text
  const arrayBuffer = await resumeFile.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const resultIds = await inngest.send({
    name: "AiResumeAgent",
    data: {
      recordId: recordId,
      base64ResumeFile: base64,
      pdfText: docs[0]?.pageContent,
      aiAgentType:'/ai-tool/ai-resume-analyzer',
      userEmail:user?.primaryEmailAddress?.emailAddress
      // userEmail:"soniasharmad1530@gmail.com"
    },
  });
  const runId = resultIds?.ids[0];
  let runStatus;
  while (true) {
    runStatus = await getRuns(runId);
    if (runStatus?.data[0]?.status === "Completed") break;
    if (runStatus?.data[0]?.status === "Cancelled") break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return NextResponse.json(runStatus.data?.[0].output?.output[0]);
}

export async function getRuns(runId) {
  try {
    const result = await axios.get(
      process.env.INNGEST_SERVER_HOST + "/v1/events/" + runId + "/runs",
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching run status:", error);
    return null;
  }
}
