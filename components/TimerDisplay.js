import React from "react";
import { BellRing, Play, TimerReset } from "lucide-react";
import { FaPlay } from "react-icons/fa";


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
          <p className=" text-7xl">00:00</p>
          <p className="text-xs">~Timer is running~</p>
        </div>
      </div>

      {/* Timer Controller Card */}
      <div className="w-1/2 border rounded-lg  bg-white p-6 flex flex-col">
        {/* Title */}
        <div className="h-5 flex  items-center justify-center">
          <p className="text-sm text-gray-500">Timer Controller</p>
        </div>

        {/* Button */}
        <style jsx>{`
          .tooltip {
            transition: opacity 0.3s ease;
          }
          .group:hover .tooltip {
            opacity: 1;
            transition-delay: 1s; /* show after 1 second */
          }
          .tooltip {
            opacity: 0;
            transition-delay: 0s; /* hide instantly */
          }
        `}</style>

        <div className="flex flex-1 gap-5 items-center justify-center">
          {/* Bell Button */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-4 cursor-pointer bg-gray-700 hover:bg-gray-800 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105">
              <BellRing className="w-3 h-3" />
            </button>
            <span className="tooltip absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
              Alarm
            </span>
          </div>

          {/* Play Button */}
          <div className="relative group">
            <button className="flex items-center justify-center p-4 cursor-pointer bg-blue-700 hover:bg-blue-800 text-white  font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105">
              <Play className="w-6 h-6" />
            </button>
            <span className="tooltip absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
              Start
            </span>
          </div>

          {/* Reset Button */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-4 cursor-pointer bg-gray-700 hover:bg-gray-800 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105">
              <TimerReset className="w-4 h-4" />
            </button>
            <span className="tooltip absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
              Reset
            </span>
          </div>
        </div>
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
