import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
const ReadyToCreate = () => {
  return (
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
            <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8">
                  <span className="gradient-text-primary">Ready to Create?</span>
               </h2>
               <p className="text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto">Join thousands of creators who are already building their audience and growing their business with our AI-powered platform.</p>
            </div>
             <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start justify-center">
                   <Link href={"/community/dashboard"}>
                     <Button 
                       size={"xl"}
                       variant={"primary"}
                       className={"rounded-full w-full sm:w-auto text-white p-2 cursor-pointer"}
                     >
                        Start Creating for Free
                        <ArrowRight className="h-4 w-4"/>
                     </Button>
                   </Link>
                   <Link href={"/feed"}>
                     <Button 
                       size={"xl"}
                       variant={"outline"}
                       className={"rounded-full w-full sm:w-auto p-2 cursor-pointer"}
                     >
                        Explore the Feed
                        <ArrowRight className="h-4 w-4"/>
                     </Button>
                   </Link>
               </div>
        </section>
  )
}

export default ReadyToCreate