"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function EnrollCourseCard({ course, enrollCourse }) {
  // ✅ Step 1: Safely parse JSON if stored as string
  let parsedCourseJson = null;
  try {
    parsedCourseJson =
      typeof course?.courseJson === "string"
        ? JSON.parse(course.courseJson)
        : course?.courseJson;
  } catch (err) {
    console.error("Error parsing courseJson:", err);
  }

  const courseJson = parsedCourseJson?.course || {};

  // ✅ Step 2: Handle all possible data sources
  const name = courseJson?.name || course?.name || "Untitled Course";
  const description =
    courseJson?.description || course?.description || "No description available.";
  const banner = course?.bannerImageUrl || "/default-banner.jpg";

  // ✅ Step 3: Progress calculation
  const CalculatePerProgress = () => {
    const completed = enrollCourse?.completedChapters?.length ?? 0;
    const total = course?.courseContent?.length ?? 1;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="shadow shadow-gray-300 border-white rounded-xl mt-5 bg-slate-900 hover:scale-[1.02] transition-transform duration-200 ease-in-out cursor-pointer">
      <Image
        src={banner}
        alt={name}
        width={400}
        height={300}
        className="w-full aspect-video rounded-t-xl object-cover"
      />

      <div className="flex flex-col p-3 gap-3">
        <h2 className="font-bold text-lg text-white">{name}</h2>
        <p className="line-clamp-3 text-gray-400 text-sm">{description}</p>

        <div className="text-sm text-purple-300">
          <h2 className="flex justify-between mb-2 ">
            Progress <span>{CalculatePerProgress()}%</span>
          </h2>
          <Progress value={CalculatePerProgress()} />
        </div>

        <Link href={'/ai-powered-learning/view-course/'+ course?.cid}>
          <Button className="cursor-pointer mt-3 text-center bg-gradient-to-r from-purple-800 to-blue-700 text-white ">
            <PlayCircle className="mr-2 h-5 w-5" />
            Continue Learning
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default EnrollCourseCard;
