import React, { useContext } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useSelectedChapter } from "@/app/context/SelectedChapterindexContext";
function ChapterListSidebar({courseInfo}) {
    const course=courseInfo?.courses;
    const enrollCourse=courseInfo?.enrollCourse;
    const courseContent=courseInfo?.courses?.courseContent
    const { selectedChapterIndex, setSelectedChapterIndex } = useSelectedChapter(); 
    let completedChapter=enrollCourse?.completedChapters ?? [];
   
  return (
    <div className='w-80 bg-gray-700 p-5 '>
        <h2 className='my-3 bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text font-semibold text-2xl '>Chapters ({courseContent?.length})</h2>
      <Accordion type="single" collapsible>
        {courseContent?.map((chapter,index)=>(
       <AccordionItem value={chapter?.courseData?.chapterName} key={index}
       onClick={()=>setSelectedChapterIndex(index)}>
    <AccordionTrigger className={`
       ${completedChapter.includes(index) ? 'p-2 my-1 text-green-800 bg-gradient-to-r from-gray-300 to-green-300 font-semibold':'text-white'}`}>
      {index+1}. {chapter?.courseData?.chapterName}
      </AccordionTrigger>
    <AccordionContent asChild>
      <div >
        {chapter?.courseData?.topics.map((topic,index_)=>(
          <h2 key={index_} className={`rounded-md p-2  my-2 
            ${completedChapter.includes(index) ? 'text-green-800 bg-gradient-to-r from-gray-300 to-green-300 font-semibold':'text-white bg-gradient-to-r from-purple-500 to-blue-500'}`}> {topic?.topic}</h2>
        ))}
      </div>
    </AccordionContent>
  </AccordionItem>
        ))}
  
</Accordion>
    </div>
  )
}

export default ChapterListSidebar
