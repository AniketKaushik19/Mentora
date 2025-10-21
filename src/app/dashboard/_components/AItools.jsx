import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
function AItools() {
   const aiTools = [
  {path:"/ai-tools/ai-chats",
    title: "AI Career Q&A Chat",
    subtitle: "Chat with AI Agent",
    buttonLabel: "Let's Chat",
    icon: "chatbot.png" // Represents chat or conversation
  },
  {path:"/resume-analyzer",
    title: "AI Resume Analyzer",
    subtitle: "Chat with AI Agent",
    buttonLabel: "Start",
    icon: "resume.png" // Represents documents or resumes
  },
  {path:"/learning-roadmap",
    title: "Learning Roadmap",
    subtitle: "Chat with AI Agent",
    buttonLabel: "Get Started",
    icon: "roadmap.png" // Represents roadmap or planning
  },
  {path:"/cover-letter-generator",
    title: "Cover Letter Generator",
    subtitle: "Chat with AI Agent",
    buttonLabel: "Create",
    icon: "cover.png" // Represents letters or email
  }
];

  return (
    <div className='border  p-2 rounded p-4 my-7 space-y-4'>
        <h2 className='text-black font-bold'>Available AI Tools</h2>
        <p className='text-gray-500'>Start Building and shape your career with the exclusive AI Tools</p>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {aiTools.map((tool, index) => (
    <Card key={index} className="w-full">
      <CardHeader className="flex flex-col flex-wrap items-start space-y-2">
        <CardTitle>
            <img src={tool.icon} alt="Icons"  width={50}/></CardTitle>
        <CardDescription>
          <h2 className="font-black text-black text-medium">{tool.title}</h2>
          <p>{tool.subtitle}</p>
        </CardDescription>
        <CardAction className="w-full">
            <Link href={tool.path} className="w-full">
          <Button className="rounded-sm w-full hover:cursor-pointer">{tool.buttonLabel}</Button>
            </Link>
        </CardAction>
      </CardHeader>
    </Card>
  ))}
</div>
</div>

  )
}

export default AItools