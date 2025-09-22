 

 'use client'
 import { useProgrameContext } from "@/context/programContext";
 import React, { useContext, useState } from "react";
 import { FaPlay } from "react-icons/fa";
 import { HiSpeakerphone } from "react-icons/hi";
 
 
 
 
 export default function SettingsNotification({data}) {
 
   return (
     <div className="w-[300px] h-screen  flex flex-col gap-4">
       {/* Result Container */}
       <div className="bg-white text-gray-800 w-full rounded-lg border border-zinc-200  p-4 flex flex-col gap-4">
           <p className="text-center text-zinc-500 text-sm font-medium">Annoucement</p>
 
         {/* Header */}
         <div className="text-center">
         
         </div>
 
         {/* Start Button */}
         <button className="btn btn-primary w-full cursor-pointer">Show Title</button>
 
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
            
           </div>
         </div>
 
         {/* Announce Button */}
         <div>
           
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
 