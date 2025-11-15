import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const PROMPT = `Based on the chapter name and its topics, generate educational content for each topic in clean HTML format. 
Respond strictly in valid JSON (no explanations, no markdown). 
Schema:
{
  "chapterName": "",
  "topics": [
    { "topic": "", "content": "" }
  ]
}

User Input:
`;

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const { courseJson, courseTitle, courseId } = await request.json();

    if (!courseJson || !courseJson.chapters) {
      return NextResponse.json(
        { error: "Invalid course JSON received" },
        { status: 400 }
      );
    }

    const promises = courseJson.chapters.map(async (chapter) => {
      const config = { responseMimeType: "text/plain" };
      const model = "gemini-2.5-flash";
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: PROMPT + JSON.stringify(chapter),
            },
          ],
        },
      ];

      let response;
      try {
        response = await ai.models.generateContent({
          model,
          config,
          contents,
        });
      } catch (error) {
        console.error("⚠️ Gemini API Error:", error.message);
        return {
          youtubeVideo: [],
          courseData: {
            chapterName: chapter.chapterName,
            topics: [],
          },
        };
      }

      const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let RawJson = RawResp.replace(/```json|```/g, "").trim();

      // ✅ Safe JSON Parsing
      let JSONResp;
      try {
        JSONResp = JSON.parse(RawJson);
      } catch (err) {
        console.error("❌ JSON parse failed:", err.message);
        console.error("Raw Gemini output (first 400 chars):", RawJson.slice(0, 400));

        try {
          // Try to fix trailing commas and minor issues
          const fixedJson = RawJson
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]");
          JSONResp = JSON.parse(fixedJson);
        } catch (err2) {
          console.error("❌ JSON still invalid after cleaning:", err2.message);
          JSONResp = {
            chapterName: chapter.chapterName,
            topics: [],
          };
        }
      }

      // ✅ Get YouTube videos related to the chapter
      const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
      console.log({
        youtubeVideo: youtubeData,
        courseData: JSONResp,
      });

      return {
        youtubeVideo: youtubeData,
        courseData: JSONResp,
      };
    });

    const CourseContent = await Promise.all(promises);
      // save to database
      const dbResp=await db.update(coursesTable).set({
        courseContent:CourseContent
      }).where(eq(coursesTable.cid,courseId));


    return NextResponse.json({
      courseName: courseTitle,
      courseId,
      CourseContent,
    });
  } catch (err) {
    console.error("❌ Unhandled Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const GetYoutubeVideo = async (topic) => {
  try {
    const params = {
      part: "snippet",
      q: topic,
      maxResults: 4, 
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const youtubeVideoListResp = resp.data.items || [];
    const youtubeVideoList = youtubeVideoListResp.map((item) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
    }));

    console.log("youtubeVideoList", youtubeVideoList);
    return youtubeVideoList;
  } catch (error) {
    console.error("⚠️ YouTube API error:", error.message);
    return [];
  }
};
