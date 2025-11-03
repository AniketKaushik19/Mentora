"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RoadmapCanvas from "../_components/RoadmapCanvas";
import RoadmapGeneratorDialog from "@/app/dashboard/_components/RoadmapGeneratorDialog";

function RoadmapGeneratorAgent() {
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);
  const { roadmapid } = useParams();
  const [roadMapDetail, setRoadMapDetail] = useState();
  useEffect(() => {
    roadmapid && GetRoadmapDetails();
  }, [roadmapid]);

  const GetRoadmapDetails = async () => {
    try {
      const result = await axios.get("/api/history?recordId=" + roadmapid);
      console.log(result.data);
      setRoadMapDetail(result.data);
    } catch (error) {
      console.log("error in get :" + error);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
      <div className="border rounded-xl p-5">
        <h2 className="font-bold text-2xl">
          {roadMapDetail?.content?.roadmapTitle}
        </h2>
        <p className="mt-3 text-gray-500">
          <strong>Description: </strong> {roadMapDetail?.content?.description}
        </p>
        <h2 className="mt-5 font-medium text-blue-600">
          Duration : {roadMapDetail?.content?.duration}
        </h2>
        <Button
          className="mt-5 w-full"
          onClick={() => setOpenRoadmapDialog(true)}
        >
          Create Another Roadmap +
        </Button>
      </div>
      <div className="md:col-span-2 w-full h-[80vh]">
        <RoadmapCanvas
          initialNodes={roadMapDetail?.content?.initialNodes}
          initialEdges={roadMapDetail?.content?.initialEdges}
        />
      </div>
      <RoadmapGeneratorDialog
        openRoadmapDialog={openRoadmapDialog}
        setOpenRoadmapDialog={setOpenRoadmapDialog}
      ></RoadmapGeneratorDialog>
    </div>
  );
}

export default RoadmapGeneratorAgent;
