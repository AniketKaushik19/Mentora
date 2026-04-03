"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon, MoveLeftIcon, Send, Sparkles, User2, Bot, Plus } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import EmptyState from "../_components/EmptyState";
import axios from "axios";
import ReactMarkdown from 'react-markdown'
import { useParams, useRouter } from "next/navigation";
import { v4 } from "uuid";

function AiChat() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const scrollRef = useRef(null);
  const router = useRouter();
  const { chatid } = useParams();

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
      
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full border-x border-border/40">
        
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
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-12 scrollbar-hide pt-10">
          {messageList.length <= 0 ? (
            <div className="h-full flex items-center justify-center opacity-40 grayscale">
              <EmptyState setUserInput={setUserInput} />
            </div>
          ) : (
            messageList.map((message, index) => (
              <div key={index} className={`flex gap-6 ${message.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                
                {/* Clean Indicator */}
                <div className={`mt-1 shrink-0 ${message.role === 'user' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {message.role === "user" ? <User2 className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Content Area - No Bulky Bubbles */}
                <div className={`flex-1 prose prose-sm dark:prose-invert max-w-none ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block text-left p-1 ${message.role === 'user' ? 'text-foreground font-medium' : 'text-foreground/90'}`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-6 animate-pulse items-center">
              <Bot className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Thinking...</span>
            </div>
          )}
        </div>

        {/* Minimalist Input Bar */}
        <div className="p-6">
          <div className="relative flex items-center bg-accent/30 rounded-2xl border border-border/50 focus-within:border-primary/40 focus-within:bg-accent/50 transition-all duration-300">
            <Input
              placeholder="Ask anything..."
              value={userInput}
              className="border-none bg-transparent focus-visible:ring-0 py-7 text-base pl-6 shadow-none"
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
            />
            <div className="pr-3">
              <Button 
                onClick={onSend} 
                disabled={loading || !userInput.trim()}
                size="icon"
                variant={userInput.trim() ? "primary" : "ghost"}
                className="rounded-xl h-10 w-10 transition-all shadow-lg shadow-primary/10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-center mt-4 opacity-30 font-medium tracking-[0.2em]">
            SYSTEM V.02 • SECURE ENCRYPTED CHAT
          </p>
        </div>
      </div>
    </div>
  );
}

export default AiChat;