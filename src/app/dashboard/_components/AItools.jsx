import React from 'react'
import AItoolsCard from './AItoolsCard';
export const aiToolsList = [
{path:"/ai-tools/ai-chat",
 name: "AI Career Q&A Chat",
  desc: "Chat with AI Agent",
  button: "Let's Chat",
  icon: "/chatbot.png" // Represents chat or conversation
},
{path:"/ai-tools/ai-resume-analyzer",
 name: "AI Resume Analyzer",
  desc: "Chat with AI Agent",
  button: "Start",
  icon: "/resume.png" // Represents documents or resumes
},
// {path:"/ai-tools/ai-roadmap-agent",
//  name: "Learning Roadmap",
//   desc: "Chat with AI Agent",
//   button: "Get Started",
//   icon: "/roadmap.png" // Represents roadmap or planning
// },
{path:"/ai-tools/ai-coverletter-generator",
 name: "Cover Letter Generator",
  desc: "Chat with AI Agent",
  button: "Create",
  icon: "/cover.png" // Represents letters or email
}
];
function AItools() {
  return (
    <div className='border  p-2 rounded md:p-4 my-7 space-y-4'>
        {/* <h2 className='text-black font-bold'>Available AI Tools</h2> */}
        <h2 className='font-bold'>Available AI Tools</h2>
        <p className='text-gray-500'>Start Building and shape your career with the exclusive AI Tools</p>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {aiToolsList.map((tool, index) => (
    <AItoolsCard tool={tool} key={index} />
  ))}
</div>
</div>

  )
}

export default AItools