"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import ResumeUploadDialog from "./ResumeUploadDialog";
import RoadmapGeneratorDialog from "./RoadmapGeneratorDialog";
import axios from "axios";

function AItoolsCard({ tool }) {
  const id = uuidv4();
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);
  const router = useRouter();

  const onClickButton = async () => {
    if (tool.name === "AI Resume Analyzer") {
      setOpenResumeDialog(true);
      return;
    }
    if (tool.path === "/ai-tools/ai-roadmap-agent") {
      setOpenRoadmapDialog(true);
      return;
    }
    try {
      await axios.post("/api/history", {
        recordId: id,
        content: [],
        aiAgentType: tool.path,
      });
    } catch (error) {
      console.log(error);
    }
    router.push(tool.path + "/" + id);
  };

  return (
    <div className="card-glass p-6 rounded-xl flex flex-col items-start justify-between min-h-[220px]">
      <div className="w-full">
        <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
          <Image 
            src={tool.icon} 
            width={32} 
            height={32} 
            alt={tool.name} 
            className="dark:invert-[0.8] transition-all" 
          />
        </div>
        <h2 className="font-bold text-lg text-foreground tracking-tight">{tool.name}</h2>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          {tool.desc}
        </p>
      </div>
      
      <Button 
        className="w-full mt-6 bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm" 
        onClick={onClickButton}
      >
        {tool.button}
      </Button>

      <ResumeUploadDialog
        openResumeDialog={openResumeDialog}
        setOpenResumeDialog={setOpenResumeDialog}
      />
      <RoadmapGeneratorDialog
        openRoadmapDialog={openRoadmapDialog}
        setOpenRoadmapDialog={setOpenRoadmapDialog}
      />
    </div>
  );
}

export default AItoolsCard;