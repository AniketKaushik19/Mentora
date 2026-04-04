"use client";
import { useSelectedChapter } from "@/app/context/SelectedChapterindexContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  CheckCircle,
  Loader2Icon,
  XCircle,
  PlayCircle,
  BookOpen,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import YouTube from "react-youtube";
import { toast } from "sonner";

function ChapterContent({ courseInfo, refreshData }) {
  const { courseId } = useParams();
  const { courses, enrollCourse } = courseInfo ?? {};
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex, setSelectedChapterIndex } = useSelectedChapter();
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
  const chapterName = courseContent?.[selectedChapterIndex]?.courseData?.chapterName;
  let completedChapter = enrollCourse?.completedChapters ?? [];
  const [loading, setLoading] = useState(false);
  const isCompleted = completedChapter?.includes(selectedChapterIndex);

  const markChapterCompleted = async () => {
    setLoading(true);
    completedChapter.push(selectedChapterIndex);
    await axios.put("/ai-powered-learning/api/enroll-course", {
      courseId,
      completedChapter,
    });
    refreshData();
    toast.success("🎉 Chapter marked as completed!");
    setLoading(false);
  };

  const markChapterInCompleted = async () => {
    setLoading(true);
    const completedChap = completedChapter.filter(
      (item) => item !== selectedChapterIndex
    );
    await axios.put("/ai-powered-learning/api/enroll-course", {
      courseId,
      completedChapter: completedChap,
    });
    refreshData();
    toast.error("Chapter marked as incomplete.");
    setLoading(false);
  };

  // The page.jsx now handles the loading / empty state so courseInfo is guaranteed to be available here when rendered.

  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* ── Sticky Chapter Header ───────────────────────────── */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900/80 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
          {/* Breadcrumb + title */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Chapter {selectedChapterIndex + 1}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <h1 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 text-transparent bg-clip-text leading-tight">
              {chapterName ?? "Select a chapter"}
            </h1>
          </div>

          {/* Complete button */}
          <div className="shrink-0">
            {!isCompleted ? (
              <Button
                onClick={markChapterCompleted}
                disabled={loading}
                className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-900/40 transition-all duration-200 hover:shadow-purple-700/50 hover:scale-105 active:scale-95 border border-purple-500/30"
              >
                {loading ? (
                  <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Mark as Completed
              </Button>
            ) : (
              <Button
                onClick={markChapterInCompleted}
                disabled={loading}
                className="cursor-pointer bg-emerald-600/20 hover:bg-red-600/20 text-emerald-400 hover:text-red-400 text-sm font-semibold px-5 py-2.5 rounded-xl border border-emerald-500/40 hover:border-red-500/40 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trophy className="w-4 h-4 mr-2" />
                )}
                {loading ? "Saving..." : "Completed ✓"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-12">

        {/* ── Videos Section ───────────────────────────────── */}
        {videoData && videoData.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <PlayCircle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="font-bold text-lg text-white">Related Videos</h2>
              <span className="ml-auto text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
                {Math.min(videoData.length, 2)} video{videoData.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {videoData.map(
                (video, index) =>
                  index < 2 && (
                    <div
                      key={index}
                      className="group rounded-2xl overflow-hidden border border-white/10 bg-gray-800/40 backdrop-blur-sm shadow-xl hover:shadow-purple-900/30 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Video title bar */}
                      {video?.title && (
                        <div className="px-4 py-3 border-b border-white/10 bg-black/20">
                          <p className="text-xs text-gray-300 font-medium truncate">
                            🎬 {video.title}
                          </p>
                        </div>
                      )}
                      {/* Responsive YouTube embed */}
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <YouTube
                          videoId={video?.videoId}
                          opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: { modestbranding: 1, rel: 0 },
                          }}
                          className="absolute inset-0 w-full h-full"
                          iframeClassName="w-full h-full"
                        />
                      </div>
                    </div>
                  )
              )}
            </div>
          </section>
        )}

        {/* ── Topics Section ────────────────────────────────── */}
        {topics && topics.length > 0 ? (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="font-bold text-lg text-white">Chapter Topics</h2>
              <span className="ml-auto text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
                {topics.length} topic{topics.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-6">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-sm overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-l-2xl" />

                  <div className="pl-6 pr-5 py-6">
                    {/* Topic header */}
                    <div className="flex items-start gap-3 mb-4">
                      <span className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-lg bg-gradient-to-r from-purple-300 via-pink-200 to-blue-300 text-transparent bg-clip-text leading-snug">
                        {topic?.topic}
                      </h3>
                    </div>

                    {/* Topic content */}
                    <div
                      className="prose prose-invert prose-sm max-w-none text-gray-300
                        prose-headings:text-purple-300 prose-headings:font-bold
                        prose-strong:text-white prose-strong:font-semibold
                        prose-code:bg-gray-700/60 prose-code:text-pink-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-purple-400
                        prose-blockquote:border-l-purple-500 prose-blockquote:text-gray-400"
                      dangerouslySetInnerHTML={{ __html: topic?.content }}
                      style={{ lineHeight: "1.9" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* Empty state */
          !courseContent && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-purple-400/50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No chapter selected</h3>
              <p className="text-sm text-gray-600">Pick a chapter from the sidebar to start learning.</p>
            </div>
          )
        )}

        {/* ── Chapter Navigation Footer ────────────────────── */}
        {courseContent && courseContent.length > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={() =>
                setSelectedChapterIndex(Math.max(0, selectedChapterIndex - 1))
              }
              disabled={selectedChapterIndex === 0}
              className="text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 rounded-xl px-4 py-2 transition-all"
            >
              ← Previous
            </Button>
            <span className="text-xs text-gray-600">
              {selectedChapterIndex + 1} / {courseContent.length}
            </span>
            <Button
              variant="ghost"
              onClick={() =>
                setSelectedChapterIndex(
                  Math.min(courseContent.length - 1, selectedChapterIndex + 1)
                )
              }
              disabled={selectedChapterIndex === courseContent.length - 1}
              className="text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 rounded-xl px-4 py-2 transition-all"
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
