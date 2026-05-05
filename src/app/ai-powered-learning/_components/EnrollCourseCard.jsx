"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, ShieldCheck, Terminal, Layers, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function EnrollCourseCard({ course, enrollCourse }) {
  // Safely parse JSON if stored as string
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

  const name = courseJson?.name || course?.name || "Untitled Course";
  const description = courseJson?.description || course?.description || "No description available.";
  const banner = course?.bannerImageUrl || "/default-banner.jpg";

  const CalculatePerProgress = () => {
    const completed = enrollCourse?.completedChapters?.length ?? 0;
    const total = course?.courseContent?.length ?? 1;
    return Math.round((completed / total) * 100);
  };

  const progressValue = CalculatePerProgress();

  return (
    <div className="group relative overflow-hidden border border-white/10 bg-[#080808] hover:border-primary/50 transition-all duration-300 shadow-2xl">
      
      {/* 1. TOP IMAGE SECTION - SHARP EDGES */}
      <div className="relative aspect-video overflow-hidden border-b border-white/5">
        <Image
          src={banner}
          alt={name}
          width={400}
          height={300}
          className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90" />
        
        {/* Category/Status Badge - Rectangular */}
        <div className="absolute top-0 left-0 px-3 py-1 bg-primary text-primary-foreground flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural Track</span>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="flex flex-col p-5 pt-4 gap-5">
        <div className="space-y-2">
          <h2 className="font-black text-lg text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors uppercase">
            {name}
          </h2>
          <div className="flex items-center gap-4 text-slate-500">
             <div className="flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{course?.courseContent?.length || 0} Modules</span>
             </div>
             <div className="h-3 w-px bg-white/10" />
             <div className="flex items-center gap-1.5">
                <Timer className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{courseJson?.level || "Standard"}</span>
             </div>
          </div>
        </div>

        {/* 3. TECHNICAL PROGRESS MODULE - SHARP EDGES */}
        <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors relative">
          {/* Decorative Corner Bracket (Optional for industrial look) */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
          
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
               <span className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-500">Sync Status</span>
               <span className="text-[10px] font-bold text-slate-300">PHASE 0{Math.floor(progressValue/25) + 1}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white">{progressValue}</span>
                <span className="text-[10px] font-bold text-slate-500">%</span>
            </div>
          </div>
          
          <Progress 
            value={progressValue} 
            className="h-1 bg-white/5 rounded-none" // Force sharp progress bar
          />
        </div>

        {/* 4. ACTION BUTTON - SHARP EDGES */}
        <Link href={`/ai-powered-learning/view-course/${course?.cid}`} className="w-full">
          <Button className="w-full h-12 cursor-pointer bg-white text-black hover:bg-slate-200 transition-all rounded-none font-black text-xs uppercase tracking-[0.3em] gap-3 shadow-white/5 active:scale-[0.98]">
            <Terminal className="h-4 w-4 stroke-[3px]" />
            ResumeCourse
          </Button>
        </Link>
      </div>

      {/* Background Glow - Now Rectangular */}
      <div className="absolute -inset-px bg-primary opacity-0 group-hover:opacity-5 blur-xl transition-opacity pointer-events-none" />
    </div>
  );
}

export default EnrollCourseCard;