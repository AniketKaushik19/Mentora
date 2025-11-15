import React, { useState } from "react";
import ResumeUploadDialog from "@/app/dashboard/_components/ResumeUploadDialog";
import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";

function Report({ aiReport }) {
  const [openResumeDialog, setOpenResumeDialog] = useState(false);

  const getStatusColor = (per) => {
    if (per < 60) return "red";
    if (per >= 60 && per <= 80) return "yellow";
    return "green";
  };

  const getBorderColor = (per) => {
    const color = getStatusColor(per);
    return `border-${color}-500`;
  };

  const getTextColor = (per) => {
    const color = getStatusColor(per);
    return `text-${color}-500`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          AI Analysis Result
        </h2>
        <Button
          type="button"
          onClick={() => setOpenResumeDialog(true)}
          className=" hover:text-gray-600 hover:bg-gray-300"
        >
          Re-analyze <Sparkle />
        </Button>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-[#BE575F] via-[#A33BE3] to-[#AC76D6] p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <i className="fas fa-star text-yellow-500 mr-2"></i> Overall Score
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span className="text-6xl font-extrabold text-white">
            {aiReport?.overall_score}
          </span>
          <div className="flex items-center">
            <i className="fas fa-arrow-up text-green-500 text-lg mr-2"></i>
            <span className="text-yellow-300 text-lg font-bold">
              {aiReport?.overall_growth}%
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-pink-400 h-2.5 rounded-full"
            style={{ width: `${aiReport?.overall_score}%` }}
          ></div>
        </div>

        <p className="text-gray-200 text-sm">{aiReport?.summary_comment}</p>
      </div>

      {/* Section Breakdown */}
      {["contact_info", "experience", "education", "skills"].map(
        (sectionKey) => {
          const section = aiReport?.sections?.[sectionKey];
          const color = getStatusColor(section?.score);
          const borderColor = getBorderColor(section?.score);
          const textColor = getTextColor(section?.score);
          const titleMap = {
            contact_info: "Contact Info",
            experience: "Experience",
            education: "Education",
            skills: "Skills",
          };

          const iconMap = {
            contact_info: "fa-address-book",
            experience: "fa-briefcase",
            education: "fa-graduation-cap",
            skills: "fa-lightbulb",
          };
          return (
            <div
              key={sectionKey}
              className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${borderColor}`}
            >
              <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <i
                  className={`fas ${iconMap[sectionKey]} text-gray-500 mr-2`}
                ></i>
                {titleMap[sectionKey]}
              </h4>
              <p className="text-sm text-gray-500">
                Score:{" "}
                <span className={getTextColor(section?.score)}>
                  {section?.score}%
                </span>
              </p>
              <div className="bg-white rounded-lg shadow p-4 relative">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
<i className={`fas ${iconMap[sectionKey]} text-gray-500 mt-2`} >{titleMap[sectionKey]}</i>
                </h4>
                <span className={`text-4xl font-bold ${textColor}`}> {section?.score}</span>
                <p className="text-sm text-gray-600 mt-2">{section?.comment}</p>
                <div className={`absolute inset-x-0 bottom-0 h-1 bg-${color}`}>
Dont't know
                </div>
              </div>
            </div>
          );
        }
      )}

      {/* Skill Match */}
      {/* <div className="mt-6 p-6 rounded-lg shadow-md bg-white border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Skill Match
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Your resume aligns well with your role’s skills, but there are areas
          to refine.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Python", "React.js", "Node.js", "Data Analysis"].map(
            (skill, i) => (
              <span
                key={i}
                className={`${
                  i < 2
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                } text-xs font-medium px-3 py-1 rounded-full`}
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div> */}


      {/* Tips for Improvement */}
<div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
  <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
    <i className="fas fa-lightbulb text-orange-400 mr-2"></i>
    Tips for Improvement
  </h3>

  <ol className="list-none space-y-4">
    {aiReport?.tips_for_improvement.map((item, index) => (
      <li key={index} className="flex items-start gap-4">
        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
          <i className="fas fa-check text-xs"></i>
        </span>
        <p className="text-gray-600 text-sm">{item}</p>
      </li>
    ))}
  </ol>
</div>


      {/* Strengths & Improvements */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-thumbs-up text-green-500"></i> Areas of
            Strength
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
            {aiReport?.whats_good?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-red-500"></i> Areas
            for Improvement
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
            {aiReport?.needs_improvement?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 text-white rounded-lg shadow-md text-sm bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
          <i className="fas fa-arrow-up-right-from-square mr-2"></i> Generate
          Improved Resume
        </button>
      </div>

      {/* Resume Upload Dialog */}
      <ResumeUploadDialog
        openResumeDialog={openResumeDialog}
        setOpenResumeDialog={() => setOpenResumeDialog(false)}
      />
    </div>
  );
}

export default Report;
