"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Book, Loader2, PlayCircle, Settings, Sparkles, Clock } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'sonner';

function CourseCard({ course }) {
  const courseJson = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);

  const onEnrollCourse = async (e) => {
    e.preventDefault(); // Prevent accidental link navigation
    try {
      setLoading(true);
      const result = await axios.post('/ai-powered-learning/api/enroll-course/', {
        courseId: course?.cid
      });
      if (result.data.resp) {
        toast.warning('Neural Link already established (Already Enrolled)');
        return;
      }
      toast.success('Successfully Enrolled');
    } catch (e) {
      toast.error('System error, please retry');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='group relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-md transition-all duration-500 hover:scale-[1.03] hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]'>
      
      {/* Top Banner with Overlay Gradient */}
      <div className="relative aspect-video overflow-hidden">
        <Image 
          src={course?.bannerImageUrl || '/resume.png'} 
          alt={course?.name} 
          width={400} 
          height={225}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0'
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/90">
            {course?.level || 'Intermediate'}
        </div>
      </div>

      <div className='flex flex-col p-5 gap-4 relative'>
        {/* Title & Description */}
        <div className="space-y-2">
            <h2 className='font-black text-lg tracking-tight line-clamp-1 group-hover:text-primary transition-colors'>
                {courseJson?.name || course?.name}
            </h2>
            <p className='line-clamp-2 text-xs text-muted-foreground leading-relaxed font-medium'>
                {courseJson?.description}
            </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 border-t border-white/5 pt-4">
            <div className="flex items-center gap-1.5 opacity-60">
                <Book className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{courseJson?.noOfChapters || 0} Units</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">2h Est.</span>
            </div>
        </div>

        {/* Dynamic Action Button */}
        <div className="mt-2">
            {course?.courseContent?.length ? (
                <Button 
                    className="w-full cursor-pointer h-11 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-95" 
                    onClick={onEnrollCourse} 
                    disabled={loading}
                >
                    {loading ? <Loader2 className='animate-spin w-4 h-4' /> : <PlayCircle className="w-4 h-4 mr-2" />}
                    {loading ? 'Linking...' : 'Enroll Course'}
                </Button>
            ) : (
                <Link href={'/ai-powered-learning/edit-course/' + course?.cid} className="w-full">
                    <Button 
                        variant='outline' 
                        className="w-full cursor-pointer h-11 rounded-xl border-white/10 font-black text-[10px] uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 transition-all"
                    >
                        <Settings className='w-4 h-4 mr-2 text-primary opacity-70' />
                        Synthesize Path
                    </Button>
                </Link>
            )}
        </div>
      </div>

      {/* Subtle Bottom Glow on Hover */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}

export default CourseCard;