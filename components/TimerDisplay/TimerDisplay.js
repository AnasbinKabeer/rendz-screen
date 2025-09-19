import React from "react";

import OnlineTimer from "./OnlineTimer";
import OnlineController from "./OnlineController";


export default function TimerDisplay() {
  return (
    <main className="w-[800px]  rounded-lg h-[200px] mt-6 flex gap-4 text-blue-900">
      {/* Timer Card */}
      <div className="w-1/2 border rounded-lg  bg-white p-6 flex flex-col">
        {/* Title */}
        <div className="h-5 flex  items-center justify-center">
          <p className="text-sm text-gray-500">Timer</p>
        </div>

        {/* Timer Display */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <OnlineTimer />
          {/* <p className=" text-7xl">00:00</p>
          <p className="text-xs">~Timer is running~</p> */}
        </div>
      </div>

      {/* Timer Controller Card */}
      <div className="w-1/2 border rounded-lg  bg-white p-6 flex flex-col">
        {/* Title */}
        <div className="h-5 flex  items-center justify-center">
          <p className="text-sm text-gray-500">Timer Controller</p>
        </div>


        <OnlineController />

        <div className=" items-center justify-center flex gap-2">

          <p className="bg-purple-600 text-white py-1 text-sm px-3 rounded-lg">5 min</p>
          <p className="bg-amber-100 py-1 px-3 text-sm rounded-lg">8 min</p>
          <p className="bg-amber-100 py-1 px-3 text-sm rounded-lg">10 min</p>
          <p className="bg-amber-100 py-1 px-3 text-sm rounded-lg">12 min</p>

        </div>

      </div>
    </main>
  );
}
