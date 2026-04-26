"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Book, Compass, Globe, LayoutDashboard, ToolCase, UserCircle2Icon, Plus, Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";

const SideBarOptions = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/ai-powered-learning' },
  { title: 'My Learning', icon: Book, path: '/ai-powered-learning/my-courses' },
  { title: 'Explore Courses', icon: Compass, path: '/ai-powered-learning/explore' },
  { title: 'Profile', icon: UserCircle2Icon, path: '/profile' },
  { title: 'Community', icon: Globe, path: '/community' },
  { title: 'AI Tools', icon: ToolCase, path: '/ai-tools' },
];

function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar className="w-64 border-r border-white/5 bg-[#050505]/95 backdrop-blur-3xl text-slate-300 flex flex-col">
      
      {/* 1. BRANDING SECTION */}
      <SidebarHeader className="py-10 px-6">
        <Link href={'/'} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:bg-primary transition-all duration-300">
             <Terminal className="text-black group-hover:text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent">
            Mentora
          </span>
        </Link>
      </SidebarHeader>

      {/* 2. ACTION SECTION */}
      <SidebarContent className="flex-1 px-4 space-y-8">
        <SidebarGroup>
          <AddNewCourseDialog>
            {/* Button updated to a high-end Industrial Look */}
            <Button className="w-full py-7 rounded-xl cursor-pointer bg-white text-black hover:bg-slate-200 transition-all gap-3 font-black text-xs uppercase tracking-[0.1em] shadow-xl shadow-white/5">
              <Plus className="h-4 w-4 stroke-[3px]" /> Create Course
            </Button>
          </AddNewCourseDialog>
        </SidebarGroup>

        {/* 3. NAVIGATION MENU */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {SideBarOptions.map((item, index) => {
                const isActive = path.includes(item.path);
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild className="p-0 h-auto">
                      <Link 
                        href={item.path} 
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                        ${isActive 
                          ? 'bg-white/[0.04] border border-white/10 text-white' 
                          : 'hover:bg-white/[0.02] text-slate-500 hover:text-slate-200'}`}
                      >
                        <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'group-hover:text-slate-200'}`} />
                        <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 4. FOOTER */}
      <SidebarFooter className="p-6 border-t border-white/5 bg-black/40">
        <div className="flex flex-col gap-1.5">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Node Active</span>
           </div>
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">© 2026 Core Protocol</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;