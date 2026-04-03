"use client";
import { useParams, useRouter } from "next/navigation"; // Added useRouter
import React, { useEffect, useState } from "react";
import { MoveLeft } from "lucide-react"; // Added Icon
import { Button } from "@/components/ui/button"; // Added Button component
import axios from 'axios';
import Report from "../_components/Report";

function AiResumeAnalyzer() {
  const { resumeId } = useParams();
  const router = useRouter(); // Initialize router
  const [pdfUrl, setPdfUrl] = useState();
  const [aiReport, setAiReport] = useState();

  useEffect(() => {
    resumeId && GetResumeAnalyzerRecord();
  }, [resumeId]);

  const GetResumeAnalyzerRecord = async () => {
    try {
      const result = await axios.get(`/api/history?recordId=${resumeId}`);
      setPdfUrl(result?.data?.metaData);
      setAiReport(result?.data?.content);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-background overflow-hidden">
      
      {/* LEFT: Analysis Report (Independent Scroll) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:border-r border-border/50">
        <div className="max-w-3xl mx-auto">
          
          {/* --- NEW: Back Button Section --- */}
          <div className="mb-6 flex items-center justify-between">
            <Button 
              onClick={() => router.back()} 
              variant="ghost" 
              size="sm" 
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all p-0"
            >
              <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <MoveLeft className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
            </Button>
          </div>
          {/* ------------------------------- */}

          <Report aiReport={aiReport} />
        </div>
      </div>

      {/* RIGHT: Resume Preview (Fixed & Integrated) */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[45%] bg-muted/20 flex-col p-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-50">Document Viewer</h2>
          <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Resume
          </span>
        </div>

        <div className="flex-1 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden relative">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full"
              style={{ border: "none" }}
              title="Resume Preview"
            ></iframe>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-semibold opacity-40 uppercase tracking-tighter">Preparing Preview</p>
            </div>
          )}
        </div>
        
        <p className="text-[9px] text-center mt-4 opacity-30 font-bold tracking-widest uppercase">
          AI Analysis Engine Interface • 2026
        </p>
      </div>
    </div>
  );
}

export default AiResumeAnalyzer;