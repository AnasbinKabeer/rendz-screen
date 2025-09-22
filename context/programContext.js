"use client";
import { createContext, useState, useContext } from "react";

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
  const [isRunning, setIsRunning] = useState(false);

  const [selectedResult, setSelectedResult] = useState(null);
  const [announcedIds, setAnnouncedIds] = useState([]);
  const [programId, setProgramId] = useState(null);


  ///special 

   const [time, setTime] = useState(0)
        const [timeId, setTimeId ] = useState(0);

  return (
    <ProgrameContext.Provider
      value={{
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
        isRunning,
        setIsRunning,





time, setTime,        timeId, setTimeId
      }}
    >
      {children}
    </ProgrameContext.Provider>
  );
}

export function useProgrameContext() {
  return useContext(ProgrameContext);
}
