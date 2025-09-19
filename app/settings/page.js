import React from 'react'
import CodeLetterPreview from "@/components/CodeLetterPreview";
import Header from "@/components/Header";
import ReportingSelector from "@/components/ReportingSelector";
import ResultPortal from '@/components/ResultPortal';
import ResultRender from '@/components/ResultRender';

export default function page() {
   return (
      <div className="w-full h-screen bg-gray-50 pt-5 flex justify-evenly">
        {/* Left side */}
        <ResultPortal/>
  
        {/* Middle Section */}
        <div className="min-w-[800px] w-[850px] h-[95vh] rounded-lg flex flex-col items-center">
          <Header />
  
          {/* Preview screen */}
          <div className="w-[95%] h-[450px] bg-gray-700 rounded-lg flex flex-col items-center justify-center text-center text-lg">
            {/* <PreTimer /> */}
          </div>
  
  
          <div className="actions">{/* <TimerController /> */}</div>
        </div>
  
        {/* Right side */}
        <div className="w-[300px] h-[95vh]">
       
          <ResultRender/>
  
    
         
        </div>
      </div>
    );
}
