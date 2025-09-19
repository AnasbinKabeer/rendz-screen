"use client";
import { useProgrameContext } from "@/context/programContext";
import React from "react";

export default function CodeLetterPreview() {
  const {
    codeData, setCodeData,
    participantsData,
    announcedCode, setAnnouncedCode
  } = useProgrameContext();

  // ✅ Custom sort same as ReportingSelector
  const sortParticipants = (list) => {
    return [...list].sort((a, b) => {
      const codeA = a.code.toUpperCase();
      const codeB = b.code.toUpperCase();
      if (codeA.length !== codeB.length) return codeA.length - codeB.length;
      return codeA.localeCompare(codeB);
    });
  };

  const handleAnnounce = () => {
    if (!codeData?.id) return;

    // Add current to announced
    setAnnouncedCode((prev) => [...prev, codeData.id]);

    // Filter remaining participants
    const remainingResults = sortParticipants(
      participantsData.filter(
        (p) => ![...announcedCode, codeData.id].includes(p.id) && p.code
      )
    );

    if (remainingResults.length > 0) {
      setCodeData(remainingResults[0]);
    } else {
      setCodeData(null);
    }
  };

 const sendCODE = (code) => {
     let payload;

     if (code === null) {
         payload = { code: "" };
     } else {
         payload = { code: codeData?.code || "" };
     }

     console.log("Sending code: ", payload);
     window.electron.send('update-data', payload);
 };


    

  return (
    <div className="w-[300px] min-h-[340px]  bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-5">
      <div className="text-center">
        <p className="text-sm text-gray-500">Code Letter</p>
        <p className="text-[120px] font-semibold text-blue-700 leading-tight">
          {codeData?.code || "~"}
        </p>
        <p className="text-gray-800">{codeData?.student || "No Student"}</p>
      </div>

      {/* Start button */}
      <button
        className="w-full mt-3 py-3 px-6 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition"
        onClick={() => sendCODE(codeData)}
      >
        Start Program
      </button>

      {/* Complete button */}
      <button
        className="w-full mt-3 py-3 px-6 text-sm rounded-lg font-medium bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition"
        onClick={() => {
          handleAnnounce();
          sendCODE(null);
        }}
        disabled={!codeData}
      >
        Complete
      </button>
    </div>
  );
}
