"use client"

import HeroSection from "./_components/HeroSection";
import MouseAnimation from "./_components/MouseAnimation";
import Features from "./_components/Features";
import HowItWork from "./_components/HowItWork";
import SocialStat from "./_components/SocialStat";
import ReadyToCreate from "./_components/ReadyToCreate";

export default function Home() {
  return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
         {/* //mouse animation  */}
          <MouseAnimation/>

         {/* //HeroSection */}
          <HeroSection/>

         {/* //features  */}
         <Features/>
         
         {/* //how it work  */}
         <HowItWork/>

          {/* //stat info  */}
         <SocialStat/>
       
         <ReadyToCreate/>
   </div>
  );
}
