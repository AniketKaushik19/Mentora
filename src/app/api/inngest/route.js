// src/app/api/inngest/route.ts  (for App Router)
// or src/pages/api/inngest.ts (for Pages Router)
import { serve } from "inngest/next";
import { inngest } from "@/inngest";
import {
  AiCareerAgent,
  // AiResumeAgent,
  AiRoadmapAgent,
  CoverLetterGeneratorFunction,
} from "@/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    AiCareerAgent,
    // AiResumeAgent,
    AiRoadmapAgent,
    CoverLetterGeneratorFunction,
  ],
});
