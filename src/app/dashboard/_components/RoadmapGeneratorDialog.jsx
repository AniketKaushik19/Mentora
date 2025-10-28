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


const onGenerate=async()=>{
 
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
       <Input placeholder='e.g Full Stack Developer'/>
       </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant={'outline'}>Cancel</Button>
      <Button disabled={loading} onClick={onGenerate}>
        {loading?<Loader2Icon className='animate-spin'/>:<Sparkles/>
        }Generate</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  )
}

export default RoadmapGeneratorDialog