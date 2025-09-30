"use client";
import { useProgrameContext } from "@/context/programContext";
import React from "react";
import { FaPlay } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import PlayAudio from "./PlayRecorder";
import { time } from "framer-motion";

export default function ResultRender({ data }) {
  const {
    selectedResult,
    setIndividualResult,
    programName,
    setProgramName,
    setProgramId,
    announcedIds,
    setAnnouncedIds,
    individualResult
  } = useProgrameContext();



  const countdown = 0
  const showGo = false

  const newDataFiltered = selectedResult
    ?.filter((item) => ["1", "2", "3"].includes(item.rank))
    .sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

  const handleAnnounce = () => {
    if (!programName.order) return;

    const updatedAnnouncedIds = [...announcedIds, programName.order];
    setAnnouncedIds(updatedAnnouncedIds);

    const remainingResults = data
      ?.filter((item) => !updatedAnnouncedIds.includes(item.order))
      ?.sort((a, b) => a.order - b.order);

    if (!remainingResults || remainingResults.length === 0) {
      setProgramName({});
      return;
    }

    const nextResult = remainingResults[0];
    setProgramName(nextResult);
    setProgramId(nextResult.id);
  };






  const sendCODE = (each) => {
    let payload;

    if (each === null) {
      payload = { result: "" };
    }  else {
      payload = {
        result: each || "",
        programName // add as a property
      };
    }

    console.log("Sending code: ", payload);
    window.electron.send("update-data", payload);
  };




  const sendPG = (each) => {
  let payload;

  if (each === null) {
    payload = { title: "" };
  } else {
    payload = { 
      title: programName || "", 
       // add as a property
    };
  }
 console.log("Sending code: ", payload);
    window.electron.send("update-data", payload);

}
  console.log("programName", programName)



  return (
    <div className="w-[300px]  flex flex-col gap-4">
      <div className="bg-white min-h-100 text-gray-800 w-full rounded-lg border border-zinc-200 p-4 flex flex-col gap-4">
        <p className="text-center text-zinc-500 text-sm font-medium">Announcement</p>

        <div className="text-center">
          <p className="text-md text-zinc-600 font-medium">Result {programName.order}</p>
          <h3 className="font-light uppercase text-blue-600 text-sm">
            {programName.name} ({programName.category})
          </h3>
        </div>

        <button
          onClick={() => {
            sendPG();
          }}

          className="btn btn-primary w-full cursor-pointer">Show Title</button>

        <div className="flex gap-2">
          <PlayAudio />

          <div className="flex flex-1 flex-col gap-2">
            {newDataFiltered?.map((item) => (
              <button
                key={item.id || item.rank}
                onClick={() => {
                  setIndividualResult(item),
                  sendCODE(item)
                }

                }
                className="btn btn-secondary flex h-10 cursor-pointer items-center gap-2 text-sm w-full"
              >
                {item.rank === "1" ? "First" : item.rank === "2" ? "Second" : "Third"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <button
            className="btn flex items-center bg-yellow-200 justify-center gap-2 w-full"
            onClick={() => { setIndividualResult(null); handleAnnounce(); sendCODE(null) }}
          >
            <HiSpeakerphone /> Announce
          </button>
          <button className="btn border bg-gray-50 w-full mt-2">Auto Announce</button>
        </div>
      </div>
      <div className="w-[300px] h-[300px] flex justify-center items-center mb-10">
        <div className="relative flex items-center justify-center w-50 h-50 bg-white rounded-full shadow-inner drop-shadow-lg">

          {/* Outer animated ring */}
          <div className="absolute inset-0 rounded-full border-1  text-zinc-400 "></div>

          {/* Countdown number */}
          <p className="text-7xl font-extrabold text-violet-600 z-10 drop-shadow-lg">
            {countdown !== null ? `${countdown}s` : showGo ? "Go" : "8s"}
          </p>

          {/* Small bouncing effect when "Go" appears */}
          {showGo && (
            <div className="absolute z-20">
              <p className="text-5xl font-bold text-green-500 animate-bounce drop-shadow-md">
                Go
              </p>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
