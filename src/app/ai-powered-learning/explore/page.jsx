"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Compass, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CourseCard from '../_components/CourseCard';

function Explore() {
    const [courseList,setCourseList]=useState([]);
        const {user}=useUser();
    useEffect(() => {
      if (user) {
       GetCourseList();
      }
    }, [user]);
        const GetCourseList=async()=>{
          const result=await axios.get('/ai-powered-learning/api/courses?courseId=0');
          // console.log(result.data)
          setCourseList(result.data);
        }
  return (
       <div className='max-w-7xl mx-auto px-4 py-3 md:py-6 mt-5 space-y-4'>
            
            {/* COMPACT HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary opacity-80 mb-1">
                        <Compass size={16} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Discovery</span>
                    </div>
                    {/* Compact Heading: Changed from font-bold to font-semibold and text-3xl to text-2xl */}
                    <h2 className='text-2xl font-semibold tracking-tight text-foreground/90'>
                        Explore <span className="text-muted-foreground font-normal">Programs</span>
                    </h2>
                    <p className="text-xs text-muted-foreground max-w-sm">
                        Browse through AI-architected learning paths.
                    </p>
                </div>

                {/* SLIM SEARCH BAR */}
                {/* <div className='flex items-center gap-2 w-full md:max-w-sm bg-card/30 backdrop-blur-md border border-white/5 p-1 rounded-xl shadow-sm'>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                        <Input 
                            placeholder="Find a skill..." 
                            className="bg-transparent border-none focus-visible:ring-0 pl-9 text-xs h-9 placeholder:text-muted-foreground/40"
                        />
                    </div>
                    <Button size="sm" className='rounded-lg h-8 px-4 text-[10px] font-bold uppercase tracking-wider shadow-md shadow-primary/10'>
                        Search
                    </Button>
                </div> */}
            </div>

            {/* COURSE GRID */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                  {courseList?.map((course,index)=>(
                     <CourseCard course={course} key={index} refreshData={GetCourseList}/>
                  ))}
              </div>
        </div>
  )
}

export default Explore
