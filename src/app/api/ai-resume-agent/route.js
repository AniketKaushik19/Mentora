// import { NextRequest, NextResponse } from "next/server";
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

// import { inngest } from "@/inngest/client";
// import axios from "axios";
// import { currentUser } from "@clerk/nextjs/server";

// export async function POST(req) {

//    const user = await currentUser();
//   const formData = await req.formData();
//   const resumeFile = formData.get("resumeFile");
//   const recordId = formData.get("recordId");
//   const loader = new WebPDFLoader(resumeFile);
//   const docs = await loader.load();

//   // console.log(docs[0]); //Raw pdf text
//   const arrayBuffer = await resumeFile.arrayBuffer();
//   const base64 = Buffer.from(arrayBuffer).toString("base64");
// // console.log("Sending to Inngest:", {
// //   recordId,
// //   base64ResumeFile: base64,
// //   pdfText: docs?.[0]?.pageContent?.trim(),
// //   aiAgentType: "/ai-tool/ai-resume-analyzer",
// //   userEmail: user?.primaryEmailAddress?.emailAddress || null,
// // });

//   const resultIds = await inngest.send({
//     name: "AiResumeAgent",
//     data: {
//       recordId: recordId,
//       base64ResumeFile: base64,
//       pdfText: docs?.[0]?.pageContent?.trim() || "",
//       aiAgentType:'/ai-tools/ai-resume-analyzer',
//       userEmail:user?.primaryEmailAddress?.emailAddress
//     },
//   });
//   const runId = resultIds?.ids[0];
//   // console.log("runId"  + runId )
//   let runStatus;
//   while (true) {
//     runStatus = await getRuns(runId);
//     if (runStatus?.data[0]?.status === "Completed") break;
//     if (runStatus?.data[0]?.status === "Cancelled") break;
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
      
//     } catch (error) {
//       console.log("MY ERR: "+error)
//     }
//   }
// if (
//   Array.isArray(runStatus?.data) &&
//   runStatus.data.length > 0 &&
//   runStatus.data[0]?.output?.output &&
//   Array.isArray(runStatus.data[0].output.output) &&
//   runStatus.data[0].output.output.length > 0
// ) {
//   return NextResponse.json(runStatus.data[0].output.output[0] || runStatus.data[0].output );
// } else {
//   return NextResponse.json({ error: "Missing or invalid output data from runStatus." }, { status: 500 });
// }

// }

// export async function getRuns(runId) {
//   try {
//     const result = await axios.get(
//       process.env.INNGEST_SERVER_HOST + "/v1/events/" + runId + "/runs",
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
//         },
//       }
//     );
//     return result.data;
//   } catch (error) {
//     console.error("Error fetching run status:", error);
//     return null;
//   }
// }
