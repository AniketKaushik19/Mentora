"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RoadmapCanvas from "../_components/RoadmapCanvas";
import RoadmapGeneratorDialog from "@/app/dashboard/_components/RoadmapGeneratorDialog";
import { MoveLeft, Sparkles, Clock, FileText, Plus } from "lucide-react";

function RoadmapGeneratorAgent() {
  const router = useRouter();
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);
  const { roadmapid } = useParams();
  const [roadMapDetail, setRoadMapDetail] = useState();

  useEffect(() => {
    roadmapid && GetRoadmapDetails();
  }, [roadmapid]);

  const GetRoadmapDetails = async () => {
    try {
      const result = await axios.get("/api/history?recordId=" + roadmapid);
      setRoadMapDetail(result.data);
    } catch (error) {
      console.log("error in get :" + error);
    }
  };

  return (
    // Fixed height container for professional app feel
    <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden">
      
      {/* LEFT SIDEBAR: Roadmap Info */}
      <div className="w-full lg:w-[350px] xl:w-[400px] border-r border-border bg-card/50 backdrop-blur-xl p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Navigation */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/ai-tools')} 
            className="group -ml-2 text-muted-foreground hover:text-primary transition-all"
          >
            <MoveLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Tools
          </Button>

          {/* Details Section */}
          <div className="space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
               <Sparkles className="w-3 h-3 text-primary" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Generated Path</span>
            </div>
            
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              {roadMapDetail?.content?.roadmapTitle || "Loading Roadmap..."}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3 text-muted-foreground leading-relaxed">
                <FileText className="w-4 h-4 shrink-0 mt-1 opacity-50" />
                <p><strong>Overview:</strong> {roadMapDetail?.content?.description}</p>
              </div>

              <div className="flex items-center gap-3 text-primary font-bold">
                <Clock className="w-4 h-4" />
                <span>Estimate: {roadMapDetail?.content?.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-border/50">
          <Button
            className="w-full py-6 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2"
            onClick={() => setOpenRoadmapDialog(true)}
          >
            <Plus className="w-4 h-4" /> New Roadmap
          </Button>
          <p className="text-[9px] text-center mt-4 opacity-30 font-medium tracking-[0.2em] uppercase">
            Interactive Learning Engine v1.0
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Canvas */}
      <div className="flex-1 relative bg-slate-50 dark:bg-slate-950/20">
        {/* Subtle Canvas Header Overlay */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-sm">
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider italic">
              Drag and Zoom to explore nodes
           </span>
        </div>

        <div className="w-full h-full">
          <RoadmapCanvas
            initialNodes={roadMapDetail?.content?.initialNodes}
            initialEdges={roadMapDetail?.content?.initialEdges}
          />
        </div>
      </div>

      <RoadmapGeneratorDialog
        openRoadmapDialog={openRoadmapDialog}
        setOpenRoadmapDialog={setOpenRoadmapDialog}
      />
    </div>
  );
}

export default RoadmapGeneratorAgent;