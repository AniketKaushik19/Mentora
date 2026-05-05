"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Terminal, Plus, Cpu, Layers } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";

function AddNewCourseDialog({ children }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    includeVideo: false,
    noOfChapters: 1,
    category: "",
    level: "",
  });
  const router = useRouter();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGenerate = async () => {
    const courseId = uuidv4();
    try {
      setLoading(true);
      const result = await axios.post('/ai-powered-learning/api/generate-course-layout', {
        ...formData,
        courseId: courseId
      });
      setLoading(false);
      router.push('/ai-powered-learning/edit-course/' + result.data?.courseId);
    }
    catch (err) {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* Updated Dialog Content to Deep Dark Theme */}
      <DialogContent className="bg-[#0b0b0b] border-white/10 text-slate-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-white">
            <Cpu className="w-5 h-5 text-indigo-500" /> Initialize Course
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-5 mt-6">
              
              {/* Field: Course Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Course Identification
                </label>
                <Input
                  placeholder="e.g. Advanced Quantum Computing"
                  className="bg-white/5 border-white/10 focus:border-white/20 h-12 rounded-xl text-white placeholder:text-slate-600"
                  value={formData.name}
                  onChange={(e) => onHandleInputChange("name", e.target.value)}
                />
              </div>

              {/* Field: Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Scope Definition
                </label>
                <Input
                  placeholder="Briefly describe the learning objectives..."
                  className="bg-white/5 border-white/10 focus:border-white/20 h-12 rounded-xl text-white placeholder:text-slate-600"
                  value={formData.description}
                  onChange={(e) => onHandleInputChange("description", e.target.value)}
                />
              </div>

              {/* Grid for small inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                    Modules
                  </label>
                  <Input
                    type="number"
                    className="bg-white/5 border-white/10 h-12 rounded-xl text-white"
                    value={formData.noOfChapters}
                    onChange={(e) => onHandleInputChange("noOfChapters", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                    Difficulty
                  </label>
                  <Select onValueChange={(v) => onHandleInputChange("level", v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10 text-white">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Taxonomy / Tags
                </label>
                <Input
                  placeholder="Tech, AI, Backend..."
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white"
                  value={formData.category}
                  onChange={(e) => onHandleInputChange("category", e.target.value)}
                />
              </div>

              {/* Video Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 mt-2">
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-300">Multimedia Assets</span>
                   <span className="text-[10px] text-slate-500 uppercase tracking-wider">Include AI curated videos</span>
                </div>
                <Switch
                  checked={formData.includeVideo}
                  onCheckedChange={(c) => onHandleInputChange("includeVideo", c)}
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={onGenerate} 
                  disabled={loading || !formData.name}
                  className="w-full h-14 cursor-pointer bg-white text-black hover:bg-slate-200 transition-all rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-white/5 gap-2"
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin w-4 h-4" />
                  ) : (
                    <>
                      <Terminal className="w-4 h-4" /> GenerateCourse
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;