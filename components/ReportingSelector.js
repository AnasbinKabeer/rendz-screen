"use client";
import { useProgrameContext } from "@/context/programContext";
import React, { useState } from "react";

export default function ReportingSelector({ data }) {
  const {
    selectedProgram, setSelectedProgram,
    participantsData, setParticipantsData,
    codeData, setCodeData,
    announcedCode, setAnnouncedCode
  } = useProgrameContext();

  const [selectedCode, setSelectedCode] = useState(codeData?.id || null);

  // ✅ Custom sort: single letters first, then multi-letter codes, alphabetical
  const sortParticipants = (list) => {
    return [...list].sort((a, b) => {
      const codeA = a.code.toUpperCase();
      const codeB = b.code.toUpperCase();

      if (codeA.length !== codeB.length) return codeA.length - codeB.length;
      return codeA.localeCompare(codeB);
    });
  };

  // Handle program selection
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const [selectedName, selectedCategory] = selectedValue.split("|");

    setSelectedProgram(selectedValue);

    const selectedProgramData = data?.find(
      (program) =>
        program.name === selectedName && program.category === selectedCategory
    );

    const newParticipantsData = sortParticipants(
      selectedProgramData?.participantsData || []
    );

    setParticipantsData(newParticipantsData);
    setAnnouncedCode([]); // reset announced list

    // Pick first unannounced participant
    const newRemainingStudents = newParticipantsData
      .filter((student) => student.code)
      .sort((a, b) => sortParticipants([a, b])); // redundant but keeps sorting uniform

    if (newRemainingStudents.length > 0) {
      setCodeData(newRemainingStudents[0]);
      setSelectedCode(newRemainingStudents[0].id);
    } else {
      setCodeData(null);
      setSelectedCode(null);
    }
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

  
  return (
    <div className="w-[300px]   ml-2">
      {/* Program Selector */}
      <div className="bg-white w-full h-[90px] rounded-lg shadow-md p-4 mb-5">
        <p className="text-sm font-medium mb-2 text-gray-800">Select Program</p>
        <select
          value={selectedProgram || ""}
          onChange={handleSelectChange}
          className="w-full h-[35px] rounded-md px-3 py-1 text-sm border text-gray-800 border-gray-300 outline-none"
        >
          <option value="">~Select Current Programme~</option>
          {data?.map((program) => (
            <option
              key={program.id}
              value={`${program.name}|${program.category}`}
            >
              {program.name} - {program.category}
            </option>
          ))}
        </select>
      </div>

      {/* Results List */}
<div className="bg-white w-full h-[calc(100%_-_140px)] rounded-lg shadow-md p-4 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-2">
          {remainingStudents.map((participant) => (
            <button
              key={participant.id}
              className={`flex justify-between items-center px-3 py-3 cursor-pointer rounded-lg font-medium text-sm transition-colors duration-100 ${
                codeData.id === participant.id
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

        <hr className="my-3" />

        {/* Finished */}
        <div className="flex flex-col gap-2">
          <p className="text-center text-xs text-gray-600">Finished Programmes</p>
          {announcedStudents.length > 0 ? (
            announcedStudents.map((participant) => (
              <button 
                key={participant.id}
                className={`flex justify-between items-center px-3 py-3 cursor-not-allowed rounded-lg font-medium text-sm transition-colors duration-100
                 
                     bg-gray-200 text-gray-600 hover:bg-gray-100
                `}
                onClick={() => handleClick(participant)}
              >
                <p>{participant.code + " - " + participant.student}</p>
                <p>Finished</p>
              </button>
            ))
          ) : (
            <p className="text-center text-xs text-gray-500">
              No Programmes have been finished yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
