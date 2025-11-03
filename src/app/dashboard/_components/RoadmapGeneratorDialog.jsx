import React, { useState,useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { File, Loader2Icon, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

function RoadmapGeneratorDialog({openRoadmapDialog,setOpenRoadmapDialog} ) {

const [loading,setLoading]=useState()
const router=useRouter()
const [userInput,setUserInput]=useState()

const GenerateRoadmap=async()=>{
 const roadmapId=uuidv4()
 setLoading(true);
  try {
  const result=await axios.post('/api/ai-roadmap-agent',{
roadmapId:roadmapId,
userInput:userInput
  })
  console.log("roadmap result "+result.data)
  router.push('/ai-tools/ai-roadmap-agent/'+ roadmapId)
} catch (error) {
 console.log("err raodmap "+error)
 }
 finally{
  setLoading(false)
 }
}

  return (
    <>
    <Dialog open={openRoadmapDialog} onOpenChange={setOpenRoadmapDialog}>
  {/* <DialogTrigger ></DialogTrigger> */}
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Enter Position / Skills to Generate Roadmap</DialogTitle>
      <DialogDescription>
       <div>
       <Input placeholder='e.g Full Stack Developer' onChange={(event)=>setUserInput(event?.target?.value)}/>
       </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant={'outline'}>Cancel</Button>
      <Button disabled={loading || !userInput} onClick={GenerateRoadmap}>
        {loading?<Loader2Icon className='animate-spin'/>:<Sparkles/>
        }Generate</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  )
}

export default RoadmapGeneratorDialog