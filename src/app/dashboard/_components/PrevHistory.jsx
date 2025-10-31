"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { aiToolsList } from "./AItools";

function PrevHistory() {
  const [userHistory, setUserHistory] = useState([]);
  const [loading,setLoading]=useState(false)

useEffect(() => {
  GetHistory();
}, [])


  const GetHistory = async () => {
    setLoading(true)
    const result = await axios.get("/api/history");
    setUserHistory(result.data)
    setLoading(false)
  };
  const GetAgentName = (path) => {
    const agent = aiToolsList.find((item) => item.path == path);
    return agent;
  };
  return (
    <div className="mt-5 p-5 border rounded-xl w-full ">
      <h2 className="font-medium">Previous History</h2>
      <p className="text-gray-500 text-sm">
        {" "}
        What your previously work on , You can find here
      </p>
{
  loading && 
  <div>
    {[1,2,3,4,5].map((item,index)=>(
      <div key={index}>
        <Skeleton className="mt-4 h-[50px] w-full rounded-md"/>
      </div>
    ))}
  </div>
}

      
      {userHistory?.length == 0 && !loading ? (
        <div className="flex flex-col items-center justify-center mt-5 ">
          <Image src={"/resume.png"} alt="bulb" width={50} height={50} />
          <h2>You do not have any history</h2>
          <Button className="my-1">Explore AI Tools</Button>
        </div>
      ) : (
        <div>
          {userHistory?.map((history, index) => (
            <Link href={history?.aiAgentType+"/"+history?.recordId}>
              <div key={index} className="flex justify-between items-center my-3 border p-3 rounded">
                <div className="flex gap-5">
                 <Image
                  src={GetAgentName(history?.aiAgentType)?.icon}
                  alt={"image"}
                  width={20}
                  height={10}
                  />
                  <h2>
                    {history?.content?.roadmapTitle
                     ||
                   history?.content[0]?.content} </h2>
                  </div>
                <h2>{GetAgentName(history?.aiAgentType)?.name}</h2>
              </div>
              {console.log(history)}
              <h2 className="text-gray-500 text-xs">{history.createdAt}</h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PrevHistory;
