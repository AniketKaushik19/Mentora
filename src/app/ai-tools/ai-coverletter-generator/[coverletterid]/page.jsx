"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  LoaderCircleIcon, 
  Send, 
  MoveLeftIcon, 
  Sparkles, 
  Plus, 
  Copy, 
  CheckCircle,
  Briefcase,
  Building2,
  ScrollText,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useRouter, useParams } from "next/navigation";
import { v4 } from "uuid";
import remarkGfm from "remark-gfm";

function CoverLetterPage() {
  const router = useRouter();
  const { coverletterid } = useParams();

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (coverletterid) {
      getCoverLetter();
    }
  }, [coverletterid]);

  const getCoverLetter = async () => {
    try {
      const result = await axios.get(`/api/history?recordId=${coverletterid}`);
      const content = result?.data?.content;
      setCoverLetter(typeof content === "string" ? content.replace(/\\n/g, "\n") : "");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerate = async () => {
    if(!jobTitle || !companyName) return;
    setLoading(true);
    const userInput = `Job Title: ${jobTitle}\nCompany: ${companyName}\nExperience: ${experience}`;

    try {
      const response = await axios.post("/api/ai-coverletter-generator", { userInput });
      const content = response?.data?.content;
      const formattedContent = typeof content === "string" ? content.replace(/\\n/g, "\n") : "";
      setCoverLetter(formattedContent);
      
      await axios.put('/api/history', {
        recordId: coverletterid,
        content: formattedContent
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // Reduced mt-16 to mt-4 and p-12 to p-6 for a tighter top section
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-4 min-h-screen pb-20">
      
      {/* Top Navigation Bar - Now more compact */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border/40 pb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/ai-tools')}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all w-8 h-8"
          >
            <MoveLeftIcon className="w-4 h-4" /> 
          </Button>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              AI Cover Letter <span className="gradient-text-primary text-lg md:text-xl font-bold">Drafts</span>
            </h2>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Workspace</span>
          </div>
        </div>
        <Button 
            onClick={() => router.replace("/ai-tools/ai-coverletter-generator/" + v4())} 
            variant="outline" 
            size="sm" 
            className="rounded-full font-bold border-primary/20 hover:bg-primary/5 text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-2" /> New Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Compact Input Panel */}
        <div className="lg:col-span-4 space-y-4 bg-card border border-border/50 p-5 rounded-2xl shadow-sm sticky top-24">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <ScrollText className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 text-foreground">Configuration</span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
              </div>
              <Input
                placeholder="Role (e.g. React Developer)"
                className="pl-10 h-11 bg-muted/20 border-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xl text-sm"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
              </div>
              <Input
                placeholder="Target Company"
                className="pl-10 h-11 bg-muted/20 border-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xl text-sm"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Briefly mention your core skills/experience..."
                className="bg-muted/20 border-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xl text-sm min-h-[140px] resize-none p-4"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            className="w-full py-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]" 
            onClick={handleGenerate} 
            disabled={loading || !jobTitle || !companyName}
          >
            {loading ? <LoaderCircleIcon className="animate-spin mr-2" /> : <Sparkles className="mr-2 w-4 h-4" />}
            {loading ? "Writing..." : "Generate Letter"}
          </Button>
        </div>

        {/* RIGHT: Document Preview */}
        <div className="lg:col-span-8 min-h-[500px]">
          {coverLetter ? (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-muted/30 border-b border-border/50 p-3 flex justify-between items-center">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Ready to Send</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={copyToClipboard}
                  className="text-xs font-bold gap-2 hover:bg-primary/10 hover:text-primary rounded-lg h-8"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              
              <div className="p-8 md:p-14 overflow-y-auto max-h-[75vh] custom-scrollbar bg-white dark:bg-slate-950">
                <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-5 whitespace-pre-line text-slate-800 dark:text-slate-200 antialiased font-serif">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {coverLetter}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-muted/5 p-12 text-center opacity-60">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="text-muted-foreground w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Awaiting Input</h3>
              <p className="text-muted-foreground text-xs max-w-xs mt-2 leading-relaxed">
                Fill in the job details to generate a high-impact, professional cover letter tailored specifically for you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FileText = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
)

export default CoverLetterPage;