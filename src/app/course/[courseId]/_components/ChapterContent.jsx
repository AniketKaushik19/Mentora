import { useSelectedChapter } from "@/app/context/SelectedChapterindexContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, Loader2Icon, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useState } from 'react'
import YouTube from "react-youtube";
import { toast } from "sonner";

function ChapterContent({courseInfo,refreshData}) {
  const {courseId}=useParams();
  const {course,enrollCourse}=courseInfo ?? '';
      const courseContent=courseInfo?.courses?.courseContent
      const { selectedChapterIndex, setSelectedChapterIndex } = useSelectedChapter();
      const videoData=courseContent?.[selectedChapterIndex]?.youtubeVideo
      const topics=courseContent?.[selectedChapterIndex]?.courseData?.topics
      let completedChapter=enrollCourse?.completedChapters ?? [];
      const [loading,setLoading]=useState(false);
const markChapterCompleted=async()=>{
  setLoading(true);
    completedChapter.push(selectedChapterIndex);
    const result =await axios.put('/ai-powered-learning/api/enroll-course',{
     courseId:courseId,
     completedChapter:completedChapter
    });
    console.log(result);
    refreshData()
    toast.success('Chapter marked completed!')
   setLoading(false);
}

const markChapterInCompleted=async()=>{
  setLoading(true);
const completedChap=completedChapter.filter(item=>item!=selectedChapterIndex);
    const result =await axios.put('/ai-powered-learning/api/enroll-course',{
     courseId:courseId,
     completedChapter:completedChap
    });
    console.log(result);
    refreshData()
    toast.error('Chapter marked incompleted!')
    setLoading(false);  
}

  return (

    <div className='p-10 mt-20'>
      <div className="flex justify-between items-center">
      <h2 className='font-bold text-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text'>{selectedChapterIndex+1}. {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}</h2>
      {!completedChapter?.includes(selectedChapterIndex) ? <Button onClick={()=>markChapterCompleted()} className='cursor-pointer bg-gradient-to-r from-purple-800  to-blue-600 text-white'
        disabled={loading}
        >{loading?<Loader2Icon className="animate-spin"/>:<CheckCircle/>} Mark as Completed</Button>:
      <Button onClick={markChapterInCompleted} className='cursor-pointer bg-gradient-to-r from-purple-500  to-blue-500 text-white'
      disabled={loading}
      >{loading?<Loader2Icon className="animate-spin"/>:<X className="text-red-600 font-bold "/>} Mark as incompleted</Button>}
       </div>
       <h2 className="font-bold text-lg my-2">Related Videos 📷</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {videoData?.map((video,index)=>index<2 &&(
            <div key={index} className="rounded-lg">
            <YouTube videoId={video?.videoId}
            opts={{
              height:'260',
              width:'400',
              
            }}
            />
            </div>
        ))}
       </div>
       <div className="mt-7">
               {topics?.map((topic,index)=>(
            <div key={index} className="mt-10 p-5 rounded-lg bg-slate-800">
              <h2 className='font-bold text-2xl bg-gradient-to-r from-purple-300 to-blue-500 text-transparent bg-clip-text'>{index+1}. {topic?.topic}</h2>
              {/* <p>{topic?.content}</p> */}
              <div dangerouslySetInnerHTML={{__html: topic?.content}}
              style={{
                lineHeight:'2.5'
              }}></div>
         </div>
               ))}
       </div>
    </div>
  )
}

export default ChapterContent

