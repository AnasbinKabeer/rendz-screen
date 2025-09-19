'use client'
import { useProgrameContext } from "@/context/programContext";
import React, { useContext, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";



export default function ResultRender() {
  const { selectedResult, setSelectedResult, individualResult, setIndividualResult } = useProgrameContext()


  const newDataFiltered = selectedResult
    ?.filter(item => ["1", "2", "3"].includes(item.rank))  // Filter ranks 1, 2, and 3
    .sort((a, b) => parseInt(a.rank) - parseInt(b.rank));  // Sort by rank in ascending order

  console.log("individualResult", individualResult)
  return (
    <div className="w-[300px]  flex flex-col gap-4">
      {/* Result Container */}
      <div className="bg-white text-gray-800 w-full rounded-lg shadow-md p-4 flex flex-col gap-4">

        {/* Header */}
        <div className="text-center">
          <p className="text-lg font-medium">Result 1</p>
          <h3 className="font-normal text-base mt-1">
            Madh Song (Senior)
          </h3>
        </div>

        {/* Start Button */}
        <button className="btn btn-primary w-full">Show Title</button>

        {/* Winners / Positions */}
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 items-center ">

            <div className="w-9 h-10 bg-blue-100 p-1 cursor-pointer text-blue-800 rounded flex items-center justify-center">
              <FaPlay />            </div>
            <div className="w-9 h-10 bg-blue-100 p-1 cursor-pointer text-blue-800 rounded flex items-center justify-center">
              <FaPlay />            </div>
            <div className="w-9 h-10 bg-blue-100 p-1 cursor-pointer text-blue-800 rounded flex items-center justify-center">
              <FaPlay />            </div>

          </div>
          <div className="flex flex-1  flex-col gap-2">
            {newDataFiltered?.map((item, index) => (
              <button
                key={index}
                onClick={() => { setIndividualResult(item) 
                  // sendData({ item, program }) 
                }}
                className="btn btn-secondary flex h-10  items-center gap-2 text-sm w-full"
              >
                {item.rank === "1" ? "First" : item.rank === "2" ? "Second" : item.rank === "3" ? "Third" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Announce Button */}
        <div>
          <button className="btn flex items-center bg-yellow-200  justify-center gap-2  w-full"
          onClick={()=> setIndividualResult(null)}
          > <HiSpeakerphone />
            Announce</button>
          <button className="btn border bg-gray-50 w-full mt-2">Auto Announce</button>
        </div>

      </div>

      {/* Optional Voice Controller */}
      {/*
      <div className="bg-gray-100 rounded-lg shadow-md p-4 flex flex-col gap-2">
        <p>Voice Samples</p>
        <div>
          <PlayAudio />
        </div>
      </div>
      */}
    </div>
  );
}
