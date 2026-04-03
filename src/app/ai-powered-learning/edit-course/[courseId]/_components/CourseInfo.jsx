"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Book, Clock, Loader2, PlayCircle, Sparkles, TrendingUp, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

function CourseInfo({ course, viewCourse }) {
  const courseLayout = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GenerateCourseContent = async () => {
    setLoading(true);
    try {
      await axios.post('/ai-powered-learning/api/generate-course-content', {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid
      });
      setLoading(false);
      router.replace('/ai-powered-learning');
      toast.success("Course content synthesized successfully");
    } catch (e) {
      setLoading(false);
      toast.error("Neural engine error, please retry");
    }
  };

  return (
    <div className='relative overflow-hidden group rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-md p-5  md:p-8 shadow-2xl transition-all hover:border-primary/20'>
      
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />

      <div className='flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-10 relative z-10'>
        
        {/* TEXT CONTENT */}
        <div className='flex flex-col items-center lg:items-start text-center lg:text-left gap-3 md:gap-4 flex-1 w-full'>
          
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
             <Sparkles className="w-3 h-3 text-primary" />
             <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary">Intelligence Node</span>
          </div>

          {/* Optimized Font Sizes for Mobile */}
          <h2 className='font-black text-xl md:text-3xl lg:text-4xl tracking-tight leading-tight uppercase italic antialiased'>
            {courseLayout?.name || course?.name}
          </h2>
          
          <p className='line-clamp-2 md:line-clamp-3 text-xs md:text-base text-muted-foreground leading-relaxed max-w-xl px-2 md:px-0'>
            {courseLayout?.description}
          </p>

          {/* STATS GRID - 2 columns on mobile, 3 on desktop */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 w-full mt-2'>
            <div className='flex flex-col p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5'>
              <Clock className='text-blue-400 w-4 h-4 mb-1 md:mb-2' />
              <span className='text-[8px] md:text-[10px] uppercase font-bold tracking-widest opacity-50'>Duration</span>
              <span className='text-xs md:text-sm font-bold'>2 Hours</span>
            </div>

            <div className='flex flex-col p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5'>
              <Book className='text-emerald-400 w-4 h-4 mb-1 md:mb-2' />
              <span className='text-[8px] md:text-[10px] uppercase font-bold tracking-widest opacity-50'>Chapters</span>
              <span className='text-xs md:text-sm font-bold'>{course?.noOfChapters || 0} Modules</span>
            </div>

            {/* Hidden on very small screens to save space, or use grid-cols-3 if space allows */}
            <div className='flex flex-col p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1'>
              <TrendingUp className='text-rose-400 w-4 h-4 mb-1 md:mb-2' />
              <span className='text-[8px] md:text-[10px] uppercase font-bold tracking-widest opacity-50'>Complexity</span>
              <span className='text-xs md:text-sm font-bold'>{course?.level || 'Intermediate'}</span>
            </div>
          </div>

          {/* ACTION BUTTON - Mobile Full Width */}
          <div className="mt-4 w-full lg:w-auto">
            {!viewCourse ? (
              <Button 
                onClick={GenerateCourseContent} 
                className='w-full lg:w-auto h-11 md:h-12 px-8 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]'
                disabled={loading}
              >
                {loading ? <Loader2 className='animate-spin mr-2 w-4 h-4'/> : <Zap className="mr-2 w-4 h-4" />}
                {loading ? "Synthesizing..." : "Generate Content"}
              </Button>
            ) : (
              <Link href={'/course/'+course?.cid} className="w-full">
                <Button className='w-full lg:w-auto h-11 md:h-12 px-8 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]'> 
                  <PlayCircle className="mr-2 w-4 h-4"/> Continue Learning
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* BANNER IMAGE - Hidden or Scaled on Mobile */}
        <div className="relative shrink-0 group/img w-full lg:w-auto order-first lg:order-last">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[1.5rem] md:rounded-[2rem] blur opacity-10 group-hover/img:opacity-30 transition duration-1000"></div>
            <Image
                src={course?.bannerImageUrl || '/resume.png'}
                alt='course banner'
                width={400}
                height={260}
                priority
                className='relative w-full lg:w-[400px] h-[160px] md:h-[260px] object-cover rounded-[1.3rem] md:rounded-[1.8rem] shadow-2xl antialiased'
            />
        </div>
      </div>
    </div>
  );
}

export default CourseInfo;