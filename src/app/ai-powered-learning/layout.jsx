"use client";

import React from "react";
import WorkspaceProvider from "./provider";

export default function WorkspaceLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </div>
  );
}
