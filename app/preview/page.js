"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Page() {
  const [data, setData] = useState(null);

  const codeRef = useRef(null);
  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.on("data-updated", (incoming) => {
        console.log("Preview received:", incoming);
        setData(incoming);
      });
    }
  }, []);
  

  // Animate on mount
  useEffect(() => {
    gsap.fromTo(
      codeRef.current,
      { scale: 0.5, opacity: 0, y: -100 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power4.out" }
    );

    gsap.fromTo(
      cardRef.current,
      { y: 150, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.5, ease: "back.out(1.7)" }
    );

    gsap.to(timerRef.current, {
      duration: 1.5,
      ease: "power1.inOut",
    });

    // Circle around "A"
    gsap.to(circleRef.current, {
      scale: 1.2,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: "power2.inOut",
    });
  }, [data]);



  console.log("data", data)

  return (
    <div
      className={`relative w-full h-screen flex flex-col justify-center items-center overflow-hidden ${data?.code ? "bg-black" : "bg-green-600"
        }`}
    >
      {/* Big Code Display */}
     <div className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
    
    {/* Gradient rotating border */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-400 to-yellow-500 p-[6px] animate-spin-slow">
      <div className="w-full h-full rounded-full bg-gray-900"></div>
    </div>

    {/* Illusion glowing rings */}
    <div className="absolute inset-10 rounded-full border-[6px] border-dashed border-yellow-300/50 animate-spin-slower"></div>
    <div className="absolute inset-14 rounded-full border-[4px] border-dashed border-orange-400/40 animate-spin-reverse"></div>

    {/* Wavy glow layers */}
    <div className="absolute inset-8 rounded-full bg-yellow-400/30 blur-3xl animate-pulse"></div>
    <div className="absolute inset-12 rounded-full bg-orange-500/20 blur-2xl animate-ping"></div>
    
    {/* Main Circle */}
    <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-yellow-400 shadow-2xl">
      <h1 className="text-[140px] sm:text-[200px] md:text-[260px] font-extrabold text-white tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
        
        {data?.code}
      </h1>
    </div>

    {/* Shimmer shine overlay */}
    <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-30 animate-shimmer"></div>
  
  </div>

      {/* Bottom Info Card */}
      <div ref={cardRef} className="absolute bottom-8 w-[92%] max-w-6xl px-8">
        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 flex flex-col sm:flex-row items-center justify-between">
          {/* Left Side */}
          <div className="flex flex-col sm:flex-row items-center gap-6 px-8">
            {/* Circle Badge for A */}
            <div
              ref={circleRef}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg"
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
                {data?.code}
              </h1>
            </div>
        <div className="flex flex-col leading-tight">
    <p className="text-3xl sm:text-4xl font-semibold text-gray-800">
      Madh Song
    </p>
    <p className="text-xl sm:text-2xl font-medium text-gray-500">
      Senior
    </p>
  </div>
          </div>

          {/* Timer */}
          <span
            ref={timerRef}
            className="mt-6 sm:mt-0 text-violet-600 font-extrabold text-5xl sm:text-6xl"
          >
00:00
        </span>
        </div>
      </div>
    </div>
  );
}
