"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import Report from "../_components/Report";
function AiResumeAnalyzer() {
  const { resumeId } = useParams();
  const [pdfUrl, setPdfUrl] = useState();
  const [aiReport, setAiReport] = useState();
  useEffect(() => {
    resumeId && GetResumeAnalyzerRecord();
    console.log(resumeId)
  }, [resumeId]);
  const GetResumeAnalyzerRecord = async () => {
    const result = await axios.get(`/api/history?recordId=${resumeId}`);

    // console.log("result data :" +JSON.stringify(result?.data));
    setPdfUrl(result?.data?.metaData);
    setAiReport(result?.data?.content);
  };

  return (
    <div className="grid lg:grid-cols-5 grid-cols-1 gap-5 mx-2 md:mx-5 my-3 md:my-10">
      <div className="col-span-2"><Report aiReport={aiReport}/></div>
      <div className="col-span-3">
        <h2 className="font-bold text-2xl mb-5 text-center">Resume Preview</h2>
   {pdfUrl ? (
     <iframe
    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
    className="w-full h-[110vh] rounded-md shadow-md sticky top-0"
    style={{ border: "none" }}
  ></iframe>
) : (
  <div className="text-center py-10 text-gray-500">
    PDF preview not available.
  </div>
)}


      </div>
    </div>
  );
}

export default AiResumeAnalyzer;
