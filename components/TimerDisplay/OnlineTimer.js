'use client'
import { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firerbase/firebase";
import { TimerData } from "./timer-data";
import { useProgrameContext } from "@/context/programContext";

const OnlineTimer = () => {
  const [status, setStatus] = useState("stop");
  const [isRunning, setIsRunning] = useState(false);
const {time, setTime, timeId, setTimeId} = useProgrameContext()

  const autoWarningBellRef = useRef(null);
  const autoLastBellRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      autoWarningBellRef.current = new Audio("/audio/oldwarning.mp3");
      autoLastBellRef.current = new Audio("/audio/last.mp3");
    }
  }, []);

  useEffect(() => {
    const statusRef = ref(db, "timer/status");
    const timeRef = ref(db, "timer/time");
    const timeIdRef = ref(db, "timer/timeId");

    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      setStatus(snapshot.val());
    });

    const unsubscribeTImeId = onValue(timeIdRef, (snapshot) => {
      setTimeId(snapshot.val());
    });

    const unsubscribeTime = onValue(timeRef, (snapshot) => {
      if (snapshot.val() !== null) setTime(snapshot.val());
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTime();
      unsubscribeTImeId()
    };
  }, []);

  useEffect(() => {
    let interval;
    if (status === "start") {
      setIsRunning(true);
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (status === "pause") {
      setIsRunning(false);
      clearInterval(interval);
    } else if (status === "reset") {
      setIsRunning(false);
      setTime(0);
      clearInterval(interval);
    } else if (status === "stop") {
      setIsRunning(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const parseTimeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const warningTimeInSeconds = parseTimeToSeconds(TimerData[timeId].warning);
  const finalTimeInSeconds = parseTimeToSeconds(TimerData[timeId].final);

  const autoWarningBell = () => {
    autoWarningBellRef.current.play();
  };

  const autoLastBell = () => {
    autoLastBellRef.current.play();
  };



  useEffect(() => {
    // console.log("Current time:", time, "Warning target:", warningTimeInSeconds);
    if (time === warningTimeInSeconds) {
      console.log("bell ring");
      autoWarningBell();
    }
    if (time === finalTimeInSeconds) {
      console.log("final bell");
      autoLastBell();

    }
  }, [time, warningTimeInSeconds, finalTimeInSeconds]);


  return (
    <div className="flex flex-col items-center justify-between">
      <div className="text-7xl mt-4">{formatTime(time)}</div>
      <div className="text-xs flex py-1 px-4  gap-2 items-center rounded-lg text-zinc-500">
        <span className="text-right">
          {TimerData[timeId]?.warning}        <p>Warning </p>
        </span>
        <hr className="h-6 w-[1px] bg-zinc-300" />
        <span>
          <p>{TimerData[timeId]?.final}</p>
          <p>Final bell</p>
        </span>

      </div>

    </div>

  )

};

export default OnlineTimer;