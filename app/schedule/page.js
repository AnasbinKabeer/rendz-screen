'use client'
import CodeLetterPreview from "@/components/CodeLetterPreview";
import Header from "@/components/Header";
import ReportingSelector from "@/components/ReportingSelector";
import VoiceRecorder from "@/components/VoiceRecorder";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData]= useState()


 useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://rendezvous.abaqas.in/programs/action.php?status=ongoing&action=pagination"
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setData(result.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    console.log(data)




  return (
    <div className="w-full h-screen bg-gray-50 pt-5 flex justify-evenly">
      {/* Left side */}
      <ReportingSelector data={data}/>

      {/* Middle Section */}
      <div className="min-w-[800px] w-[850px] h-[95vh] rounded-lg flex flex-col items-center">
        <Header />

        {/* Preview screen */}
        <div className="w-[95%] h-[450px] bg-gray-600 rounded-lg flex flex-col items-center justify-center text-center text-lg">
          {/* <PreTimer /> */}
        </div>


        <div className="actions">{/* <TimerController /> */}</div>
      </div>

      {/* Right side */}
      <div className="w-[300px] h-[95vh]">
     
        <CodeLetterPreview />

  
      
          <VoiceRecorder/>
        
      </div>
    </div>
  );
}
