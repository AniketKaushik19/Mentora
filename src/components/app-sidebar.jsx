import {  File, History, Layers, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Workspace",
    url: "#",
    icon: Layers,
  },
  {
    title: "AI Tools",
    url: "/ai-tools/ai-chat",
    icon: File,
  },
  {
    title: "History",
    url: "#",
    icon: History,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
]

export function AppSidebar() {
  return (
    // <aside className="w-64 h-screen bg-gray-800 text-white fixed top-0 left-0 z-40">
    
    <Sidebar >
      <SidebarContent className="bg-black text-white">
        <SidebarGroup>
          
          <SidebarGroupLabel>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent my-10">
  Mentora
</h2>
            </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="my-10 space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}><item.icon /><span>{item.title}</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    // </aside>
  )
}