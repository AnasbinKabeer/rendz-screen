"use client";
import ResultPortal from "@/components/ResultPortal";
import { createContext, useState, useContext } from "react";

const ProgrameContext = createContext();

export function ProgrameProvider({ children }) {
  const [user, setUser] = useState(null);
  const [codeData, setCodeData] = useState();
  const [selectedProgram, setSelectedProgram] = useState();
  const [participantsData, setParticipantsData] = useState([]);
  const [announcedCode, setAnnouncedCode] = useState([]); // ✅ NEW
  const [individualResult, setIndividualResult] = useState(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [programName, setProgramName] = useState("")
  

  // ResultPortal
  const [selectedResult, setSelectedResult] = useState(null);
const [announcedIds, setAnnouncedIds,] = useState([])
  const [programId, setProgramId] = useState(null);


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
        setAnnouncedCode, // ✅
        
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
         programId, setProgramId
        
        
      }}
    >
      {children}
    </ProgrameContext.Provider>
  );
}

export function useProgrameContext() {
  return useContext(ProgrameContext);
}
