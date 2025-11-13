import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Book, LoaderCircle, PlayCircle, Settings } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'sonner';

function CourseCard({course}) {
    const courseJson=course?.courseJson?.course;
    const [loading,setLoading]=useState(false);
    const onEnrollCourse=async()=>{
      try{
      setLoading(true);
      const result =await axios.post('/ai-powered-learning/api/enroll-course/',{
        courseId:course?.cid
      });
      console.log(result.data);
      if(result.data.resp){
        toast.warning('Already Enrolled');
        setLoading(false);
        return ;
      }
      toast.success('Enrolled')
      setLoading(false);
    }
    catch(e){
      toast.error('server side error')
      setLoading(false);
    }
    }
  return (
    <div className='shadow shadow-gray-300 border-white rounded-xl mt-5 bg-slate-900 hover:scale-[1.02] transition-transform duration-200 ease-in-out cursor-pointer'>
        <Image src={course?.bannerImageUrl || '/default-banner.jpg'} alt={course?.name} width={400} height={300}
        className='w-full aspect-video rounded-t-xl object-cover'
        />
        <div className='flex flex-col p-3 gap-3'>
            <h2 className='font-bold text-lg'>{courseJson?.name}</h2>
            <p className='line-clamp-3 text-gray-400 text-sm'>{courseJson?.description}</p>
            <div className='flex items-center justify-between '>
        <h2 className='flex items-center gap-2'><Book className='text-blue-500'/>{courseJson?.noOfChapters} Chapters</h2>
        {course?.courseContent?.length?<Button className="cursor-pointer text-white bg-gradient-to-r from-purple-800  to-blue-700" size={'sm'} onClick={onEnrollCourse} disabled={loading}>{loading?<LoaderCircle className='animate-spin'/>:<PlayCircle/>}Enroll Course</Button>:
        <Link href={'/ai-powered-learning/edit-course/'+course?.cid}><Button variant='outline' className="cursor-pointer" size={'sm'}><Settings className='text-blue-500'/>Generate Course</Button></Link>}
        </div >
        </div>
    </div>
  )
}

export default CourseCard
