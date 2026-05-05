import React from 'react'
import { Cpu, Activity, ArrowUpRight, Terminal } from 'lucide-react'

function WelcomeBanner() {
  return (
    <div className='relative p-6 md:p-8 bg-[#050505] border border-white/5 rounded-3xl overflow-hidden group shadow-2xl'>
      {/* Precision Grid Background Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Subtle Corner Glow */}
      <div className='absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all duration-700' />
      
      <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
        
        <div className='flex flex-col gap-3 max-w-2xl'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 bg-white/5 border border-white/10 rounded-lg'>
              <Cpu className='w-4 h-4 text-primary' />
            </div>
            <span className='text-[9px] font-black uppercase tracking-[0.3em] text-slate-500'>
              Core Intelligence System v2.0
            </span>
          </div>

          <div className='space-y-1'>
            <h2 className='font-black text-2xl md:text-3xl tracking-tight text-white'>
              Mentora <span className='text-slate-500 font-medium italic px-1'></span> 
              <span className='bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent'> Intelligence Dashboard</span>
            </h2>
            <p className='text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-lg'>
              Deploying AI-driven learningCourses to architect your professional career path. 
              Integrated logic for real-time skill acquisition.
            </p>
          </div>
        </div>

        {/* Compact Stat Modules */}
        <div className='flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl backdrop-blur-md'>
            <div className='flex items-center gap-3 px-3'>
                <div className='h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20'>
                    <Activity className='w-4 h-4 text-emerald-500' />
                </div>
                <div className='flex flex-col'>
                    <span className='text-white font-black text-sm tracking-tight'>2.4k+</span>
                    <span className='text-[8px] uppercase tracking-widest text-slate-500 font-bold'>Nodes</span>
                </div>
            </div>
            
            <div className='h-8 w-px bg-white/10' />
            
            <div className='flex items-center gap-3 px-3'>
                <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20'>
                    <ArrowUpRight className='w-4 h-4 text-primary' />
                </div>
                <div className='flex flex-col'>
                    <span className='text-white font-black text-sm tracking-tight'>98.2%</span>
                    <span className='text-[8px] uppercase tracking-widest text-slate-500 font-bold'>Accuracy</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default WelcomeBanner