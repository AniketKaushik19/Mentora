"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { TrendingUp, UserPlus, Loader2, Sparkles, Plus, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../../../../convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import PostCard from "@/app/community/_components/PostCard";

export default function FeedPage() {
  const { user: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("feed");

  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // DATA QUERIES PRESERVED
  const { data: feedData, isLoading: feedLoading } = useConvexQuery(api.feed.getFeed, { limit: 15 });
  const { data: suggestedUsers, isLoading: suggestionsLoading } = useConvexQuery(api.feed.getSuggestedUsers, { limit: 6 });
  const { data: trendingPosts, isLoading: trendingLoading } = useConvexQuery(api.feed.getTrendingPosts, { limit: 15 });
  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  const handleFollowToggle = async (userId) => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }
    try {
      await toggleFollow.mutate({ followingId: userId });
      toast.success("Follow status updated");
    } catch (error) {
      toast.error("You are trying to follow yourself!!");
    }
  };

  const getCurrentPosts = () => {
    switch (activeTab) {
      case "trending": return trendingPosts || [];
      default: return feedData?.posts || [];
    }
  };

  const isLoading = feedLoading || (activeTab === "trending" && trendingLoading);
  const currentPosts = getCurrentPosts();

  return (
    // Shifted from #030303 to a Slate-950/900 gradient for better depth
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 pt-32 pb-10 antialiased relative overflow-hidden">
      
      {/* BACKGROUND DECORATION: Subtle Grid and Light Refraction */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`, backgroundSize: '24px 24px' }}>
      </div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        
        {/* HEADER SECTION - High Contrast Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-10 mb-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
              Discover <span className="text-primary">Content</span>
            </h1>
            <p className="text-sm text-slate-400 font-medium max-w-md">
              Stay up to date with the latest posts from creators you follow
            </p>
          </div>

          {/* TAB SELECTOR - Lighter backdrop */}
          <div className="flex bg-slate-800/50 backdrop-blur-md border border-white/10 p-1 rounded-none">
            <button 
              onClick={() => setActiveTab("feed")} 
              className={`px-8 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "feed" ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              For You
            </button>
            <button 
              onClick={() => setActiveTab("trending")} 
              className={`px-8 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === "trending" ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              <TrendingUp size={12} /> Trending
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* MAIN FEED AREA */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* CREATE PROMPT - Lighter surface */}
            {currentUser && (
              <Link href="/community/dashboard/create" className="group flex items-center gap-4 p-5 bg-slate-800/40 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all shadow-xl">
                <div className="relative h-10 w-10 shrink-0 border border-white/20">
                  <Image src={currentUser.imageUrl} fill className="object-cover" alt="User" />
                </div>
                <div className="flex-1 text-slate-400 text-sm font-medium">
                  What's on your mind? <span className="text-slate-500 italic opacity-60">Share your thoughts...</span>
                </div>
                <div className="p-2 bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-black transition-colors">
                  <Plus size={18} />
                </div>
              </Link>
            )}

            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Syncing Intelligence...</p>
              </div>
            ) : currentPosts.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-white/10 bg-slate-800/20">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">
                  {activeTab === "trending" ? "No trending data available" : "No active streams found"}
                </h3>
                <p className="text-slate-500 text-xs mt-2">
                  {activeTab === "trending" ? "Check back later for trending content" : "Follow creators to populate your feed"}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentPosts.map((post) => (
                    <PostCard key={post._id} post={post} showActions={false} showAuthor={true} />
                  ))}
                </div>
                
                {activeTab === "feed" && feedData?.hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 sticky top-28 shadow-2xl">
              <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4 font-black uppercase text-[10px] tracking-[0.2em] text-white">
                <Sparkles size={14} className="text-primary animate-pulse" />
                Suggested Peers
              </div>
              {suggestionsLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="animate-spin size-5 text-slate-600" /></div>
              ) : (
                <div className="space-y-8">
                  {suggestedUsers?.map((user) => (
                    <div key={user._id} className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Link href={`/${user.username}`} className="flex items-center gap-3 overflow-hidden group">
                          <div className="h-9 w-9 border border-white/20 shrink-0 relative bg-slate-800">
                            <Image src={user.imageUrl} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={user.name} />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-[11px] font-bold text-white uppercase truncate group-hover:text-primary transition-colors">{user.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">@{user.username}</span>
                          </div>
                        </Link>
                        <Button 
                          onClick={() => handleFollowToggle(user._id)} 
                          className="rounded-none h-7 px-4 bg-white text-black hover:bg-primary transition-all text-[9px] font-black uppercase tracking-tighter"
                        >
                          Link
                        </Button>
                      </div>
                      
                      <div className="pl-12 space-y-1">
                         <div className="text-[9px] text-slate-400 font-bold tracking-tight">
                            {user.followerCount} Connects • {user.postCount} Units
                         </div>
                         {user.recentPosts?.[0] && (
                           <div className="text-[9px] text-slate-500 italic line-clamp-1 border-l border-primary/30 pl-2">
                             "{user.recentPosts[0].title}"
                           </div>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}