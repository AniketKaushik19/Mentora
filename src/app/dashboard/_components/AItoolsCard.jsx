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
      //create new record to history table
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
    //card-glass
    <div className="p-3 border rounded-lg">
      <Image src={tool.icon} width={40} alt="image" height={40} />
      <h2 className="font-bold mt-2">{tool.name}</h2>
      <p className="text-gray-400">{tool.desc}</p>
      <Button className="w-full mt-3" onClick={onClickButton}>
        {tool.button}
      </Button>
      <ResumeUploadDialog
        openResumeDialog={openResumeDialog}
        setOpenResumeDialog={setOpenResumeDialog}
      />
      <RoadmapGeneratorDialog
        openRoadmapDialog={openRoadmapDialog}
        setOpenRoadmapDialog={setOpenRoadmapDialog}
      ></RoadmapGeneratorDialog>
    </div>
  );
}

export default AItoolsCard;
