"use client";
import { useProgrameContext } from "@/context/programContext";
import { RefreshCw, RotateCcw, RotateCw } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function ReportingSelector() {



  const [data, setData] = useState();
 
  const [isFetching, setIsFetching] = useState(false);
  const {
    selectedProgram, setSelectedProgram,
    participantsData, setParticipantsData,
    codeData, setCodeData,
    announcedCode, setAnnouncedCode
  } = useProgrameContext();

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(
"https://rendezvous.abaqas.in/campusprograms/action.php?status=ongoing&campusId=JM001&action=pagination&page=1&limit=100"
        // "https://rendezvous.abaqas.in/programs/action.php?status=ongoing&action=pagination&campusId=JM002"
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  console.log(data);

  const [selectedCode, setSelectedCode] = useState(codeData?.id || null);

  // ✅ Custom sort: single letters first, then multi-letter codes, alphabetical
  const sortParticipants = (list) => {
    return [...list].sort((a, b) => {
      const codeA = a.code?.toUpperCase();
      const codeB = b.code?.toUpperCase();

      if (codeA?.length !== codeB?.length) return codeA?.length - codeB?.length;
      return codeA.localeCompare(codeB);
    });
  };

  

  const handleClick = (participant) => {
    setCodeData(participant);
    setSelectedCode(participant.id);
  };

  // Split remaining and finished
  const remainingStudents = sortParticipants(
    participantsData.filter((s) => !announcedCode.includes(s.id) && s.code)
  );

  const announcedStudents = sortParticipants(
    participantsData.filter((s) => announcedCode.includes(s.id) && s.code)
  );

  const handleProgramChange = (event) => {
    const value = event.target.value;
    setSelectedProgram(value);

    if (value) {
      const [name, category] = value.split("|");
      const selected = data.find(
        (program) => program.name === name && program.category === category
      );

      if (selected) {
        // sort & set participants
        const newParticipantsData = sortParticipants(
          selected.participantsData || []
        );

        setParticipantsData(newParticipantsData);
        setAnnouncedCode([]);

        // set the first participant as default
        if (newParticipantsData.length > 0) {
          setCodeData(newParticipantsData[0]);
          setSelectedCode(newParticipantsData[0].id);
        } else {
          setCodeData(null);
          setSelectedCode(null);
        }
      }
    } else {
      // reset if nothing is selected
      setParticipantsData([]);
      setAnnouncedCode([]);
      setCodeData(null);
      setSelectedCode(null);
    }
  };

 useEffect(() => {
  if (data && data.length > 0 && !selectedProgram) {
    const firstProgram = data[0];
    const firstValue = `${firstProgram.name}|${firstProgram.category}`;

    setSelectedProgram(firstValue);

    const newParticipantsData = sortParticipants(
      firstProgram?.participantsData || []
    );

    setParticipantsData(newParticipantsData);
    setAnnouncedCode([]);

    if (newParticipantsData.length > 0) {
      setCodeData(newParticipantsData[0]);
      setSelectedCode(newParticipantsData[0].id);
    } else {
      setCodeData(null);
      setSelectedCode(null);
    }
  }
}, [
  data,
  selectedProgram,
  setSelectedProgram,
  setParticipantsData,
  setAnnouncedCode,
  setCodeData,
]);


  return (
    <div className="w-[300px]   ml-2">
      {/* Program Selector */}
      <div className="relative bg-white w-full h-[90px] rounded-lg border border-zinc-200 p-4 mb-5">
        <p className="text-sm text-center font-medium mb-2 text-zinc-500 ">Program</p>

        <button
          className={`text-zinc-700 absolute top-13 left-6 text-sm cursor-pointer transition-transform duration-500 ${isFetching ? "animate-spin" : ""}`}
          onClick={fetchData}
        >
          <RotateCw strokeWidth={2.5} size={18} />
        </button>

        <select
          value={selectedProgram || ""}
          onChange={handleProgramChange}
          className="w-full p-2 px-8 border text-sm rounded-md text-black"
        >
          {!selectedProgram && <option value="">~Select Current Programme~</option>}
          {data?.map((program, index) => (
            <option key={index} value={`${program.name}|${program.category}`}>
              {program.name} ({program.category})
            </option>
          ))}
        </select>
      </div>

      {/* Results List */}
      <div className="bg-white w-full h-[calc(100%_-_140px)] rounded-lg  border border-zinc-200 p-4 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-2">
          {remainingStudents.map((participant) => (
            <button
              key={participant.id}
              className={`flex justify-between overflow-hidden items-center  px-6 py-3  cursor-pointer rounded-lg font-medium text-sm transition-colors duration-100 ${codeData.id === participant.id
                ? "bg-violet-600 text-white hover:bg-violet-500"
                : "bg-gray-100 text-gray-800 hover:bg-gray-50"
                }`}
              onClick={() => handleClick(participant)}
            >
              <p>{participant.code + " - " + participant.student}</p>
              <p>Not Finished</p>
            </button>
          ))}
        </div>

        {announcedStudents.length > 0 && <hr className="my-3 text-zinc-200" />}

        {/* Finished */}
        <div className="flex flex-col gap-2">
          {announcedStudents.length > 0 && <p className="text-center text-xs text-gray-600">Finished Programmes</p>}
          {announcedStudents.length > 0 ? (
            announcedStudents.map((participant) => (
              <button
                key={participant.id}
                className={`flex justify-between items-center px-3 py-3 cursor-pointer rounded-lg font-medium text-sm transition-colors duration-100
                 
                     bg-gray-200 text-zinc-500 hover:bg-gray-100
                `}
                onClick={() => handleClick(participant)}
              >
                <p>{participant.code + " - " + participant.student}</p>
                <p>Finished</p>
              </button>
            ))
          ) : (
            <p className="text-center text-xs text-gray-500">
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
