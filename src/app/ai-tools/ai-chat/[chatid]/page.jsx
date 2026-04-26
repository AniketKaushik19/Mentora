"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon, MoveLeftIcon, Send, Sparkles, User2, Bot, Plus } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import EmptyState from "../_components/EmptyState";
import axios from "axios";
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm' // Allows tables and task lists
import { useParams, useRouter } from "next/navigation";
import { v4 } from "uuid";

function AiChat() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const scrollRef = useRef(null);
  const router = useRouter();
  const { chatid } = useParams();

  // Custom Markdown Styles to fix "Messy" content
  const MarkdownComponents = {
    h1: ({node, ...props}) => <h1 className="text-xl font-bold text-primary mt-6 mb-2" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-lg font-bold text-foreground/90 mt-5 mb-2 border-b border-border/30 pb-1" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-md font-semibold text-foreground/80 mt-4 mb-1" {...props} />,
    p: ({node, ...props}) => <p className="leading-relaxed mb-4 text-foreground/80" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
    li: ({node, ...props}) => <li className="pl-1" {...props} />,
    strong: ({node, ...props}) => <strong className="font-bold text-primary/90" {...props} />,
    table: ({node, ...props}) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-border/50">
        <table className="min-w-full divide-y divide-border/50 bg-accent/10" {...props} />
      </div>
    ),
    thead: ({node, ...props}) => <thead className="bg-accent/20" {...props} />,
    th: ({node, ...props}) => <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider" {...props} />,
    td: ({node, ...props}) => <td className="px-4 py-2 text-sm border-t border-border/30" {...props} />,
    code: ({node, inline, ...props}) => 
      inline 
        ? <code className="bg-accent px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props} />
        : <code className="block bg-accent/40 p-4 rounded-xl font-mono text-sm overflow-x-auto my-4 border border-border/20" {...props} />
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messageList, loading]);

  useEffect(() => { chatid && getMessageList(); }, [chatid]);

  const getMessageList = async () => {
    try {
      const result = await axios.get(`/api/history?recordId=${chatid}`);
      setMessageList(result?.data?.content ?? []);
    } catch (error) { console.error(error); }
  };

  const onSend = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    const msg = { content: userInput, role: "user", type: "text" };
    setMessageList((prev) => [...prev, msg]);
    setUserInput('');
    try {
      const result = await axios.post("/api/ai-career-chat-agent", { userInput: userInput });
      setMessageList((prev) => [...prev, result.data]);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen bg-background font-sans text-foreground">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full border-x border-border/40">
        
        {/* Sleek Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/40 bg-background/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-accent rounded-full transition-colors">
              <MoveLeftIcon className="w-4 h-4 opacity-70" />
            </button>
            <h2 className="text-sm font-semibold tracking-tight uppercase opacity-80">Career Intelligence</h2>
          </div>
          <Button onClick={() => router.replace('/ai-tools/ai-chat/'+v4())} variant="ghost" size="sm" className="gap-2 text-xs font-bold hover:bg-primary/5">
            <Plus className="w-3 h-3" /> New Session
          </Button>
        </header>

        {/* Chat Feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide pt-10">
          {messageList.length <= 0 ? (
            <div className="h-full flex items-center justify-center opacity-40 grayscale">
              <EmptyState setUserInput={setUserInput} />
            </div>
          ) : (
            messageList.map((message, index) => (
              <div key={index} className={`flex gap-6 ${message.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                
                <div className={`mt-1 shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-accent text-muted-foreground'}`}>
                  {message.role === "user" ? <User2 className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block text-left w-full ${message.role === 'user' ? 'bg-primary/5 rounded-2xl p-4 border border-primary/10' : ''}`}>
                    <ReactMarkdown 
                      remarkPlugins={[gfm]} 
                      components={MarkdownComponents}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-6 items-center pl-2">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase animate-pulse">Processing Query</span>
                <div className="h-2 w-24 bg-accent rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Minimalist Input Bar */}
        <div className="p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="relative flex items-center bg-accent/30 rounded-2xl border border-border/50 focus-within:border-primary/40 focus-within:bg-accent/50 focus-within:shadow-2xl focus-within:shadow-primary/5 transition-all duration-500">
            <Input
              placeholder="Ask about careers, resumes, or roadmaps..."
              value={userInput}
              className="border-none bg-transparent focus-visible:ring-0 py-8 text-base pl-6 shadow-none"
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
            />
            <div className="pr-4">
              <Button 
                onClick={onSend} 
                disabled={loading || !userInput.trim()}
                size="icon"
                className={`text-white rounded-xl h-12 w-12 transition-all duration-300 ${userInput.trim() ? "bg-primary shadow-lg shadow-primary/20 scale-100" : "bg-transparent opacity-20 scale-90"}`}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <p className="text-[9px] text-center mt-4 opacity-30 font-bold tracking-[0.3em]">
            MENTORA AI CORE • SESSION ENCRYPTED
          </p>
        </div>
      </div>
    </div>
  );
}

export default AiChat;