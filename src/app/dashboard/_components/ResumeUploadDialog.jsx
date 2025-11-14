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
import { File, Loader2, Sparkles } from "lucide-react";
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
    if (uploadedFile && uploadedFile.type === "application/pdf") {
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
      const result = await axios.post("/api/ai-resume-agent/"+recordId, formData);
      router.push("/ai-tools/ai-resume-analyzer");
      setOpenResumeDialog(false);
    } catch (error) {
      console.error("❌ Upload error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Error uploading resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openResumeDialog} onOpenChange={setOpenResumeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume (PDF)</DialogTitle>
          <DialogDescription>
            <label
              htmlFor="resumeUpload"
              className="flex flex-col items-center justify-center p-7 border border-dashed rounded-xl hover:bg-slate-100 cursor-pointer transition"
            >
              <File className="h-10 w-10" />
              {file ? (
                <h2 className="mt-3 text-blue-600">{file.name}</h2>
              ) : (
                <h2 className="mt-3">Click here to upload your resume</h2>
              )}
            </label>
            <input
              type="file"
              id="resumeUpload"
              className="hidden"
              accept="application/pdf"
              onChange={onFileChange}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => {setOpenResumeDialog(false)
                  setLoading(false);

          }}>
            Cancel
          </Button>
          <Button disabled={!file || loading} onClick={onUploadAnalyze}>
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeUploadDialog;
