import { socialProofStats } from '@/lib/data'
import React from 'react'

const SocialStat = () => {
  return (
    <section className='relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-gray-900/50 to-purple-900/20'>
        <div className='max-w-7xl mx-auto text-center'>
            <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-12 sm:mb-16'>
                <span className='gradient-text-primary'>Loved by creators worldwide
                </span>
            </h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8'>
                {socialProofStats.map((stat,index)=>(
                    <div key={index} className='text-center'>
                      <div className='w-12 h-12 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                        <stat.icon className='w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white' />
                    </div>
                        <div className='text-3xl sm:text-4xl lg:text-5xl font-black mb-2 gradient-text-accent'>
                            {stat.metric}
                        </div>
                        <div className='text-gray-400 text-base sm:text-lg'>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default SocialStat