import React from "react";
import AItools from "../dashboard/_components/AItools";
import WelcomeBanner from "../dashboard/_components/WelcomeBanner";

function AiToolsOption() {
  return (
    <div className="m-5 mt-28">
        
      <WelcomeBanner />
      <h2 className="font-bold text-2xl mt-5">AI Career Chat Agents</h2>
      <AItools />
    </div>
  );
}

export default AiToolsOption;