import { Button } from "@/components/ui/button";
import Image from "next/image";
import WelcomeBanner from "./dashboard/_components/WelcomeBanner";
import AItools from "./dashboard/_components/AItools";
import PrevHistory from "./dashboard/_components/PrevHistory";
export default function Home() {
  return (
    <div className="mx-1 md:px-20 my-32">
    <WelcomeBanner/>
    <AItools/>
    <PrevHistory/>
    </div>
  );
}
