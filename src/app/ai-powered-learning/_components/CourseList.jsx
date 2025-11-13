"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewCourseDialog from './AddNewCourseDialog';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import CourseCard from './CourseCard';

function CourseList() {
    const [courseList,setCourseList]=useState([]);
    const {user}=useUser();
   useEffect(()=>{
    user && GetCourseList();
   },[user])

    const GetCourseList=async()=>{
      const result=await axios.get('/ai-powered-learning/api/courses');
      console.log(result.data)
      setCourseList(result.data);
    }
  return (
    <div className="mt-2">
      <h2 className='font-bold text-3xl '></h2>
      {courseList?.length==0? 
      <div className='flex p-7 items-center justify-center flex-col border mt-5 bg-gray-900 rounded-md'>
        <Image src={'/online-education.jpg'} alt='edu' width={120} height={150} className='rounded-md'/>
        <h2 className="my-2 text-xl font-bold">Looks like you haven't created any courses yet</h2>
        <AddNewCourseDialog>
        <Button className={'cursor-pointer bg-gradient-to-r from-purple-800  to-blue-700 text-white '}>+ Create you first course</Button>
        </AddNewCourseDialog>
        </div>:
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
            {courseList?.map((course,index)=>(
               <CourseCard course={course} key={index}/>
            ))}
        </div>}
    </div>
  )
}

export default CourseList
