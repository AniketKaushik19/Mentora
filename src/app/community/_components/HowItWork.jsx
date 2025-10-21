import React from 'react'
import { useState } from 'react'
import { platformTabs } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
const HowItWork = () => {
    const [activeTab , setActiveTab]=useState(0)
  return (
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className='max-w-7xl mx-auto'>
             <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
                  <span className="gradient-text-primary">How it works</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">Three powerful modules working together to supercharge your content creation.</p>
             </div>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                   <div className="space-y-4">
                     {platformTabs.map((tab,index)=>{
                        return <Button className={"w-full justify-start h-auto p-6"} key={index}
                          variant={activeTab===index ? "outline" : "ghost"}
                          onClick={()=>setActiveTab(index)}
                        >
                         <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeTab===index?"bg-gradient-to-br from-purple-500 to-blue-500":"bg-muted"}`}>
                              <tab.icon className="w-6 h-6"/>
                           </div>
                              <div className="text-left">
                                  <h3 className="font-bold text-lg">{tab.title}</h3>
                              </div>
                         </div>
                        </Button>
                     })}
                   </div>
                </div>

                <div className="lg:w-2/3">
                    <Card className="bg-gray-900/50 border-gray-800">
                        <CardHeader>
                            <CardTitle>{platformTabs[activeTab].title}</CardTitle>
                            <CardDescription>{platformTabs[activeTab].description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid sm:grid-cols-2 gap-4'>
                                {platformTabs[activeTab].features.map((feature,index)=>(
                                    <div key={index} className='flex items-center gap-3'>
                                        <CheckCircle className='w-5 h-5 text-green-400 flex-shrink-0'/>
                                        <span className='text-gray-300'>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </section>
  )
}

export default HowItWork