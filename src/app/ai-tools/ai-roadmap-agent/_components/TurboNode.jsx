"use client"
import { Handle, Position } from '@xyflow/react'
import Link from 'next/link'
import React, { useState } from 'react'

function TurboNode({ data }) {
  const [expanded, setExpanded] = useState(false)

  return (
  <div className='rounded-xl border border-border bg-card p-4 shadow-sm w-64 transition-all hover:shadow-md'>
      <div className='font-bold text-lg text-white'>{data.title}</div>
      <p className={`text-sm text-white/80 mt-1 ${expanded ? '' : 'line-clamp-2'}`}>
        {data.description}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className='text-blue-600 underline text-sm mt-1 mx-5'
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
      <Link href={data?.link} target='_blank' className='text-blue-600 underline text-sm mt-2 inline-block'>
        Learn More
      </Link>
      <Handle type='target' position={Position.Top} />
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

export default TurboNode