import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { currentUser } from "@clerk/nextjs/server";
import { inngest } from "@/inngest";
import axios from "axios";

export async function POST(req) {
  try {
    const user = await currentUser();
    const formData = await req.formData();
    const resumeFile = formData.get("resumeFile");
    const recordId = formData.get("recordId");

    if (!resumeFile) {
      throw new Error("Missing resume file");
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🧠 Extract text using pdfreader
    const pdfText = await extractTextFromPDF(buffer);
    const base64 = buffer.toString("base64");

    const resultIds = await inngest.send({
      name: "AiResumeAgent",
      data: {
        recordId,
        base64ResumeFile: base64,
        pdfText: pdfText || "",
        aiAgentType: "/ai-tools/ai-resume-analyzer",
        userEmail: user?.primaryEmailAddress?.emailAddress || null,
      },
    });

    const runId = resultIds?.ids?.[0];
    let runStatus;

    while (true) {
      runStatus = await getRuns(runId);
      const status = runStatus?.data?.[0]?.status;
      if (status === "Completed" || status === "Cancelled") break;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const output =
      runStatus?.data?.[0]?.output?.output?.[0] ||
      runStatus?.data?.[0]?.output;

    if (!output) {
      return NextResponse.json(
        { error: "Missing or invalid output data from Inngest" },
        { status: 500 }
      );
    }

    return NextResponse.json(output);
  } catch (error) {
    console.error("❌ Error processing resume:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getRuns(runId) {
  try {
    const result = await axios.get(
      `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
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