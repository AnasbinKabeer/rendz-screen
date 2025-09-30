import React from "react";

import OnlineTimer from "./OnlineTimer";
import OnlineController from "./OnlineController";


export default function TimerDisplay() {
  return (
    <main className="w-[800px]  rounded-lg h-[200px] mt-6 flex gap-4 text-blue-900">
      
      <div className="w-1/2 border rounded-lg  bg-white p-6 flex flex-col">
        <div className="h-5 flex  items-center justify-center">
          <p className="text-sm text-gray-500">Timer</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-evenly">
          <OnlineTimer />
        </div>
      </div>

      <div className="w-1/2 border rounded-lg  bg-white p-6 flex flex-col">
        <div className="h-5 flex  items-center justify-center">
          <p className="text-sm text-gray-500">Timer Controller</p>
        </div>
        <OnlineController />
      </div>

    </main>
  );
}
