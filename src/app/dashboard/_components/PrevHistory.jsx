"use client";

import axios from "axios";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { aiToolsList } from "./AItools";
import { MoveLeftIcon, History, ArrowRight, Clock, Trash2 } from "lucide-react";

function PrevHistory() {
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    GetHistory();
  }, []);

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

  const GetAgentName = (path) => {
    return aiToolsList.find((item) => item.path === path);
  };

  const filteredHistory =
    pathname !== "/my-history" ? userHistory.slice(0, 5) : userHistory;

  return (
    <div className={`w-full transition-all duration-500 ${pathname === "/my-history" ? 'max-w-5xl mx-auto p-6 md:p-12' : 'p-2'}`}>
      
      {/* Conditionally show back button for Full History Page */}
      {pathname === "/my-history" && (
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')} 
          className="mb-8 group text-muted-foreground hover:text-primary transition-all p-0"
        >
          <MoveLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </Button>
      )}

      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Previous History
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Pick up right where you left off.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-20 w-full rounded-2xl bg-muted/50" />
          ))}
        </div>
      ) : filteredHistory.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl bg-muted/5">
          <div className="p-4 bg-muted rounded-full mb-4">
            <History className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-lg">No history found</h2>
          <p className="text-muted-foreground text-sm mb-6">You haven't used any AI tools yet.</p>
          <Button onClick={() => router.push('/ai-tools')} className="rounded-xl font-bold shadow-lg shadow-primary/20">
            Explore AI Tools
          </Button>
        </div>
      ) : (
        /* History List */
        <div className="space-y-3">
          {filteredHistory.map((history, index) => {
            const agent = GetAgentName(history.aiAgentType);
            return (
              <Link
                key={index}
                href={`${history.aiAgentType}/${history.recordId}`}
                className="group block"
              >
                <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Image
                        src={agent?.icon || "/cover.png"}
                        alt="icon"
                        width={24}
                        height={24}
                        className="opacity-90 grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-1">
                        {history?.content?.roadmapTitle ||
                         (typeof history?.content[0]?.content === 'string' ? history?.content[0]?.content : null) ||
                         (history?.content?.overall_score ? `Resume Score: ${history.content.overall_score}%` : 'Untitled Session')}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                          {agent?.name || "AI Agent"}
                        </span>
                        <span className="text-muted-foreground opacity-30">•</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                          <Clock className="w-3 h-3" />
                          {new Date(history.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Show All Button - Compact Version */}
      {pathname !== "/my-history" && filteredHistory.length > 0 && (
        <Button 
          variant="outline" 
          className="w-full mt-6 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold text-xs uppercase tracking-widest py-6"
          onClick={() => router.push('/my-history')}
        >
          View Full Activity Log <ArrowRight className="ml-2 w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

export default PrevHistory;