'use client'

import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { BarLoader } from 'react-spinners'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, Search, Filter, FileText, LayoutGrid, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import PostCard from '../../_components/PostCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner'

const Post = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const router = useRouter()

  const { data: posts, isLoading } = useConvexQuery(api.posts.getUserPosts)
  const deletePost = useConvexMutation(api.posts.deletePost)

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let filtered = posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || post.status === statusFilter
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": return b.createdAt - a.createdAt;
        case "oldest": return a.createdAt - b.createdAt;
        case "mostViews": return b.viewCount - a.viewCount;
        case "mostLikes": return b.likeCount - a.likeCount;
        case "alphabetical": return a.title.localeCompare(b.title);
        default: return b.createdAt - a.createdAt;
      }
    })
    return filtered;
  }, [posts, searchQuery, statusFilter, sortBy])

  if (isLoading) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center gap-6">
        <BarLoader width={"160px"} color='#ffffff' />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Loading your content...</span>
      </div>
    )
  }

  const handleEditPost = (post) => {
    router.push(`/community/dashboard/posts/edit/${post._id}`)
  }

  const handleDeletePost = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost.mutate({ id: post._id })
      toast.success("Post deleted successfully")
    } catch (error) {
      toast.error("Error: Failed to delete post")
    }
  }

  const handleDuplicatePost = (post) => {
    toast.info("Coming soon: Post duplication");
  };

  return (
    <div className='max-w-7xl mx-auto space-y-10 p-6 lg:p-12 mt-10 antialiased'>
      
      {/* 1. CLEAN HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-2">
            <h1 className='text-4xl font-black tracking-tighter text-white'>
              My <span className="text-slate-500">Posts</span>
            </h1>
            <p className="text-sm text-slate-500 max-w-md font-medium">
              Manage your content, track engagement metrics, and organize your drafts.
            </p>
        </div>

        <Link href={"/community/dashboard/create"}>
          <Button className='rounded-none h-12 px-8 bg-white text-black hover:bg-slate-200 text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-white/5 gap-2'>
            <PlusCircle className='h-4 w-4' />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* 2. MODERN FILTER BAR (NORMAL STYLE) */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
          <Input
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-none bg-white/[0.03] border-white/10 focus:border-white/20 pl-12 h-12 text-sm text-white placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] rounded-none bg-white/[0.03] border-white/10 h-12 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                <div className="flex items-center gap-2">
                <Filter className="h-3 w-3" />
                <SelectValue placeholder="Status" />
                </div>
            </SelectTrigger>
            <SelectContent className="bg-[#0b0b0b] border-white/10 rounded-none">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] rounded-none bg-white/[0.03] border-white/10 h-12 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-[#0b0b0b] border-white/10 rounded-none">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="mostViews">Most Views</SelectItem>
                <SelectItem value="mostLikes">Most Likes</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>

      {/* 3. POST GRID */}
      {filteredPosts.length === 0 ? (
        <div className="py-32 text-center border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-4">
            <FileText className="h-10 w-10 text-slate-800" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">No posts found</h3>
              <p className="text-slate-600 text-xs font-medium">
                Try adjusting your filters or create a new entry.
              </p>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {filteredPosts.map((post, index) => (
            <div 
              key={post._id} 
              className="animate-in fade-in slide-in-from-bottom-2 duration-500" 
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <PostCard
                post={post}
                showActions={true}
                showAuthor={false}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onDuplicate={handleDuplicatePost}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Post;