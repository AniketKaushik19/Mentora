import {serve} from "inngest/next";
import {inngest} from "@/inngest/client";
import { AiCareerAgent, AiResumeAgent, AiRoadmapAgent, helloWorld } from "@/inngest/function";

// create an api that serves zero functions
export const {GET, POST ,PUT} = serve({ client: inngest,
  functions: [
   AiCareerAgent,
   AiResumeAgent,
   AiRoadmapAgent
],
});

