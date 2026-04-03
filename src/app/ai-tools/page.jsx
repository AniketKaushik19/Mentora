import React from "react";
import AItools from "../dashboard/_components/AItools";
import WelcomeBanner from "../dashboard/_components/WelcomeBanner";
import MyHistory from "../my-history/page";

function AiToolsOption() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* 1. MESH GRADIENT BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Soft Purple Glow - Top Left */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" />
        
        {/* Soft Blue Glow - Bottom Right */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        
        {/* Subtle Grid Pattern Overlay (Optional for tech feel) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto p-6 md:p-12 mt-20 space-y-16 pb-20 relative z-10">
        
        {/* Welcome Banner Section */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
          <WelcomeBanner />
        </section>

        {/* AI Tools Section */}
        <div className="space-y-8">
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground antialiased">
              AI Career <span className="gradient-text-primary italic">Chat Agents</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
              Interact with specialized agents designed to accelerate your career growth and shape your professional future.
            </p>
          </div>
          
          <div className="pt-4">
             {/* AI Tools grid with a subtle glass container if needed */}
             <AItools />
          </div>
        </div>

        {/* History Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/80 whitespace-nowrap">Recent Sessions</h2>
              <div className="h-[1px] w-full bg-linear-to-r from-border/60 to-transparent" />
          </div>
          
          {/* Glassmorphism container for history */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-2xl p-4 md:p-6 shadow-2xl shadow-black/5">
             <MyHistory />
          </div>
        </section>

      </div>
    </div>
  );
}

export default AiToolsOption;