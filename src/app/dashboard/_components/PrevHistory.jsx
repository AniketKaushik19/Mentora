'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { useState } from 'react'

function PrevHistory() {
  const [userHistory, setUserHistory] = useState([])
  return (
    <div className='mt-5 p-5 border rounded-xl'>
<h2 className='font-medium'>Previous History</h2>
<h2 className='text-gray-500 text-sm'> What your previously work on , You can find here</h2>
{userHistory?.length == 0 && 
<div className='flex flex-col items-center justify-center mt-5 '>
  <Image src={"/file.svg"} alt='bulb' width={50} height={50}/>
  <h2>You do not have any history</h2>
  <Button className="my-1">Explore AI Tools</Button>
</div>
}

    </div>
  )
}

export default PrevHistory