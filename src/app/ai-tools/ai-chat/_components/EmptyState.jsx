import React from 'react'

const quesList=[
    "What are the top skills required for a career in data science?",
    "How can I transition from a marketing role to a product management role?",
    "Can you suggest some effective networking strategies for career growth?",
]

function EmptyState({setUserInput}) {
  return (
    <div>
<h2 className="font-bold text-xl text-center ">
  Ask anything about your career!   
</h2>

<div>
    {quesList.map((ques,index)=>(
        <h2 className='p-4 text-center border rounded-lg my-3 hover:border-primary cursor-pointer' onClick={()=>setUserInput(ques)} key={index}>{ques}</h2>
    ))}
</div>

    </div>
  )
}

export default EmptyState