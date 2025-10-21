"use client"
import React, { useState } from 'react'
import { LayoutDashboard,PenTool,FileText,Users, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Post",
    href: "/dashboard/create",
    icon: PenTool,
  },
  {
    title: "My Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    title: "Followers",
    href: "/dashboard/followers",
    icon: Users,
  },
];

const DashboardLayout = ({children}) => {
    const [isSidebarOpen , setIsSidebarOpen]=useState(false)
    const pathname=usePathname()
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
                  <span className='bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text font-semibold text-2xl '>Mentora</span>
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
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group")}>
                               <item.icon/> 
                               <span className='font-medium'>{item.title}</span>
                            </div>
                        </Link>
                    )
                })}
            </nav>
        </aside>
        {children}
    </div>
  )
}

export default DashboardLayout