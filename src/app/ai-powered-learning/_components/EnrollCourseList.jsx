"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import EnrollCourseCard from "./EnrollCourseCard";
import { LayoutGrid, Loader2, Activity, Box } from "lucide-react";

function EnrollCourseList() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetEnrollCourse();
  }, []);

  const GetEnrollCourse = async () => {
    try {
      const result = await axios.get("/ai-powered-learning/api/enroll-course");
      setEnrolledCourseList(result.data?.data || result.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Initialising Data Stream</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic text-center">Decrypting enrolled learning paths...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 space-y-12">
      {enrolledCourseList?.length > 0 ? (
        <>
          {/* TECHNICAL HEADER - SHARP DESIGN */}
          <div className="relative group">
            <div className="flex items-center gap-5">
              <div className="shrink-0 p-2.5 bg-white text-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
                  <Activity className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System.Modules</span>
                <h2 className="font-black text-2xl tracking-tighter text-white uppercase">
                  Active Learning Tracks
                </h2>
              </div>
              <div className="h-px flex-1 bg-white/10" />
              <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/[0.02]">
                 <Box className="w-3 h-3 text-slate-500" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{enrolledCourseList.length} Units</span>
              </div>
            </div>
          </div>

          {/* GRID - STRETCHED SPACING */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {enrolledCourseList.map((course, index) => (
              <div 
                key={index} 
                className="animate-in fade-in slide-in-from-bottom-2 duration-700" 
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <EnrollCourseCard
                  course={course?.courses}
                  enrollCourse={course?.enrollCourse}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        /* SHARP EMPTY STATE */
        <div className="py-24 text-center border border-white/10 bg-white/[0.01] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
          
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white/5 border border-white/5">
                <LayoutGrid className="w-8 h-8 text-slate-700" />
            </div>
            <div className="space-y-1">
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[11px]">No ActiveCourses</p>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Initialise a new track from the command console.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrollCourseList;