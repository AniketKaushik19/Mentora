"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Loader2, Sparkles, Map, Target, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

function RoadmapGeneratorDialog({ openRoadmapDialog, setOpenRoadmapDialog }) {
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState("")
  const router = useRouter()

  const GenerateRoadmap = async () => {
    const roadmapId = uuidv4()
    setLoading(true);
    try {
      // Logic: Hitting the AI Agent API
      await axios.post('/api/ai-roadmap-agent', {
        roadmapId: roadmapId,
        userInput: userInput
      })
      
      // Navigate to the dynamic canvas page
      router.push('/ai-tools/ai-roadmap-agent/' + roadmapId)
      setOpenRoadmapDialog(false) // Close dialog on success
    } catch (error) {
      console.error("Roadmap Generation Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={openRoadmapDialog} onOpenChange={setOpenRoadmapDialog}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
        
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-linear-to-r from-purple-500 via-blue-500 to-emerald-500" />

        <div className="p-8 space-y-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Map size={24} />
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight">
                    Generate <span className="text-primary">Roadmap</span>
                </DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Define your career goal or a specific skill. Our AI will craft an 
              interactive learning path specifically for your journey.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Target size={18} />
              </div>
              <Input 
                placeholder='e.g. Senior Frontend Architect' 
                className="pl-10 h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-medium"
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                onKeyDown={(e) => e.key === 'Enter' && userInput && GenerateRoadmap()}
              />
            </div>
            <p className="text-[10px] text-center uppercase tracking-widest font-bold opacity-30">
                Powered by Mentora AI Engine
            </p>
          </div>

          <DialogFooter className="flex sm:justify-between gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all flex-1"
              onClick={() => setOpenRoadmapDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              disabled={loading || !userInput} 
              onClick={GenerateRoadmap}
              className="rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex-1 py-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {loading ? "Generating..." : "Create Path"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RoadmapGeneratorDialog;