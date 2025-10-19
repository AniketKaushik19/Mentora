import { Button } from '@/components/ui/button'
import React from 'react'


function WelcomeBanner() {
  return (
    <>
    <div className='bg-gradient-to-r from-red-600  to-purple-500 p-3 rounded  text-white'>
       <h2 className='font-bold text-3xl '>AI Career Coach Agent</h2>
    <p>Smarter career decisions start here - get tailored advice , real-time market insights , and a roadmap built just for you with the power of AI</p>
    <Button className="bg-white text-black mt-3" variant={"outline"}> Let's Get Started</Button>
    </div>
  
    </>
  )
}

export default WelcomeBanner