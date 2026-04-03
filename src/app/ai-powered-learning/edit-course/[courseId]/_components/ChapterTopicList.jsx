"use client";
import React from "react";
import { BookOpen, Clock, Layers } from "lucide-react";

function ChapterTopicList({ course }) {
  // Keeping your exact logic
  const courseLayout = course?.courseJson?.course;

  return (
    <div className="mt-8">
      {/* Compact Heading */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Layers className="w-5 h-5 text-primary opacity-70" />
        <h2 className="font-semibold text-xl tracking-tight text-foreground/90">
            Chapters & Topics
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center gap-12">
        {courseLayout?.chapters?.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="flex flex-col w-full">
            
            {/* Chapter Box - UI Refined */}
            <div className="relative group p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-600/90 to-blue-700/90 text-white shadow-xl transition-all hover:scale-[1.01] w-full max-w-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
                    Chapter {chapterIndex + 1}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full">
                    <Clock size={10} />
                    {chapter.duration}
                </div>
              </div>
              
              <h2 className="text-lg font-bold leading-tight">{chapter.chapterName}</h2>
              
              <div className="flex justify-end text-[10px] mt-4 font-medium opacity-60 italic tracking-widest uppercase">
                {chapter?.topics?.length} Modules Included
              </div>
            </div>

            {/* Topics List - Keeping your mapping logic */}
            <div className="flex flex-col items-start mt-6 ml-6 relative">
              {chapter?.topics?.map((topic, topicIndex) => (
                <div key={topicIndex} className="flex items-center gap-5 py-2 group/topic">
                  
                  {/* Timeline Dot UI */}
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] rounded-full bg-slate-800 border border-primary/40 w-6 h-6 flex items-center justify-center font-bold text-primary transition-all group-hover/topic:bg-primary group-hover/topic:text-white">
                      {topicIndex + 1}
                    </div>
                    
                    {topicIndex !== chapter.topics.length - 1 && (
                      <div className="w-[1px] h-8 bg-white/10 group-hover/topic:bg-primary/30 transition-colors"></div>
                    )}
                  </div>

                  {/* Topic Text UI */}
                  <p className="text-xs md:text-sm text-slate-300 font-medium transition-colors group-hover/topic:text-white py-1">
                    {topic}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterTopicList;