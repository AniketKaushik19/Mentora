"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const PostCard = ({
  post,
  showActions = false,
  showAuthor = true,
  onEdit,
  onDelete,
  onDuplicate,
  className = "",
}) => {
  const { user: currentUser } = useUser();
  const postId = post._id;

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return "bg-emerald-500";
      case "draft":
        return "bg-amber-500";
      default:
        return "bg-slate-500";
    }
  };

  const getPostUrl = () => {
    if (post.status === "published" && (post.author?.username || post?.username)) {
      return `/${post.author?.username || post?.username}/${post._id}`;
    }
    return null;
  };

  const publicUrl = getPostUrl();
  const { data: comments } = useConvexQuery(api.comments.getPostComments, { postId });
  const toggleLike = useConvexMutation(api.likes.toggleLike);
  const { data: hasLiked } = useConvexQuery(api.likes.hasUserLiked, currentUser ? { postId } : "skip");

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error("Sign in to engage");
    try {
      await toggleLike.mutate({ postId });
    } catch (error) {
      toast.error("Error updating like");
    }
  };

  return (
    <div className={`group relative flex flex-col bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all duration-500 ${className}`}>
      
      {/* 1. VISUAL ANCHOR */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.featuredImage || "/placeholder.png"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Floating Status Dot */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
          <div className={`h-1.5 w-1.5 rounded-full ${getStatusBadge(post.status)} animate-pulse`} />
          <span className="text-[9px] font-bold text-white uppercase tracking-tighter">{post.status}</span>
        </div>

        {/* View Link Overlay */}
        <Link 
          href={publicUrl || "#"} 
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="p-3 bg-white text-black rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <ArrowUpRight size={20} />
          </div>
        </Link>
      </div>

      {/* 2. DATA PANEL */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-md font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-slate-500 hover:text-white p-1 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10 text-slate-300 rounded-none">
                <DropdownMenuItem onClick={() => onEdit?.(post)} className="text-xs gap-2"><Edit size={14}/> Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(post)} className="text-xs gap-2"><Copy size={14}/> Clone</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => onDelete?.(post)} className="text-xs gap-2 text-red-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Author & Time Info */}
        {showAuthor && post.author && (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full overflow-hidden bg-slate-800 border border-white/10">
               <Image src={post.author.imageUrl} width={20} height={20} alt="user" />
            </div>
            <span className="text-[11px] font-medium text-slate-400">@{post.author.username}</span>
            <span className="text-[11px] text-slate-600">•</span>
            <span className="text-[11px] text-slate-600">
                {formatDistanceToNow(new Date(post.publishedAt || post.updatedAt), { addSuffix: false })}
            </span>
          </div>
        )}

        {/* 3. INTERACTION BAR (Minimalist) */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-5">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}
            >
              <Heart size={16} className={hasLiked ? "fill-current" : ""} />
              <span className="text-xs font-bold">{post.likeCount}</span>
            </button>

            <div className="flex items-center gap-1.5 text-slate-500">
              <MessageCircle size={16} />
              <span className="text-xs font-bold">{comments?.length || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <Eye size={14} />
            <span className="text-[10px] font-bold tracking-tighter">{post.viewCount || 0} VIEWS</span>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Line (Animated) */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default PostCard;