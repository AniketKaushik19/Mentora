"use client";
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useSelectedChapter } from "@/app/context/SelectedChapterindexContext";
import { CheckCircle2, Circle, Lock, BookOpen, ChevronRight } from "lucide-react";

function ChapterListSidebar({ courseInfo, onChapterSelect }) {
  const courseContent = courseInfo?.courses?.courseContent;
  const enrollCourse = courseInfo?.enrollCourse;
  const { selectedChapterIndex, setSelectedChapterIndex } = useSelectedChapter();
  let completedChapters = enrollCourse?.completedChapters ?? [];

  const handleChapterClick = (index) => {
    setSelectedChapterIndex(index);
    // onChapterSelect is used to close the sidebar on mobile if passed from parent
    if (onChapterSelect) onChapterSelect();
  };

  return (
    <div className='w-80 h-full bg-[#030712] border-r border-white/10 flex flex-col antialiased'>
      {/* --- Sidebar Header --- */}
      <div className='p-6 border-b border-white/5 bg-white/[0.01]'>
        <div className='flex items-center gap-2 mb-1'>
          <BookOpen className='w-4 h-4 text-purple-400' />
          <span className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-500'>Course_Curriculum</span>
        </div>
        <h2 className='text-xl font-bold text-white tracking-tight'>
          Chapters <span className='text-slate-600'>({courseContent?.length || 0})</span>
        </h2>
      </div>

      {/* --- Scrollable Content --- */}
      <div className='flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2'>
        <Accordion type="single" collapsible className="w-full space-y-2 border-none">
          {courseContent?.map((chapter, index) => {
            const isCompleted = completedChapters.includes(index);
            const isActive = selectedChapterIndex === index;

            return (
              <AccordionItem 
                value={`item-${index}`} 
                key={index}
                className={`border rounded-xl transition-all duration-300 overflow-hidden
                  ${isActive ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}
                `}
              >
                <div onClick={() => handleChapterClick(index)} className="flex items-center w-full">
                  <AccordionTrigger className={`flex-1 hover:no-underline p-4 text-left group
                    ${isCompleted ? 'text-emerald-400' : isActive ? 'text-white' : 'text-slate-400'}
                  `}>
                    <div className='flex items-center gap-3 pr-2'>
                      {/* Status Icon */}
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-700" />
                        )}
                      </div>
                      
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-purple-400 transition-colors'>
                          Chapter {index + 1}
                        </span>
                        <span className='text-sm font-semibold leading-tight break-words'>
                          {chapter?.courseData?.chapterName}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                </div>

                <AccordionContent className="bg-black/20 px-4 pb-4">
                  <div className='pt-2 space-y-1 border-t border-white/5'>
                    <p className='text-[9px] font-bold text-slate-600 uppercase tracking-tighter mb-2'>Module Topics:</p>
                    {chapter?.courseData?.topics.map((topic, topicIdx) => (
                      <div 
                        key={topicIdx} 
                        className='flex items-center gap-2 p-2 rounded-lg text-[12px] font-medium text-slate-400 hover:text-white transition-colors'
                      >
                        <ChevronRight className='w-3 h-3 text-purple-500/50' />
                        <span className='line-clamp-1'>{topic?.topic}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* --- Sidebar Footer --- */}
      <div className='p-4 border-t border-white/5 bg-white/[0.01]'>
         <div className='flex items-center justify-between px-2'>
            <span className='text-[10px] font-bold text-slate-500 uppercase'>Progress</span>
            <span className='text-[10px] font-mono text-purple-400'>
              {Math.round((completedChapters.length / (courseContent?.length || 1)) * 100)}%
            </span>
         </div>
         <div className='mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden'>
            <div 
              className='h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-1000'
              style={{ width: `${(completedChapters.length / (courseContent?.length || 1)) * 100}%` }}
            />
         </div>
      </div>
    </div>
  )
}

export default ChapterListSidebar;