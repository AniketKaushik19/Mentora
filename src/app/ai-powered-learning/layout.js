import React from "react";
import WorkspaceProvider from "./provider";
import { AppSidebar } from "@/components/app-sidebar";

export default function WorkspaceLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
        <AppSidebar />
            <WorkspaceProvider>{children}</WorkspaceProvider>
    </div>
  );
}
