"use client";
import { createContext, useState, useContext, useEffect } from "react";

const ProgrameContext = createContext();

export function ProgrameProvider({ children }) {
  const [user, setUser] = useState(null);
  const [codeData, setCodeData] = useState();
  const [selectedProgram, setSelectedProgram] = useState();
  const [participantsData, setParticipantsData] = useState([]);
  const [announcedCode, setAnnouncedCode] = useState([]);
  const [individualResult, setIndividualResult] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [programName, setProgramName] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [announcedIds, setAnnouncedIds] = useState([]);
  const [programId, setProgramId] = useState(null);

  /// special (timer states)
  const [time, setTime] = useState(0);
  const [timeId, setTimeId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
      const [showPauseIcon, setShowPauseIcon] = useState(false);



  // Timer effect
  useEffect(() => {
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning]);

  return (
    <ProgrameContext.Provider
      value={{
        user,
        setUser,
        codeData,
        setCodeData,
        selectedProgram,
        setSelectedProgram,
        participantsData,
        setParticipantsData,
        announcedCode,
        setAnnouncedCode,
        selectedResult,
        setSelectedResult,
        individualResult,
        setIndividualResult,
        selectedDeviceId,
        setSelectedDeviceId,
        programName,
        setProgramName,
        announcedIds,
        setAnnouncedIds,
        programId,
        setProgramId,
        time,
        setTime,
        timeId,
        setTimeId,
        isRunning,
        setIsRunning,
        showPauseIcon, 
        setShowPauseIcon
      }}
    >
      {children}
    </ProgrameContext.Provider>
  );
}

export function useProgrameContext() {
  return useContext(ProgrameContext);
}
