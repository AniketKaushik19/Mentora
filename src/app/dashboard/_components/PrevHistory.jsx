"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { aiToolsList } from "./AItools";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { MoveLeftIcon, SaveAllIcon } from "lucide-react";

function PrevHistory() {
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    GetHistory();
  }, []);

  const GetHistory = async () => {
    setLoading(true);
    const result = await axios.get("/api/history");
    setUserHistory(result.data);
    setLoading(false);
  };

  const GetAgentName = (path) => {
    return aiToolsList.find((item) => item.path === path);
  };

  // Conditionally slice history
  const filteredHistory =
    pathname !== "/my-history" ? userHistory.slice(0, 5) : userHistory;

    return (
      <div className={`mt-5 p-5 border rounded-xl w-full ${ pathname === "/my-history" && 'mx-5 md:mx-20'}`}>
      { pathname === "/my-history" && <Button variant={"primary"} onClick={()=>router.push('/')} className="mb-10"><MoveLeftIcon/> Back</Button>} 
      <h2 className="font-medium">Previous History</h2>
      <p className="text-gray-500 text-sm">
        What you previously worked on — find it here
      </p>

      {loading && (
        <div>
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <Skeleton key={index} className="mt-4 h-[50px] w-full rounded-md" />
          ))}
        </div>
      )}

      {!loading && filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-5">
          <Image src="/resume.png" alt="bulb" width={50} height={50} />
          <h2>You do not have any history</h2>
          <Button className="my-1" asChild>
            <Link href="/ai-tools">Explore AI Tools</Link>
          </Button>
        </div>
      ) : (
        <div>
          {filteredHistory.map((history, index) => (
            <Link
              key={index}
              href={`${history.aiAgentType}/${history.recordId}`}
            >
              <div className="flex justify-between items-center my-3 border p-3 rounded">
                <div className="flex gap-5">
                  <Image
                    src={
                      GetAgentName(history.aiAgentType)?.icon || "/cover.png"
                    }
                    alt="image"
                    width={20}
                    height={10}
                  />
                  <h2>
                    {history?.content?.roadmapTitle ||
                      history?.content[0]?.content}
                  </h2>
                </div>
                <h2>{GetAgentName(history.aiAgentType)?.name}</h2>
              </div>
              <h2 className="text-gray-500 text-xs">{history.createdAt}</h2>
            </Link>
          ))}
        </div>
      )}
       { pathname !== "/my-history" && <Button variant={"primary"} className="my-3 " onClick={()=>router.push('/my-history')}><SaveAllIcon/>Show All</Button>}
    </div>
  );
}

export default PrevHistory;
