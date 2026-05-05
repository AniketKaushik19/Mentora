"use client";

import React from "react";
import { SelectedChapterIndexProvider } from "@/app/context/SelectedChapterindexContext";

function WorkspaceProvider({ children }) {
  return (
      <SelectedChapterIndexProvider>  
        <div className="p-10">{children}</div>
      </SelectedChapterIndexProvider>
  );
}

export default WorkspaceProvider;
