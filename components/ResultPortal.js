// ResultPortal.jsx
"use client";
import { useProgrameContext } from "@/context/programContext";
import { RotateCw } from "lucide-react";
import React, { useEffect, useState } from "react";

function ResultPortal({ resultData }) {
  const { programId, setProgramId, selectedResult, setSelectedResult, setIndividualResult, individualResult, setProgramName, programName , 
announcedIds
  } = useProgrameContext();

  const url = programId
    ? `https://rendezvous.abaqas.in/campusresults/action.php?program=${programId}&action=proResult`
    : null;

  // ✅ Set first result automatically when data is available
  useEffect(() => {
    if (resultData?.length > 0 && !programId) {
      const first = [...resultData].sort((a, b) => a.order - b.order)[0];
      setProgramId(first.id);
      setProgramName(first)
    }
  }, [resultData, programId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;
      try {
        setSelectedResult(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setSelectedResult(result.data);
      } catch (err) {
        console.error("Error fetching:", err.message);
      }
    }; 

    fetchData();
  }, [programId]);

  const handleClick = (data) => {
    setIndividualResult(null);
    setProgramId(data.id);
    setProgramName(data)
  };


  
const remainingResults = resultData
        ?.filter((data) => !announcedIds.includes(data.order))
        ?.sort((a, b) => a.order - b.order); // Sorting by 'order' property in ascending order


    const announcedResults = resultData?.filter((data) => announcedIds.includes(data.order))
        .sort((a, b) => a.order - b.order);


  console.log("selectedResult", selectedResult)
  console.log("individualResult", individualResult)
  console.log("programId", programId)
  console.log("setProgramName", programName)

  return (
    <div className="w-[300px] h-[95vh] ml-2">
      <div className="bg-white w-full h-full rounded-lg border border-zinc-200 p-4 overflow-auto no-scrollbar">
        {/* Header */}
        <div className="flex justify-center items-center px-2 pb-6 gap-2">
          <p className=" text-zinc-500 text-sm font-medium">Result Portal</p>
        </div>

        {/* Upcoming Results */}
        <div className="flex flex-col gap-2 mb-4">
          {remainingResults
            ?.map((item) => (
              <button
                onClick={() => handleClick(item)}
                key={item.id}
                className={`flex justify-between cursor-pointer items-center text-sm px-6 py-3 rounded-lg font-medium transition-colors duration-100
                  ${item.id === programId
                    ? "bg-violet-600 text-white hover:bg-violet-500"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-50"
                  }`}
              >
                <div className="flex flex-col items-start">
                  <p className="text-md font-medium">Result {item.order}</p>
                  <div className="flex gap-1 text-zinc-400">
                    <p className="text-[10px] font-extralight"> {item.name}</p>
                    <p className="text-[10px] text-yellow-500 uppercase font-extralight">{item.category} </p>
                  </div>
                </div>
              </button>
            ))}
        </div>

{announcedResults?.length > 0  &&  <hr className="my-3" />}
       

        {/* Announced Results */}
        <div className="flex flex-col gap-2">
     {announcedResults?.length > 0  &&  <p className="text-center text-sm text-gray-600">Announced Results</p>}    

           {announcedResults
            ?.map((item) => (
              <button
                onClick={() => handleClick(item)}
                key={item.id}
                className={`flex justify-between cursor-pointer items-center text-sm px-6 py-3 rounded-lg font-medium transition-colors duration-100
                  ${item.id === programId
                    ? "bg-violet-600 text-white hover:bg-violet-500"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-50"
                  }`}
              >
                <div className="flex flex-col items-start">
                  <p className="text-md font-medium">Result {item.order}</p>
                  <div className="flex gap-1">
                    <p className="text-[10px] font-extralight"> {item.name}</p>
                    <p className="text-[10px] text-yellow-600 uppercase font-extralight">({item.category}) </p>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ResultPortal;
