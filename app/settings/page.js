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
import SettingsPortal from "@/components/SettingsPortal";
import SettingsPreview from "@/components/SettingsPreview";
import SettingsNotification from "@/components/SettingsNotification";

export default function Page() {
  const [resultData, setResultData] = useState();
  const [error, setError] = useState(null);
    const {individualResult, setIndividualResult} = useProgrameContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://rendezvous.abaqas.in/campusprograms/action.php?status=judged&campusId=JM003&action=pagination&page=1&limit=500"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setResultData(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[100dvh] bg-gray-50 pt-5 flex justify-evenly">
      {/* Left side */}
      <SettingsPortal/>
      {/* Middle Section */}
      <div className="min-w-[800px] w-[850px] h-[95vh] rounded-lg flex flex-col items-center">
        <Header />

        {/* Preview screen */}
        <div className="w-[95%] h-screen  bg-gray-200  flex flex-col items-center justify-center text-center text-lg">
       <SettingsPreview/>
        </div>

       

      
      </div>

      {/* Right side */}
      <div className="flex flex-col  w-[300px] h-screen bg-white mr-2">
        <SettingsNotification/>
      </div>
    </div>
  );
}
