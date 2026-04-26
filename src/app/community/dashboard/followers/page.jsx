"use client";

import React from "react";
import { api } from "../../../../../convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { Loader2, UserMinus, Users, Search, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const FollowersPage = () => {
  const { user: currentUser } = useUser();
  
  const { data: currentConvexUser } = useConvexQuery(
    api.users.getCurrentUser,
    currentUser ? {} : "skip"
  );

  const { data: followingUsers, isLoading: followingLoading } = useConvexQuery(
    api.follows.getFollowingUsers,
    currentConvexUser?._id ? { followerId: currentConvexUser?._id } : "skip"
  );

  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  const handleFollowToggle = async (userId) => {
    if (!currentUser) {
      toast.error("Please sign in first");
      return;
    }

    try {
      await toggleFollow.mutate({ followingId: userId });
      toast.success("Connection updated");
    } catch (error) {
      toast.error("Failed to update connection");
    }
  };

  if (followingLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
          Loading Directory...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 lg:p-12 mt-10 antialiased">
      
      {/* 1. SIMPLE HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Users size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Community</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Following <span className="text-slate-500">List</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-md font-medium">
            Manage the people you follow and stay updated with their latest learning activities.
          </p>
        </div>

        {/* SEARCH FILTER */}
        <div className="relative w-full md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
            <Input 
                placeholder="Search following..." 
                className="rounded-none bg-white/[0.03] border-white/10 pl-10 h-11 text-sm text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:border-primary/50"
            />
        </div>
      </div>

      {/* 2. FOLLOWING CARDS */}
      {followingUsers?.length < 1 ? (
        <div className="py-24 text-center border border-white/5 bg-white/[0.01] flex flex-col items-center gap-4">
            <Users className="h-10 w-10 text-slate-800" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">No connections yet</h3>
              <p className="text-slate-600 text-xs font-medium">
                Start following other members to see them here.
              </p>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {followingUsers?.map((user, index) => (
            <div
              key={index}
              className="group relative bg-[#0a0a0a] border border-white/5 p-5 flex items-center justify-between transition-all hover:bg-[#0d0d0d] hover:border-white/10"
            >
              <div className="flex items-center gap-4">
                {/* Profile Image with Sharp Frame */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-white/10 bg-slate-800">
                  <Image
                    src={user?.imageUrl || "/placeholder.png"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="profile"
                  />
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {user.name}
                  </h3>
                  <span className="text-xs text-slate-500">@{user.username}</span>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active Member</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col items-end gap-3">
                <Button
                  onClick={() => handleFollowToggle(user._id)}
                  disabled={toggleFollow.isLoading}
                  className="rounded-none h-10 px-5 bg-white text-black hover:bg-slate-200 text-[10px] font-black uppercase tracking-widest transition-all gap-2"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  Unfollow
                </Button>
                <div className="flex items-center gap-1 text-slate-600">
                    <UserCheck size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Connected</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowersPage;