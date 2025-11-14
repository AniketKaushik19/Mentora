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
import { Book, Compass, Globe, LayoutDashboard, PencilRulerIcon, ToolCase, UserCircle2Icon, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";

const SideBarOptions=[
  {
    title:'Dashboard',
    icon:LayoutDashboard,
    path:'/ai-powered-learning'
  },
  {
    title:'My Learning ',
    icon:Book,
    path:'/ai-powered-learning/my-courses'
  },
  {
    title:'Explore Courses',
    icon:Compass,
    path:'/ai-powered-learning/explore'
  },
  {
    title:'Profile',
    icon:UserCircle2Icon,
    path:'/profile'
  },
  {
    title:'Community',
    icon:Globe,
    path:'/community'
  },
  {
    title:'AI Tools',
    icon:ToolCase,
    path:'/ai-tools'
  },
]
function AppSidebar() {
  const path =usePathname();
  return (
    <Sidebar className="w-64 bg-gray-900 text-white flex flex-col">
     
    <SidebarHeader className="text-4xl m-5 font-bold bg-gradient-to-r from-purple-800  to-blue-700 bg-clip-text text-transparent">
      <Link to={'/'}>  Mentora </Link> 
      </SidebarHeader>

      <SidebarContent className="flex-1 px-4 ">
        <SidebarGroup>
          <AddNewCourseDialog>
          <Button className="w-full cursor-pointer text-white bg-gradient-to-r from-purple-800  to-blue-700 hover:bg-purple-700">
            Create New Course
          </Button>
          </AddNewCourseDialog>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarOptions.map((item,index)=>(
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className={'p-5'}>
                     <Link href={item.path} className={`text-[16px]
                      ${path.includes(item.path)&&'text-purple-300'}
                      `}>
                     <item.icon className="h-7 w-7" />
                     <span>{item.title}</span>
                     </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-2 text-xs text-gray-500">
        © 2025 Mentora
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
