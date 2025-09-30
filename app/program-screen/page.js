"use client";
import CodeLetterPreview from "@/components/CodeLetterPreview";
import Header from "@/components/Header";
import ReportingSelector from "@/components/ReportingSelector";
import VoiceRecorder from "@/components/VoiceRecorder";
import TimerDisplay from "@/components/TimerDisplay/TimerDisplay";
import { useState, useEffect } from "react";
import Image from "next/image";
import CameraPreview from "@/components/CameraPreview";

export default function ProgramScreen() {

  


  return (
    <div className="w-full h-[100dvh] bg-gray-50 pt-5 flex justify-evenly">

      {/* Left side */}
      <ReportingSelector />

      {/* Middle Section */}
      <div className="min-w-[800px] w-[850px] h-[95vh] rounded-lg flex flex-col items-center justify-center">
        <Header />

        {/* Preview screen */}
        <div className="w-[95%] min-h-[450px]  border-8 border-black bg-gray-200 rounded-3xl flex flex-col items-center justify-center text-center text-lg">
          {/* <CameraPreview/> */}
          <Image
            src="/Primary_Logo.png"
            alt="Example Image"
            width={500}
            height={300}
          />
        </div>

        <div className=" mt-2  flex gap-3">
          <div className="relative group">
            <div className=" w-2 h-2 cursor-pointer rounded-full bg-gray-500"> </div>
              <span className="tooltip absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
                Preview
              </span>
           


          </div>
          <div className="relative group">
            <div className=" w-2 h-2 cursor-pointer rounded-full bg-violet-500"> </div>
              <span className="tooltip absolute bottom-[-30px]  left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
                 Preview
              </span>
           


          </div>
          <div className="relative group">
            <div className=" w-2 h-2 cursor-pointer rounded-full bg-gray-500"> </div>
              <span className="tooltip absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
                Audio
              </span>
           


          </div>
    
        </div>

        <div className="mt-auto mb-2">
          <TimerDisplay />
        </div>
      </div>


      {/* Right side */}
      <div className="w-[300px] h-[95vh] mr-2 flex flex-col">
        <CodeLetterPreview />
        <VoiceRecorder />
      </div>
    </div>
  );
}
