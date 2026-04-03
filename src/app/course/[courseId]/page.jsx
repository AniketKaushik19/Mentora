"use client"
import React, { useEffect, useState } from 'react'
import ChapterListSidebar from './_components/ChapterListSidebar'
import ChapterContent from './_components/ChapterContent'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { SelectedChapterIndexProvider } from '@/app/context/SelectedChapterindexContext';

function Course() {
    const {courseId}=useParams();
    const [courseInfo,setCourseInfo]=useState();
    useEffect(() => {
        GetEnrollCourseById();
      }, []);
    
      const GetEnrollCourseById = async () => {
        try {
          const result = await axios.get("/ai-powered-learning/api/enroll-course?courseId="+courseId);
          console.log(result.data);
          setCourseInfo(result.data);
        } catch (error) {
          console.error("Error fetching enrolled courses:", error);
        }
      };
  return (
    <SelectedChapterIndexProvider>
    <div className='flex gap-10'>
      <ChapterListSidebar courseInfo={courseInfo}/>
      <ChapterContent courseInfo={courseInfo} refreshData={()=>GetEnrollCourseById()}/>
    </div>
    </SelectedChapterIndexProvider>
  )
}

export default Course
