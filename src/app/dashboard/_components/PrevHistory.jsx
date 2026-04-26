"use client";

import axios from "axios";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { aiToolsList } from "./AItools";
import { MoveLeftIcon, History, ArrowRight, Calendar, LayoutGrid, FileText, CheckCircle2, Zap } from "lucide-react";

function PrevHistory() {
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => { GetHistory(); }, []);

  const GetHistory = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/history");
      setUserHistory(result.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const GetAgentName = (path) => aiToolsList.find((item) => item.path === path);

  const filteredHistory = pathname !== "/my-history" ? userHistory.slice(0, 5) : userHistory;

  // HELPER: Extract structured info from different AI agent responses provided in your JSON
  const getHistoryDisplayData = (history) => {
    const content = history?.content;
    const type = history?.aiAgentType;

    // 1. Roadmap Agent
    if (type?.includes('roadmap-agent')) {
      return {
        title: content?.roadmapTitle || "Neural Learning Path",
        subtitle: content?.duration ? `Plan: ${content.duration}` : "Structured Roadmap",
        badge: <Zap className="w-3 h-3" />,
        badgeText: "Roadmap"
      };
    }
    // 2. Resume Analyzer
    if (type?.includes('resume-analyzer')) {
      const score = content?.overall_score;
      return {
        title: `Resume Score: ${score}${score <= 10 ? '/10' : '%'}`,
        subtitle: content?.summary_comment?.substring(0, 50) + "..." || "ATS Analysis",
        badge: <CheckCircle2 className="w-3 h-3" />,
        badgeText: "Analysis"
      };
    }
    // 3. Cover Letter
    if (type?.includes('coverletter-generator')) {
      return {
        title: "Professional Cover Letter",
        // Extract the subject or first line
        subtitle: typeof content === 'string' ? content.split('\n')[4]?.replace('Subject: ', '') : "Draft Generated",
        badge: <FileText className="w-3 h-3" />,
        badgeText: "Draft"
      };
    }
    // Default / Chat
    return {
      title: content?.[0]?.content?.substring(0, 50) || "Career Q&A Session",
      subtitle: "Conversational Intelligence",
      badge: <History className="w-3 h-3" />,
      badgeText: "Chat"
    };
  };

  return (
    <div className={`w-full transition-all duration-500 ${pathname === "/my-history" ? 'max-w-6xl mx-auto p-6 md:p-12' : 'p-0'}`}>
      
      {/* HEADER SECTION */}
      {pathname === "/my-history" ? (
        <div className="mb-10 space-y-4">
          <Button variant="ghost" onClick={() => router.push('/')} className="group text-slate-500 hover:text-primary p-0 mb-4 transition-all">
            <MoveLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1" /> Back to Workspace
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Activity Log</h1>
              <p className="text-slate-500 mt-2 font-medium">Review and resume your AI-powered career interactions.</p>
            </div>
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{userHistory.length} Total Records</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <History className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200">Recent Sessions</h2>
        </div>
      )}

      {/* LIST SECTION */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-3xl bg-slate-100 dark:bg-white/5" />)}
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] bg-slate-50/50 dark:bg-white/5">
          <History className="w-8 h-8 text-slate-300 mb-4" />
          <h2 className="font-bold text-xl">No sessions yet</h2>
          <Button onClick={() => router.push('/ai-tools')} className="mt-4 rounded-2xl px-8 font-black">Explore Tools</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((history, index) => {
            const agent = GetAgentName(history.aiAgentType);
            const display = getHistoryDisplayData(history);
            
            return (
              <Link key={index} href={`${history.aiAgentType}/${history.recordId}`} className="group block">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                  
                  <div className="flex items-center gap-5">
                    <div className="relative shrink-0">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 group-hover:scale-110 transition-transform duration-500">
                        <Image src={agent?.icon || "/cover.png"} alt="icon" width={28} height={28} className="opacity-80 group-hover:opacity-100" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                         <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase text-slate-500">
                           {display.badge} {display.badgeText}
                         </div>
                         <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                           {display.title}
                         </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">{display.subtitle}</p>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                          <Calendar className="w-3 h-3" />
                          {new Date(history.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center justify-end">
                    <div className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* FOOTER ACTION */}
      {pathname !== "/my-history" && filteredHistory.length > 0 && (
        <Button 
          variant="ghost" 
          className="w-full mt-6 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest py-7 group"
          onClick={() => router.push('/my-history')}
        >
          View Full Activity Log <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      )}
    </div>
  );
}

export default PrevHistory;