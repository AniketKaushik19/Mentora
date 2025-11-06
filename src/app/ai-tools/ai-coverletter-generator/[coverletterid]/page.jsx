"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircleIcon, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { v4 } from "uuid";
import remarkGfm from "remark-gfm";
import { MoveLeftIcon } from "lucide-react";
function CoverLetterPage() {
  const router = useRouter();
  const { coverletterid } = useParams();

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (coverletterid) {
      getCoverLetter();
    }
  }, [coverletterid]);

  const getCoverLetter = async () => {
    try {
      const result = await axios.get(`/api/history?recordId=${coverletterid}`);
      const content = result?.data?.content;
      setCoverLetter(typeof content === "string" ? content : "");
    } catch (error) {
      console.error("Failed to fetch message history:", error);
      setCoverLetter("Failed to load cover letter.");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const userInput = `Job Title: ${jobTitle}\nCompany: ${companyName}\nExperience: ${experience}`;

    try {
      const response = await axios.post("/api/ai-coverletter-generator", {
        userInput,
      });
      const content = response?.data?.content;
      setCoverLetter(
        typeof content === "string" ? content : "No content received."
      );
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setCoverLetter("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onNewLetter = async () => {
    const id = v4();
    await axios.post("/api/history", {
      recordId: id,
      content: [],
    });
    router.replace("/ai-tools/ai-coverletter-generator/" + id);
  };

  return (
    <div className="px-5 md:px-24 lg:px-36 xl:px-48 py-10 space-y-6">
        <Button variant={"primary"} onClick={()=>router.push('/ai-tools')}><MoveLeftIcon/> Back</Button>
      <div className="flex items-center justify-between gap-10">
        <div>
          <h2 className="font-bold text-xl">AI Cover Letter Generator</h2>
          <p className="text-sm text-gray-500 text-justify">
            Craft personalized, professional cover letters in seconds. Just tell
            us about the job and your experience — we’ll handle the rest.
          </p>
        </div>
        <Button
          onClick={onNewLetter}
          variant={"primary"}
          className="hover:cursor-pointer"
        >
          + New Letter
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Job Title (e.g., Software Engineer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <Input
          placeholder="Company Name (e.g., Google)"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Textarea
          placeholder="Briefly describe your experience and skills"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          rows={5}
        />
        <Button variant={"primary"} onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <>
              <LoaderCircleIcon className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Send className="mr-2" /> Generate
            </>
          )}
        </Button>
      </div>

      {typeof coverLetter === "string" && coverLetter.trim() !== "" && (
        <div className="mt-8 p-2 md:p-6 bg-gray-100 dark:bg-gray-800 rounded-md shadow overflow-x-auto">
          <h3 className="font-semibold text-lg mb-4">Your Cover Letter</h3>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap wrap-break-word">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {coverLetter
                ?.replace(/\\n/g, "\n")
                ?.replace(/\*\*(.*?)\*\*/g, "**$1**")
                ?.trim()}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverLetterPage;
