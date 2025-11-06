"use client"
import React, { useState } from 'react'
import { LayoutDashboard,PenTool,FileText,Users, X, Settings, Menu, ToolCase } from 'lucide-react';
import { usePathname } from 'next/navigation';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserButton } from '@clerk/nextjs';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { api } from '../../../../convex/_generated/api';
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/community/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Post",
    href: "/community/dashboard/create",
    icon: PenTool,
  },
  {
    title: "My Posts",
    href: "/community/dashboard/posts",
    icon: FileText,
  },
  {
    title: "Followers",
    href: "/community/dashboard/followers",
    icon: Users,
  },
  {
    title: "Feed",
    href: "/feed",
    icon: Users,
  },
  {
    title: "AI Career",
    href: "/",
    icon: ToolCase,
  },
];

const DashboardLayout = ({children}) => {
    const [isSidebarOpen , setIsSidebarOpen]=useState(false)
    const pathname=usePathname()
    const {data:draftPost} =useConvexQuery(api.posts.getUserDraft)
  return (
    <div className='min-h-screen bg-slate-900 text-white'>
        {/* //mobile sidebar */}
        <aside className={cn("fixed top-0 left-0 h-full w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 z-50 transition-transform duration-300 lg:translate-x-0",isSidebarOpen?"translate-x-0":"-translate-x-full")}>
            <div className='flex items-center justify-between p-5 border-b border-slate-700'>
                <Link href={"/community"} className='flex-shrink-0'>
                  {/* <Image 
                     className='h-8 sm:h-10 md:h-11 w-auto object-contain'
                     src={"/logo.png"}
                     alt="creator logo"
                     width={96}
                     height={32}
                  /> */}
                  <span className='bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text font-semibold text-2xl h-8 sm:h-10 md:h-11 w-auto object-contain '>Mentora</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={()=>setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden">
                    <X className='h-5 w-5'/>
                </Button>
            </div>

            {/* //Navigation  */}
            <nav className='p-4 space-y-2'>
                {sidebarItems.map((item,index)=>{
                    const isActive=pathname===item.href || (item.href!=="/community/dashboard" && pathname.startsWith(item.href))

                    return (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={()=>setIsSidebarOpen(false)}
                        >
                            <div className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group" , isActive?"bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500 text-white":"text-slate-300 hover:text-white hover:bg-slate-700/50")}>
                               <item.icon 
                                  className={cn('h-5 w-5 transition-colors', isActive? "text-purple-400":"text-slate-400 group-hover:text-white")}
                               /> 
                               <span className='font-medium'>{item.title}</span>

                               {item.title==="Create Post" && draftPost && (
                                <Badge
                                  variant="secondary"
                                  className='ml-auto text-xs bg-orange-500/20 text-orange-300 border-orange-500/50'
                                > Draft
                                </Badge>
                               )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div className='absolute bottom-4 left-4 right-4'>
                <Link href="/community/dashboard/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-slate-300 hover:text-white rounded-xl p-4 cursor-pointer"
                  >
                      <Settings className='h-4 w-4 mr-2'/>
                      Settings
                  </Button>
                </Link>
            </div>
        </aside>

        <div className='ml-0 lg:ml-64'>
          <header className='fixed w-full top-0 right-0 z-30 bg-slate-800/80 backdrop-blur-md border-b border-slate-700'>
            <div className='flex items-center justify-between px-4 lg:px-8 py-4'>
              <div className='flex items-center space-x-4'>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={()=>setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden"
                >
                    <Menu className='h-5 w-5'/>
                </Button>
              </div>

              <div className='h-10 flex items-center space-x-4'>
                 <UserButton/>
              </div>
            </div>
          </header>

          <main className='mt-[72px]'>
          {children}
          </main>
          </div>
        
    </div>
  )
}

export default DashboardLayout