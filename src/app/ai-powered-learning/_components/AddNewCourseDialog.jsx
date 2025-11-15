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
import { Axis3DIcon, Loader2Icon, Sparkle } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";


function AddNewCourseDialog({ children }) {
  const [loading,setLoading]=useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    includeVideo: false,
    noOfChapters: 1,
    category: "",
    level: "",
  });
const router=useRouter();
  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log({ [field]: value }); // ✅ For immediate feedback
  };

  const onGenerate =async () => {
    console.log(formData); // ✅ Now logs all correctly updated fields
    const courseId=uuidv4();
    try{
    setLoading(true);
    const result =await axios.post('/ai-powered-learning/api/generate-course-layout',{
      ...formData,
      courseId:courseId
    });
    console.log(result.data);
    setLoading(false);
    router.push('/ai-powered-learning/edit-course/'+result.data?.courseId);
    }
    catch(err){
      setLoading(false);
      console.log(err);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course Using AI</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-3 mt-2">
              {/* ✅ FIXED: onChange added to Input, not label */}
              <div>
                <label className="bg-gradient-to-r from-purple-500 to-blue-700 bg-clip-text text-transparent font-bold">
                  Course Name
                </label>
                <Input
                  placeholder="Course Name"
                  className="mt-2"
                  value={formData.name}
                  onChange={(e) =>
                    onHandleInputChange("name", e.target.value)
                  }
                />
              </div>

              {/* ✅ FIXED: onChange moved to Input */}
              <div>
                <label className="bg-gradient-to-r from-purple-500 to-blue-700 bg-clip-text text-transparent font-bold">
                  Course Description (Optional)
                </label>
                <Input
                  placeholder="Course Description"
                  className="mt-2"
                  value={formData.description}
                  onChange={(e) =>
                    onHandleInputChange("description", e.target.value)
                  }
                />
              </div>

              {/* ✅ FIXED: onChange moved to Input */}
              <div>
                <label className="bg-gradient-to-r from-purple-500 to-blue-700 bg-clip-text text-transparent font-bold">
                  No. of Chapters
                </label>
                <Input
                  placeholder="No. of chapters"
                  type="number"
                  className="mt-2"
                  value={formData.noOfChapters}
                  onChange={(e) =>
                    onHandleInputChange("noOfChapters", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="bg-gradient-to-r from-purple-500 to-blue-700 bg-clip-text text-transparent font-bold">
                  Include Video
                </label>
                <Switch
                  checked={formData.includeVideo}
                  onCheckedChange={(checked) =>
                    onHandleInputChange("includeVideo", checked)
                  }
                />
              </div>

              <div>
                <label className="bg-gradient-to-r from-purple-500 to-blue-700 bg-clip-text text-transparent font-bold">
                  Difficulty Level
                </label>
                <Select
                  onValueChange={(value) =>
                    onHandleInputChange("level", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ✅ FIXED: onChange moved to Input */}
              <div>
                <label className="bg-gradient-to-r from-purple-500 to-blue-700 bg-clip-text text-transparent font-bold">
                  Category
                </label>
                <Input
                  placeholder="Category (Separated by comma)"
                  className="mt-2"
                  value={formData.category}
                  onChange={(e) =>
                    onHandleInputChange("category", e.target.value)
                  }
                />
              </div>

              <div>
                <Button
                  onClick={onGenerate} disabled={loading}
                  className="w-full cursor-pointer bg-gradient-to-r from-purple-800 to-blue-700 text-white"
                >
                {loading?<Loader2Icon className="animate-spin"/>:
                  <Sparkle />} Generate Course
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
