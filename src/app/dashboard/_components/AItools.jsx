import React from 'react'
import AItoolsCard from './AItoolsCard';

export const aiToolsList = [
  { path: "/ai-tools/ai-chat", name: "AI Career Q&A Chat", desc: "Real-time career guidance and industry insights.", button: "Let's Chat", icon: "/chatbot.png" },
  { path: "/ai-tools/ai-resume-analyzer", name: "AI Resume Analyzer", desc: "Detailed feedback on your resume impact.", button: "Start Analysis", icon: "/resume.png" },
  { path: "/ai-tools/ai-roadmap-agent", name: "Learning Roadmap", desc: "Step-by-step personalized skill pathways.", button: "Generate", icon: "/roadmap.png" },
  { path: "/ai-tools/ai-coverletter-generator", name: "Cover Letter Generator", desc: "High-conversion letters tailored to jobs.", button: "Create", icon: "/cover.png" }
];

function AItools() {
  return (
   <div className='my-8'>
      {/* Subtle Divider with Label - much cleaner than a big header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-primary whitespace-nowrap">
          Available Tools
        </span>
        <div className="h-[1px] w-full bg-border/50"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiToolsList.map((tool, index) => (
          <AItoolsCard tool={tool} key={index} />
        ))}
      </div>
    </div>
  )
}

export default AItools;