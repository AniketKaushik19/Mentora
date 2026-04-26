
// import WelcomeBanner from "./dashboard/_components/WelcomeBanner";
// import AItools from "./dashboard/_components/AItools";
// import PrevHistory from "./dashboard/_components/PrevHistory";

// export default function Home() {
//   return (
//     <div className="my-20 px-10 py-3">
//        <WelcomeBanner/>
//        <AItools/>
//        <PrevHistory/>

//     </div>
//   );
// }
"use client"

import HeroSection from "./community/_components/HeroSection";
import MouseAnimation from "./community/_components/MouseAnimation";
import Features from "./community/_components/Features";
import HowItWork from "./community/_components/HowItWork";
import SocialStat from "./community/_components/SocialStat";
import ReadyToCreate from "./community/_components/ReadyToCreate";

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
