import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Book, Clock, Loader2Icon, PlayCircle, Settings, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

function CourseInfo({ course,viewCourse }) {
  const courseLayout = course?.courseJson?.course;
   const [loading,setLoading]=useState(false);
   const router=useRouter();
   const GenerateCourseContent=async()=>{
    setLoading(true);
    try{
    const result=await axios.post('/ai-powered-learning/api/generate-course-content',{
         courseJson:courseLayout,
         courseTitle:course?.name,
         courseId:course?.cid

    });
    console.log(result.data);
    setLoading(false);
    router.replace('/ai-powered-learning')
    toast.success("Course content generated successfully");
  }
  catch(e){
    console.log(e);
setLoading(false);
toast.error("server side error, try again");
  }
   }
 

  return (
    <div className='flex flex-col md:flex-row justify-between items-center gap-5 p-3 md:p-5 rounded-2xl mt-10 md:mt-20 border border-white shadow shadow-gray-400'>
      <div className='flex flex-col items-center md:items-start text-center md:text-left gap-3 w-full md:w-1/2'>
        <h2 className='font-bold text-2xl'>{courseLayout?.name}</h2>
        <p className='line-clamp-2 mt-2 text-gray-500'>{courseLayout?.description}</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-2 w-full'>
          <div className='flex gap-3 items-center p-3 rounded-md border border-white shadow shadow-gray-400'>
            <Clock className='text-blue-500' />
            <section>
              <h2 className='font-bold'>Duration</h2>
              <h2>2 Hours</h2>
            </section>
          </div>
          <div className='flex gap-3 items-center p-3 rounded-md border border-white shadow shadow-gray-400'>
            <Book className='text-green-500' />
            <section>
              <h2 className='font-bold'>Chapters</h2>
              <h2>{course?.noOfChapters}</h2>
            </section>
          </div>
          <div className='flex gap-3 items-center p-3 rounded-md border border-white shadow shadow-gray-400'>
            <TrendingUp className='text-red-500' />
            <section>
              <h2 className='font-bold'>Difficulty Level</h2>
              <h2>{course?.level}</h2>
            </section>
          </div>
        </div>
          {!viewCourse ? <Button onClick={GenerateCourseContent} className='p-4 mt-2 cursor-pointer text-white bg-gradient-to-r from-purple-700 to-blue-700 hover:bg-purple-700'
        disabled={loading}
        >
          {loading? <Loader2Icon className='animate-spin'/>:<Settings/>}
          Generate Content
        </Button>
        :
        <Link href={'/course/'+course?.cid}>
        <Button className='p-4 mt-2 cursor-pointer text-white bg-gradient-to-r from-purple-700 to-blue-700 hover:bg-purple-700'
        disabled={loading}> <PlayCircle/>Continue Learning</Button></Link>}
      </div>

      <Image
        src={course?.bannerImageUrl || '/default-banner.jpg'}
        alt='banner image'
        width={400}
        height={400}
        className='w-full md:w-[400px] h-auto md:h-[240px] mt-5 md:mt-0 object-cover rounded-2xl'
      />
    </div>
  );
}

export default CourseInfo;
