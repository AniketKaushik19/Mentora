"use client";
import React, { useState } from "react";
import ResumeUploadDialog from "@/app/dashboard/_components/ResumeUploadDialog";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ArrowUpRight,
  Star,
  Layout
} from "lucide-react";

function Report({ aiReport }) {
  const [openResumeDialog, setOpenResumeDialog] = useState(false);

  // Logic: Professional color mapping for dark/light accessibility
  const getTheme = (score) => {
    if (score < 60) return { 
      text: "text-rose-400", 
      bg: "bg-rose-500/10", 
      border: "border-rose-500/20", 
      bar: "bg-rose-500" 
    };
    if (score <= 80) return { 
      text: "text-amber-400", 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/20", 
      bar: "bg-amber-500" 
    };
    return { 
      text: "text-emerald-400", 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/20", 
      bar: "bg-emerald-500" 
    };
  };

  const sections = [
    { key: "contact_info", label: "Contact Info" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
  ];

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Analysis Report</h2>
          <p className="text-muted-foreground text-sm">Real-time ATS & content verification</p>
        </div>
        <Button
          onClick={() => setOpenResumeDialog(true)}
          variant="outline"
          className="rounded-full shadow-sm border-primary/20 hover:bg-primary/5 transition-all"
        >
          <Sparkles className="w-4 h-4 mr-2 text-primary" /> Re-analyze Resume
        </Button>
      </div>

      {/* Main Score Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-card p-8 shadow-2xl shadow-primary/5">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <TrendingUp size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-[10px] border-muted flex items-center justify-center">
              <span className="text-5xl font-black tracking-tighter text-foreground">
                {aiReport?.overall_score ?? 0}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-[10px] font-bold text-white px-2 py-1 rounded-lg">
              +{aiReport?.overall_growth}%
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="text-xl font-bold uppercase tracking-widest text-foreground/80">Overall ATS Score</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-2xl text-sm md:text-base">
              {aiReport?.summary_comment}
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                style={{ width: `${aiReport?.overall_score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Breakdown Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((item) => {
          const sectionData = aiReport?.sections?.[item.key];
          const score = sectionData?.score ?? 0;
          const theme = getTheme(score);

          return (
            <div key={item.key} className={`p-6 rounded-2xl border ${theme.border} ${theme.bg} transition-all hover:scale-[1.02]`}>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mb-2">{item.label}</p>
              <span className={`text-3xl font-black ${theme.text}`}>{score}%</span>
              <p className="text-[11px] text-muted-foreground mt-3 line-clamp-2 leading-relaxed italic">
                "{sectionData?.comment}"
              </p>
            </div>
          );
        })}
      </div>

      {/* Key Tips & Improvements */}
      <div className="bg-muted/30 border border-border/50 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="font-bold text-lg tracking-tight">Priority Improvements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiReport?.tips_for_improvement?.map((tip, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/40 transition-colors hover:bg-muted/50">
              <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Critical Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Strength Card */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8">
          <h3 className="text-emerald-500 font-bold text-lg mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" /> Key Strengths
          </h3>
          <ul className="space-y-5">
            {aiReport?.whats_good?.map((item, index) => (
              <li key={index} className="text-foreground/80 text-sm leading-relaxed flex gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements Card */}
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8">
          <h3 className="text-rose-500 font-bold text-lg mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" /> Critical Improvements
          </h3>
          <ul className="space-y-5">
            {aiReport?.needs_improvement?.map((item, index) => (
              <li key={index} className="text-foreground/80 text-sm leading-relaxed flex gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

         <ResumeUploadDialog
        openResumeDialog={openResumeDialog}
        setOpenResumeDialog={() => setOpenResumeDialog(false)}
      />
    </div>
  );
}

export default Report;