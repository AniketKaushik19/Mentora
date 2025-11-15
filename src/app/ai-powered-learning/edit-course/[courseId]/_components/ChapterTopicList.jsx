"use client";
import React from "react";

function ChapterTopicList({ course }) {
  const courseLayout = course?.courseJson?.course;

  return (
    <div className="mt-8">
      <h2 className="font-bold text-2xl mb-8 ">Chapters & Topics</h2>

      <div className="flex flex-col items-center justify-center gap-10">
        {courseLayout?.chapters?.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="flex flex-col  w-full">
            {/* Chapter Box */}
            <div className="p-3 border shadow rounded-xl cursor-pointer bg-gradient-to-r from-purple-700  to-blue-800 text-white text-center w-[400px]">
              <h2 className="text-lg font-bold">Chapter {chapterIndex + 1}</h2>
              <h2 className="text-xl font-semibold mt-1">{chapter.chapterName}</h2>
              <div className="flex justify-between text-xs mt-2">
                <span>Duration: {chapter.duration}</span>
                <span>No. of Topics: {chapter?.topics?.length}</span>
              </div>
            </div>

            {/* Topics List */}
            <div className="flex flex-col items-start mt-6 relative">
              {chapter?.topics?.map((topic, topicIndex) => (
                <div key={topicIndex} className="flex items-center gap-4">
                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center">
                    <div className="text-center rounded-full bg-gray-300 w-8 h-8 flex items-center justify-center font-semibold text-gray-800">
                      {topicIndex + 1}
                    </div>
                    {/* Line below each topic except last */}
                    {topicIndex !== chapter.topics.length - 1 && (
                      <div className="w-[2px] h-10 bg-gray-300"></div>
                    )}
                  </div>

                  {/* Topic Text */}
                  <p className="text-sm text-white w-[600px]">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

       
      </div>
    </div>
  );
}

export default ChapterTopicList;
