import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user=await currentUser()
  const { roadmapId, userInput } = await req.json();
  console.log(
    "going to send:"+
          "userInput:"+ userInput+
          "roadmapId:"+roadmapId+
      ",userEmail:"+user?.primaryEmailAddress?.emailAddress
        )
  const resultIds = await inngest.send({
      name: "AiRoadmapAgent",
      data: {
        userInput: userInput,
        roadmapId:roadmapId,
        userEmail:user?.primaryEmailAddress?.emailAddress
      },
    });
  const runId = resultIds?.ids[0];
  console.log("rundid "+runId )
  let runStatus;
  //use polling to check run status
  while (true) {
    runStatus = await getRuns(runId);
    if (runStatus?.data[0]?.status === "Completed") break;
     if (runStatus?.data[0]?.status === "Cancelled") break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
console.log(JSON.stringify(runStatus.data?.[0], null, 2));
  return NextResponse.json(runStatus.data?.[0].output || runStatus.data?.[0].output?.output[0]  );
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
