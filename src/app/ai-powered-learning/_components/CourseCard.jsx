"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Book, Loader2, PlayCircle, Settings, Clock, Terminal, Activity } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'sonner';

function CourseCard({ course }) {
  const courseJson = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);

  const onEnrollCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await axios.post('/ai-powered-learning/api/enroll-course/', {
        courseId: course?.cid
      });
      if (result.data.resp) {
        toast.warning('Neural Link already established');
        return;
      }
      toast.success('Protocol Initiated: Successfully Enrolled');
    } catch (e) {
      toast.error('System error, please retry');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='group relative overflow-hidden border border-white/10 bg-[#080808] transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] mt-10'>
      
      {/* 1. TOP BANNER - SHARP EDGES */}
      <div className="relative aspect-video overflow-hidden border-b border-white/5">
        <Image 
          src={course?.bannerImageUrl || '/resume.png'} 
          alt={course?.name} 
          width={400} 
          height={225}
          className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.4] group-hover:grayscale-0'
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90" />
        
        {/* Technical Level Badge - Rectangular */}
        <div className="absolute top-0 left-0 px-3 py-1 bg-primary text-primary-foreground flex items-center gap-2">
           <Activity className="w-3 h-3 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                {course?.level || 'Intermediate'}
           </span>
        </div>
      </div>

      <div className='flex flex-col p-6 gap-5 relative'>
        {/* Title & Description */}
        <div className="space-y-2">
            <h2 className='font-black text-xl tracking-tighter text-white line-clamp-1 group-hover:text-primary transition-colors uppercase'>
                {courseJson?.name || course?.name}
            </h2>
            <p className='line-clamp-2 text-xs text-slate-500 leading-relaxed font-medium italic'>
                {courseJson?.description}
            </p>
        </div>

        {/* Technical Stats Row */}
        <div className="flex items-center gap-4 py-3 border-y border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-2 px-2">
                <Book className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    {courseJson?.noOfChapters || 0} Modules
                </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 px-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Est. 2.5H
                </span>
            </div>
        </div>

        {/* Dynamic Action Button - Solid Monochrome */}
        <div className="mt-1">
            {course?.courseContent?.length ? (
                <Button 
                    className="w-full cursor-pointer h-12 rounded-none bg-white text-black hover:bg-slate-200 transition-all font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-white/5 active:scale-[0.98] gap-2" 
                    onClick={onEnrollCourse} 
                    disabled={loading}
                >
                    {loading ? <Loader2 className='animate-spin w-4 h-4' /> : <Terminal className="w-4 h-4 stroke-[3px]" />}
                    {loading ? 'Linking...' : 'Enroll Protocol'}
                </Button>
            ) : (
                <Link href={'/ai-powered-learning/edit-course/' + course?.cid} className="w-full">
                    <Button 
                        variant='outline' 
                        className="w-full cursor-pointer h-12 rounded-none border-white/10 font-black text-xs uppercase tracking-[0.3em] bg-white/5 hover:bg-white/10 transition-all gap-2"
                    >
                        <Settings className='w-4 h-4 text-primary' />
                        Synthesize Path
                    </Button>
                </Link>
            )}
        </div>
      </div>

      {/* Decorative Corner Bracket */}
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 pointer-events-none" />
    </div>
  )
}

export default CourseCard;