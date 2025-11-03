"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmptyState from "../_components/EmptyState";
import axios from "axios";
import ReactMarkdown from 'react-markdown'
import { useParams } from "next/navigation";
import { v4 } from "uuid";
import {  useRouter } from "next/navigation";
function AiChat() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState([]);
const router=useRouter()
const {chatid}=useParams();

useEffect(()=>{
chatid && getMessageList()
},[chatid])

const getMessageList = async () => {
  try {
    const result = await axios.get(`/api/history?recordId=${chatid}`);
    setMessageList(result?.data?.content ?? []);
  } catch (error) {
    console.error("Failed to fetch message history:", error);
  }
};

  const onSend = async () => {
    setLoading(true);
    setMessageList((prev) => [
      ...prev,
      { content: userInput, role: "user", type: "text" },
    ]);
    setUserInput('')
    const result = await axios.post("/api/ai-career-chat-agent", {
      userInput: userInput,
    });
    setMessageList((prev) => [...prev, result.data]);
    setLoading(false);
  };

  useEffect(() => {
    //save message into database
   messageList.length>0 && updateMessageList()
  }, [messageList]);

  const updateMessageList=async()=>{
    await axios.put('/api/history',{
   content:messageList,
   recordId:chatid
    })
  }

const onNewChat=async()=>{
const id=v4();
await axios.post('/api/history',{
      recordId:id,
      content:[]
    })
    router.replace('/ai-tools/ai-chat/'+id)
}
  return (
    <div className="px-5 md:px-24 lg:px-36 xl:px-48 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-10 md:my-5">
        <div>
          <h2 className="font-bold text-xl">AI Career Q/A Chat</h2>
          <p className="text-sm text-gray-500">
            Smarter career decisions start here - get tailored advice ,
            real-time market insights , and a roadmap built just for you with
            the power of AI.
          </p>
        </div>
        <Button onClick={onNewChat}> + New Chat</Button>
      </div>
      <div className="flex flex-col h-[60vh] md:h-[70vh] overflow-y-auto">
        {/* Empty State Options */}
        {messageList.length <= 0 && 
          <div className="mt-5">
            <EmptyState setUserInput={setUserInput} />
          </div>
        }
        <div className="flex-1">
          {/* Message List */}
          {messageList?.map((message, index) => {
            return (
              <div>
                <div
                  key={index}
                  className={`flex mb-2 ${message.role == "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg gap-2 ${
                      message.role == "user"
                        ? "bg-gray-200 text-black rounded-lg"
                        : "bg-gray-50 text-black"
                    }`}
                  >
                    <ReactMarkdown>
                    {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
                
                
                  {loading && messageList?.length-1 == index && (<div className="flex justiify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2">
                    <LoaderCircleIcon className="animate-spin" />Thinking...</div>
                  )}
                </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center gap-10">
        {/* Input Field */}
        <Input
          placeholder="Type here"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Button onClick={onSend} disabled={loading}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default AiChat;
