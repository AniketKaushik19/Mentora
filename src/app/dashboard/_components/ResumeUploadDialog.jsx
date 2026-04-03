"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Loader2, Sparkles, UploadCloud, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";

function ResumeUploadDialog({ openResumeDialog, setOpenResumeDialog }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFileChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile?.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const onUploadAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const recordId = uuidv4();
    const formData = new FormData();
    formData.append("recordId", recordId);
    formData.append("resumeFile", file);

    try {
      await axios.post("/api/ai-resume-agent", formData);
      setOpenResumeDialog(false);
      router.push("/ai-tools/ai-resume-analyzer/" + recordId);
    } catch (error) {
      alert(error.response?.data?.error || "Error uploading resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openResumeDialog} onOpenChange={setOpenResumeDialog}>
      <DialogContent className="sm:max-w-[440px] rounded-3xl border-white/10 bg-card/90 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl">
        
        {/* Top Loading Bar */}
        {loading && (
          <div className="absolute top-0 left-0 h-[2px] bg-primary animate-pulse w-full z-50" />
        )}

        <div className="p-8 space-y-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                <UploadCloud size={20} />
              </div>
              <DialogTitle className="text-xl font-black tracking-tight">
                Resume <span className="gradient-text-primary">Scan</span>
              </DialogTitle>
            </div>
            <DialogDescription className="text-[11px] leading-relaxed text-muted-foreground/70">
              Submit your document for a deep-learning ATS compatibility audit. 
              We'll analyze structure, keywords, and role-relevance.
            </DialogDescription>
          </DialogHeader>

          <div className="relative group">
            <label
              htmlFor="resumeUpload"
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-500 cursor-pointer
                ${file 
                  ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[inner_0_0_30px_rgba(16,185,129,0.05)]' 
                  : 'border-white/5 bg-white/[0.01] hover:border-primary/40 hover:bg-white/[0.03]'}`}
            >
              {file ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in-95">
                  <div className="relative">
                    <FileText className="h-10 w-10 text-emerald-500/80" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-card">
                       <CheckCircle2 className="h-2 w-2 text-white" />
                    </div>
                  </div>
                  <h2 className="mt-4 text-[10px] font-bold text-foreground truncate max-w-[180px] uppercase tracking-wider">
                    {file.name}
                  </h2>
                  <button 
                    onClick={(e) => { e.preventDefault(); setFile(null); }}
                    className="mt-4 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="p-3 rounded-full bg-white/5 mb-4 group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-500">
                    <FileText className="h-6 w-6 text-slate-500 group-hover:text-primary/70" />
                  </div>
                  <h2 className="text-[10px] font-black text-foreground opacity-60 uppercase tracking-[0.2em]">Upload PDF Resume</h2>
                </div>
              )}
            </label>
            <input type="file" id="resumeUpload" className="hidden" accept="application/pdf" onChange={onFileChange} />
          </div>

          <DialogFooter className="flex sm:justify-between gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex-1 h-12 text-muted-foreground/60"
              onClick={() => { setOpenResumeDialog(false); setFile(null); }}
            >
              Cancel
            </Button>
            <Button 
              disabled={!file || loading} 
              onClick={onUploadAnalyze}
              className="rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/10 flex-1 h-12 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin w-3 h-3 mr-2" />
              ) : (
                <Sparkles className="w-3 h-3 mr-2" />
              )}
              {loading ? "Processing" : "Upload & Analyze"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeUploadDialog;