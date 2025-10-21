"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React, { useState } from "react";
import EmptyState from "./_components/EmptyState";

function page() {
  const [userInput, setUserInput] = useState("");
  return (
    <div className="px-10 md:px-24 lg:px-36 xl:px-48 py-10">
      <div className="flex items-center justify-between gap-10 my-5">
        <div>
          <h2 className="font-bold text-xl">AI Career Q/A Chat</h2>
          <p className="text-sm text-gray-500">
            Smarter career decisions start here - get tailored advice ,
            real-time market insights , and a roadmap built just for you with
            the power of AI.
          </p>
        </div>
        <Button> + New Chat</Button>
      </div>

<div className="flex flex-col h-[60vh] md:h-[75vh]">
    {/* Empty State Options */}
    <EmptyState setUserInput={setUserInput} />
      
</div>
<div>
    {/* Message List */}
</div>
<div className="flex justify-between items-center gap-10">
    {/* Input Field */}
    <Input placeholder="Type here" value={userInput}/>
    <Button><Send/></Button>
</div>

    </div>
  );
}

export default page;
