import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

function WelcomeBanner() {
  return (
    // Reduced padding from p-8 to p-6/p-8 and margin-bottom
    <div className="relative overflow-hidden rounded-xl border border-white/10 card-glass p-6 md:p-8 mb-6">
      
      {/* Subtle Mesh Glows (Smaller for compact look) */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        
        <div className="flex-1 text-center sm:text-left">
          {/* Compact Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              AI Powered
            </span>
          </div>
          
          {/* Tightened Header */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-none">
            AI Career Coach Agent
          </h1>
          
          {/* Slightly smaller text for comfort */}
          <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
            Smarter career decisions start here. Get tailored advice and market-ready 
            roadmaps built specifically for your goals.
          </p>
        </div>

        {/* Responsive Button - Full width on tiny screens, auto on larger */}
        <Button 
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/20 px-6 py-5 rounded-lg font-bold text-sm shrink-0"
        >
          Let's Get Started
        </Button>
      </div>
    </div>
  );
}

export default WelcomeBanner;