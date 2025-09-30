"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ref, onValue } from "firebase/database";
import { db } from "../../firerbase/firebase";

export default function Page() {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState("stop");
  const [showcode, setshowcode] = useState(true);

  const codeRef = useRef(null);
  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const circleRef = useRef(null);

  const containerRef = useRef(null);
  const orderRef = useRef(null);
  const titleRef = useRef(null);
  const categoryRef = useRef(null);

  const lettersRef = useRef([]);
  const campusNameRef = useRef(null);
  const windowRef = useRef(null);


  // Electron listener
  useEffect(() => {
    if (window.electron) {
      window.electron.on("data-updated", (incoming) => {
        console.log("Preview received:", incoming);
        setData(incoming);
      });
    }
  }, []);

  // Format mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Listen firebase values
  useEffect(() => {
    const statusRef = ref(db, "timer/status");
    const timeRef = ref(db, "timer/time");

    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) setStatus(snapshot.val());
    });

    const unsubscribeTime = onValue(timeRef, (snapshot) => {
      if (snapshot.exists()) setTime(snapshot.val());
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTime();
    };
  }, []);

  // Handle timer locally
  useEffect(() => {
    let interval;
    if (status === "start") {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (status === "pause" || status === "stop") {
      clearInterval(interval);
    } else if (status === "reset") {
      clearInterval(interval);
      setTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  // GSAP animations
  useEffect(() => {
    if (!data?.code) return;

    gsap.fromTo(
      codeRef.current,
      { scale: 0.5, y: -100 },
      { scale: 1, y: 0, duration: 1, ease: "power4.out" }
    );

    gsap.to(cardRef.current, {
      y: -20,
      duration: 2,
      yoyo: false,
      repeat: -1,
      repeatDelay: 10,
      ease: "power1.inOut",
      delay: 10,
    });

    gsap.to(circleRef.current, {
      scale: 1.2,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: "power2.inOut",
    });
  }, [data]);

  // Show code first for 5s, then card
  useEffect(() => {
    if (!data?.code) return;
    setshowcode(true);
    const timeout = setTimeout(() => {
      setshowcode(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [data]);

  useEffect(() => {
    if (data?.title) {
      const tl = gsap.timeline();

      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      )
        .from(orderRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "bounce.out",
        })
        .from(titleRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(categoryRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });
    }
  }, [data]);

  useEffect(() => {
    if (!data?.result) return;

    // Kill any old tweens before starting new ones
    gsap.killTweensOf(lettersRef.current);
    gsap.killTweensOf(campusNameRef.current);

    // Reset letters to initial state
    gsap.set(lettersRef.current, { y: 20, opacity: 0, scale: 0.8 });

    // Animate letters
    gsap.to(lettersRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.05,
      duration: 0.8,
      ease: "power2.out",
    });

    // Animate campus name
    if (campusNameRef.current) {
      gsap.fromTo(
        campusNameRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 1.5,
          ease: "power2.out",
        }
      );
    }
  }, [data?.result]);

  const splitAndCapitalize = (text) => {
    if (!text) return [];
    return text
      .split(" ")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ")
      .split("");
  };

  console.log("electron-data", data)

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-green-600">
      {/* Only render if we have a code */}



      {data?.code && (
        <>
          {/* Big Code Display */}
          {showcode && (
            <div className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-400 to-yellow-500 p-[6px] animate-spin-slow">
                <div className="w-full h-full rounded-full bg-gray-900"></div>
              </div>
              <div className="absolute inset-10 rounded-full border-[6px] border-dashed border-yellow-300/50 animate-spin-slower"></div>
              <div className="absolute inset-14 rounded-full border-[4px] border-dashed border-orange-400/40 animate-spin-reverse"></div>
              <div className="absolute inset-8 rounded-full bg-yellow-400/30 blur-3xl animate-pulse"></div>
              <div className="absolute inset-12 rounded-full bg-orange-500/20 blur-2xl animate-ping"></div>

              <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-yellow-400 shadow-2xl">
                <h1
                  ref={codeRef}
                  className="text-[140px] sm:text-[200px] md:text-[260px] font-extrabold text-white tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                >
                  {data?.code}
                </h1>
              </div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-30 animate-shimmer"></div>
            </div>
          )}

          {/* Bottom Info Card */}
          <div ref={cardRef} className="absolute bottom-4 w-[92%] max-w-6xl px-8 translate-y-52">
            <div className="w-full bg-white rounded-3xl shadow-2xl p-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col sm:flex-row items-center gap-6 px-8">
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
                {formatTime(time)}
              </span>
            </div>
          </div>
        </>
      )}



      {data?.result && (
        <>

          <div className="w-full h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 flex items-center justify-center">
            {data?.result && (
              <div
                ref={windowRef}
                className="w-full h-screen relative overflow-hidden text-white px-10"
              >
                {/* Background Accent */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20 blur-sm" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Header */}
                  <div className="w-full flex justify-between mt-6">
                    <div className="flex items-center gap-8 text-amber-300">
                      <p className=" px-5 h-14 bg-gradient-to-r from-violet-500 to-red-400 text-gray-100 flex items-center justify-center font-bold text-2xl rounded-2xl shadow-lg">
                        Result {data.programName.order}
                      </p>
                      <p className="capitalize tracking-wide text-xl sm:text-2xl">
                        {data.programName.name} ({data.programName.category})
                      </p>
                    </div>
                    <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 text-[100px] drop-shadow-md">
                      #{data.result.rank}
                    </p>
                  </div>

                  {/* Main Student Name */}
                  {/* Main Student Name */}
                  <div className="flex flex-col items-center justify-center text-center mt-12">
                    <div className="text-[10vw] leading-[120px] text-center font-[MLU-Jwala] break-words whitespace-normal">
                      {splitAndCapitalize(data.result.student).map((char, index) => (
                        <span
                          key={index}
                          ref={(el) => (lettersRef.current[index] = el)}
                          className="inline"
                        >
                          {char}
                        </span>
                      ))}
                    </div>


                    {/* Campus Name */}
                    <div
                      ref={campusNameRef}
                      className="text-[3vw] opacity-0 mt-6 uppercase tracking-widest text-amber-100 font-semibold drop-shadow-md"
                    >
                      {data.result.campus}
                    </div>
                  </div>

                  {/* Footer bar */}
                  <div className="w-full h-2 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 rounded-full shadow-lg mt-12" />
                </div>
              </div>
            )}
          </div>

        </>
      )}


 {data?.title && (
        <div className="w-full h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 flex items-center justify-center p-8 ">
          <div
            ref={containerRef}
            className="w-7xl h-full flex flex-col justify-center items-center  bg-gradient-to-br from-blue-900 via-gray-900 to-black rounded-2xl shadow-2xl p-12 text-center"
          >
            {/* Order */}
            <h1
              ref={orderRef}
              className="text-8xl font-extrabold text-blue-400 drop-shadow-lg mb-6"
            >
              {data?.title.order}
            </h1>

            {/* Title */}
            <h2
              ref={titleRef}
              className="text-4xl font-bold text-white tracking-wide mb-4"
            >
              {data?.title.name}
            </h2>

            {/* Category */}
            <h3
              ref={categoryRef}
              className="text-2xl text-blue-300 font-medium italic"
            >
              {data?.title.category}
            </h3>
          </div>
        </div>
      )}




    </div>

  );
}
