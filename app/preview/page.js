"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ref, onValue } from "firebase/database";
import { db } from "../../firerbase/firebase";
import { useProgrameContext } from "@/context/programContext";

export default function Page() {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState("stop");
  const [showcode, setShowcode] = useState(true);

  // REFS
  const codeRef = useRef(null);
  const popupRef = useRef(null); // popup container
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

  // Firebase listeners
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

  // GSAP popup animation for CODE
  useEffect(() => {
    if (!data?.code) return;

    setShowcode(true);

    const tl = gsap.timeline({
      onComplete: () => setShowcode(false),
    });

    // Enter: slide from left with bounce
    tl.fromTo(
      popupRef.current,
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1.2, ease: "bounce.out" }
    )
      // Hold in center for 5s
      .to(popupRef.current, { x: "0%", duration: 5 })
      // Exit: slide out right
      .to(popupRef.current, {
        x: "100%",
        opacity: 0,
        duration: 1,
        ease: "power4.inOut",
      });

    return () => tl.kill();
  }, [data]);

  // Card subtle animations
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
      yoyo: true,
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

  // Title + category animation
  useEffect(() => {
    if (!data?.title) return;

    const tl = gsap.timeline();
    gsap.set([titleRef.current, categoryRef.current], { autoAlpha: 0, y: 50 });

    tl.fromTo(
      orderRef.current,
      { autoAlpha: 0, scale: 0.5, y: 50 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.7)" }
    )
      .to(orderRef.current, {
        autoAlpha: 0,
        scale: 0.8,
        y: -50,
        duration: 0.8,
        delay: 1,
        ease: "power2.inOut",
      })
      .to(titleRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(
        categoryRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6"
      );

    return () => tl.kill();
  }, [data]);

  // Student result animation
  useEffect(() => {
    if (!data?.result) return;

    gsap.killTweensOf(lettersRef.current);
    gsap.killTweensOf(campusNameRef.current);

    gsap.set(lettersRef.current, { y: 40, scale: 0.5, opacity: 0 });

    gsap.to(lettersRef.current, {
      y: 0,
      scale: 1,
      opacity: 1,
      stagger: 0.08,
      duration: 0.8,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(lettersRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
          stagger: 0.05,
        });
      },
    });

    if (campusNameRef.current) {
      gsap.fromTo(
        campusNameRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 1.2,
          ease: "power2.out",
        }
      );
    }
  }, [data?.result]);

  // Helpers
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

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-green-600">
      {/* ==================== CODE POPUP ==================== */}
      {data?.code && showcode && (
        <div
          ref={popupRef}
          className="absolute inset-0 flex items-center justify-center"
        >
         <div className="relative z-10 flex items-center justify-center w-full h-full 
                bg-gradient-to-br from-black via-gray-900 to-black shadow-2xl">
  <h1
    ref={codeRef}
    className="text-[140px] sm:text-[200px] md:text-[260px] font-extrabold text-white tracking-tight"
  >
    {data?.code}
  </h1>
</div>

        </div>
      )}

      {/* ==================== INFO CARD ==================== */}
      {data?.code && (
        <div
          ref={cardRef}
          className="absolute bottom-4 w-[92%] max-w-6xl px-8 translate-y-52"
        >
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
                  {data.selectedProgram.split("|")[0].trim()}
                </p>
                <p className="text-xl sm:text-2xl font-medium text-gray-500">
                  {data.selectedProgram.split("|")[1]?.trim()}
                </p>
              </div>
            </div>
            <span
              ref={timerRef}
              className="mt-6 sm:mt-0 text-violet-600 font-extrabold text-5xl sm:text-6xl"
            >
              {formatTime(time)}
            </span>
          </div>
        </div>
      )}

      {/* ==================== RESULT ==================== */}
      {data?.result && (
        <div
          ref={windowRef}
          className="w-full h-screen relative overflow-hidden text-white px-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-blue-900 to-red-800 animate-gradient" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="w-full flex justify-between mt-6">
              <div className="flex items-center gap-6 text-gray-200">
                <p className="px-5 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold text-lg rounded-xl shadow-md">
                  Result {data.programName.order}
                </p>
                <p className="capitalize tracking-wide text-lg sm:text-xl text-gray-300">
                  {data.programName.name} ({data.programName.category})
                </p>
              </div>
              <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 text-[80px] drop-shadow-sm">
                #{data.result.rank}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center mt-12">
              <div className="text-[15vh] leading-[160px] text-center tracking-wide text-gray-100 drop-shadow-md font-black font-bebas">
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
              <div
                ref={campusNameRef}
                className="text-[3vw] opacity-0 mt-6 uppercase tracking-widest text-gray-400 font-medium"
              >
                {data.result.campus}
              </div>
            </div>

            <div className="w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full shadow-md mt-10" />
          </div>
        </div>
      )}

      {/* ==================== TITLE ==================== */}
      {data?.title && (
        <div className="w-full h-screen flex items-center justify-center p-8 bg-gradient-to-b from-black via-gray-900 to-black">
          <div
            ref={containerRef}
            className="h-full flex flex-col justify-center items-center rounded-2xl text-center space-y-10"
          >
            <h1
              ref={orderRef}
              className="text-8xl sm:text-9xl font-extrabold text-amber-100"
            >
              Result {data?.title.order}
            </h1>
            <h2
              ref={titleRef}
              className="text-[12vw] sm:text-[150px] font-extrabold text-white tracking-wide leading-tight drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]"
            >
              {data?.title.name}
            </h2>
            <h3
              ref={categoryRef}
              className="text-[8vw] sm:text-[100px] capitalize font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-500 drop-shadow-[0_0_20px_rgba(140,100,255,0.5)]"
            >
              {data?.title.category}
            </h3>
            <div className="w-3/4 h-2 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 rounded-full shadow-[0_0_25px_rgba(255,120,200,0.7)] mt-10"></div>
          </div>
        </div>
      )}
    </div>
  );
}
