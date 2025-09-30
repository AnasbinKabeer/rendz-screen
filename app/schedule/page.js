'use client'
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import ResultPortal from "@/components/ResultPortal";
import ResultRender from "@/components/ResultRender";
import Image from "next/image";
import TeamResult from "@/components/TeamResult";
import { useProgrameContext } from "@/context/programContext";
import StagePortal from "@/components/StagePortal";
import ScheduleList from "@/components/ScheduleList";

export default function Page() {
  const [resultData, setResultData] = useState();
  const [error, setError] = useState(null);
    const {individualResult, setIndividualResult} = useProgrameContext()

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://rendezvous.abaqas.in/campusprograms/action.php?status=judged&campusId=JM003&action=pagination&page=1&limit=500"
  //       );
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const result = await response.json();
  //       setResultData(result.data);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="w-full h-[100dvh] bg-gray-50 pt-5 flex justify-evenly">
      {/* Left side */}
      <StagePortal />
      {/* Middle Section */}
      <div className="min-w-[800px] w-[850px] h-[95vh] rounded-lg flex flex-col items-center">
        <Header />

        {/* Preview screen */}
        <div className="w-[95%] h-[450px] border-8 border-black bg-gray-200 rounded-3xl flex flex-col items-center justify-center text-center text-lg">
           {/* {individualResult ?
           <div>
            <p className="text-4xl font-bold">{individualResult.student}</p>
            <p className="text-4xl font-bold">{individualResult.campus}</p>
           </div> : */}
            {/* <Image
               src="/Primary_Logo.png"
               alt="Example Image"
               width={500}
               height={300}
             />} */}
        </div>

        <div className="mt-2  flex gap-2">
          <div className="w-2 h-2 cursor-pointer rounded-full bg-gray-500"></div>
          <div className="w-2 h-2 cursor-pointer rounded-full bg-gray-500"></div>
          <div className="w-2 h-2 cursor-pointer rounded-full bg-gray-500"></div>
        </div>

        <div className="mt-auto mb-2">
            <ScheduleList/> 
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col  w-[300px] h-[95vh] mr-2">
        <ResultRender />
      </div>
    </div>
  );
}
