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

function ResumeUploadDialog({openResumeDialog,setOpenResumeDialog} ) {

const [file,setFile]=useState()
const [loading,setLoading]=useState()
const router=useRouter()

// useEffect(() => {
//  setFile([])
// }, [open])


const onFileChange=(e)=>{
const file=e.target.files?.[0];
if(file)
  {
    console.log(file.name);
    setFile(file);
  }
}

const onUploadAnalyze=async()=>{
  setLoading(true);
const recordId = uuidv4();
const formData =new FormData();
 formData.append('recordId',recordId);
 formData.append('resumeFile',file);
//  formData.append('aiAgentType','/ai-tool/ai-resume-analyzer');
 try {
   //send formdata to backend server
   const result=await axios.post('/api/ai-resume-agent',formData)
   console.log(result.data)
   setLoading(false)
   
   router.push('/ai-tool/ai-resume-analyzer')
   setOpenResumeDialog(false)
  
 } catch (error) {
  console.log("error  : "+error)
   }
}

  return (
    <>
    <Dialog open={openResumeDialog} onOpenChange={setOpenResumeDialog}>
  {/* <DialogTrigger ></DialogTrigger> */}
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload Resume Pdf file</DialogTitle>
      <DialogDescription>
       <div>
        <label htmlFor="resumeUpload" className='flex items-center flex-col justify-centerp-7 border border-dashed rounded-xl hover:bg-slate-200 cursor-pointer'>
            <File className='h-10 w-10'/>
           {(file)? <h2 className='mt-3 text-blue-600'>
              {file.name}
            </h2>:
            <h2 className='mt-3'>Click here to Upload Resume</h2>
            }
        </label>
        <input type="file" id="resumeUpload"  className='hidden'
        accept='application/pdf' onChange={onFileChange}/>
       </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant={'outline'}>Cancel</Button>
      <Button disabled={!file || loading} onClick={onUploadAnalyze}>
        {loading?<Loader2Icon className='animate-spin'/>:<Sparkles/>
        }Upload and Analyze</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  )
}

export default ResumeUploadDialog