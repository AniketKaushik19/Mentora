"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import { SelectedChapterIndexProvider } from "@/app/context/SelectedChapterindexContext";

function WorkspaceProvider({ children }) {
  return (
    <SidebarProvider>
      <SelectedChapterIndexProvider>
        <AppSidebar />
        <SidebarTrigger />
        <div className="p-10">{children}</div>
      </SelectedChapterIndexProvider>
    </SidebarProvider>
  );
}

export default WorkspaceProvider;
