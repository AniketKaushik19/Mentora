import { Button } from "@/components/ui/button";
import Image from "next/image";
import WelcomeBanner from "./dashboard/_components/WelcomeBanner";

export default function Home() {
  return (
    <div className="px-20 my-20">
     <WelcomeBanner/>
    </div>
  );
}
