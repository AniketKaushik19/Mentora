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

// Menu items.
const items = [
  {
    title: "Workspace",
    url: "#",
    icon: Layers,
  },
  {
    title: "AI Tools",
    url: "#",
    icon: File,
  },
  {
    title: "History",
    url: "#",
    icon: History,
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
  },
]

export function AppSidebar() {
  return (
    <Sidebar >
      <SidebarContent className="bg-gray-400">
        <SidebarGroup>
          
          <SidebarGroupLabel>
            <h2 class="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent">
  Mentora
</h2>
            </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="my-10 space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}