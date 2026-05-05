"use client";
import { useSelectedChapter } from "@/app/context/SelectedChapterindexContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  CheckCircle,
  Loader2Icon,
  PlayCircle,
  BookOpen,
  ChevronRight,
  Trophy,
  ListTree, 
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import YouTube from "react-youtube";
import { toast } from "sonner";

function ChapterContent({ courseInfo, refreshData, setOpenSidebar }) {
  const { courseId } = useParams();
  const { enrollCourse } = courseInfo ?? {};
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex, setSelectedChapterIndex } = useSelectedChapter();
  
  const currentChapter = courseContent?.[selectedChapterIndex];
  const videoData = currentChapter?.youtubeVideo;
  const topics = currentChapter?.courseData?.topics;
  const chapterName = currentChapter?.courseData?.chapterName;
  
  let completedChapter = enrollCourse?.completedChapters ?? [];
  const [loading, setLoading] = useState(false);
  const isCompleted = completedChapter?.includes(selectedChapterIndex);

  const markChapterCompleted = async () => {
    setLoading(true);
    try {
        completedChapter.push(selectedChapterIndex);
        await axios.put("/ai-powered-learning/api/enroll-course", {
          courseId,
          completedChapter,
        });
        refreshData();
        toast.success("🎉 Chapter marked as completed!");
    } catch (error) {
        toast.error("Failed to update status");
    } finally {
        setLoading(false);
    }
  };

  const markChapterInCompleted = async () => {
    setLoading(true);
    try {
        const completedChap = completedChapter.filter(
          (item) => item !== selectedChapterIndex
        );
        await axios.put("/ai-powered-learning/api/enroll-course", {
          courseId,
          completedChapter: completedChap,
        });
        refreshData();
        toast.error("Chapter marked as incomplete.");
    } catch (error) {
        toast.error("Failed to update status");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* ── Sticky Chapter Header ───────────────────────────── */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-gray-900/80 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          {/* Chapter Info + Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            {/* FIX: Added optional chaining ?. to prevent crash if prop is missing */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenSidebar?.(true)}
              className="lg:hidden flex shrink-0 items-center gap-2 border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 rounded-lg px-3"
            >
              <ListTree className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Chapters</span>
            </Button>

            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                CH. {selectedChapterIndex + 1}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>

            <h1 className="font-bold text-base sm:text-lg bg-gradient-to-r from-purple-100 to-blue-200 text-transparent bg-clip-text truncate leading-tight">
              {chapterName ?? "Select a chapter"}
            </h1>
          </div>

          <div className="shrink-0">
            {!isCompleted ? (
              <Button
                onClick={markChapterCompleted}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-2 rounded-lg shadow-lg border border-purple-500/30 active:scale-95"
              >
                {loading ? <Loader2Icon className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3 mr-1.5" />}
                <span className="hidden xs:inline">Mark Complete</span>
                <span className="xs:hidden inline">Done</span>
              </Button>
            ) : (
              <Button
                onClick={markChapterInCompleted}
                disabled={loading}
                className="bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-2 rounded-lg border border-emerald-500/30 active:scale-95"
              >
                <Trophy className="w-3 h-3 mr-1.5" />
                {loading ? "..." : "Completed"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* Videos Section */}
        {videoData && videoData.length > 0 && (
          <section className="w-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <PlayCircle className="w-4 h-4 text-red-400" />
              </div>
              <h2 className="font-bold text-base text-white uppercase tracking-tight">Tutorial Library</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoData.slice(0, 2).map((video, index) => (
                <div key={index} className="group rounded-xl overflow-hidden border border-white/5 bg-gray-900/40 transition-all hover:border-purple-500/30">
                  {video?.title && (
                    <div className="px-4 py-2.5 border-b border-white/5 bg-black/20">
                      <p className="text-[11px] text-gray-400 font-medium truncate italic">
                         {video.title}
                      </p>
                    </div>
                  )}
                  <div className="relative aspect-video w-full">
                    <YouTube
                      videoId={video?.videoId}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: { modestbranding: 1, rel: 0 },
                      }}
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Topics Section */}
        {topics && topics.length > 0 ? (
          <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="font-bold text-base text-white uppercase tracking-tight">Core Curriculum</h2>
            </div>

            <div className="space-y-8">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl border border-white/5 bg-gray-900/20 overflow-hidden hover:border-purple-500/20 transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/40" />
                  <div className="pl-6 pr-5 py-6">
                    <div className="flex items-start gap-4 mb-5">
                      <span className="shrink-0 w-6 h-6 rounded bg-purple-600 text-white text-[10px] flex items-center justify-center font-black">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-lg text-gray-100 leading-tight break-words overflow-hidden">
                        {topic?.topic}
                      </h3>
                    </div>

                    <div
                      className="prose prose-invert prose-sm max-w-full text-gray-300/90 leading-relaxed
                        break-words overflow-hidden
                        prose-p:mb-4
                        prose-headings:text-purple-200
                        prose-code:bg-white/5 prose-code:text-pink-300 prose-code:px-1.5 prose-code:rounded
                        prose-ul:space-y-2 prose-li:text-gray-300 prose-li:marker:text-purple-500"
                      dangerouslySetInnerHTML={{ __html: topic?.content }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          !courseContent && (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl">
              <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm font-medium">Select a chapter module to initialize content.</p>
            </div>
          )
        )}

        {/* Chapter Navigation Footer */}
        {courseContent && courseContent.length > 1 && (
          <div className="flex items-center justify-between pt-10 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={() => setSelectedChapterIndex(Math.max(0, selectedChapterIndex - 1))}
              disabled={selectedChapterIndex === 0}
              className="text-gray-500 hover:text-white hover:bg-white/5 rounded-lg px-4 text-xs font-bold uppercase tracking-widest disabled:opacity-10"
            >
              ← Prev
            </Button>
            <span className="text-[10px] font-mono text-gray-600">
              MOD {selectedChapterIndex + 1} OF {courseContent.length}
            </span>
            <Button
              variant="ghost"
              onClick={() => setSelectedChapterIndex(Math.min(courseContent.length - 1, selectedChapterIndex + 1))}
              disabled={selectedChapterIndex === courseContent.length - 1}
              className="text-gray-500 hover:text-white hover:bg-white/5 rounded-lg px-4 text-xs font-bold uppercase tracking-widest disabled:opacity-10"
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterContent;