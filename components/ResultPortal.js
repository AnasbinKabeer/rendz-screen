// ResultPortal.jsx
"use client";
import { useProgrameContext } from "@/context/programContext";
import React, { useEffect, useState } from "react";

function ResultPortal({ resultData }) {
  const { selectedResult, setSelectedResult, setIndividualResult } = useProgrameContext();
  const [programId, setProgramId] = useState(null);

  const url = programId
    ? `https://rendezvous.abaqas.in/campusresults/action.php?program=${programId}&action=proResult`
    : null;

  // ✅ Set first result automatically when data is available
  // useEffect(() => {
  //   if (resultData?.length > 0 && !programId) {
  //     const first = [...resultData].sort((a, b) => a.order - b.order)[0];
  //     setProgramId(first.id);
  //   }
  // }, [resultData, programId]);

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
  };

  console.log("selectedResult", selectedResult)

  return (
    <div className="w-[300px] h-[95vh] ml-2">
      <div className="bg-white w-full h-full rounded-lg shadow-md p-4 overflow-auto no-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center px-2 pb-6">
          <p className="text-md text-gray-800 font-medium">Result Portal</p>
        </div>

        {/* Upcoming Results */}
        <div className="flex flex-col gap-2 mb-4">
          {resultData
            ?.sort((a, b) => a.order - b.order)
            .map((item) => (
              <button
                onClick={() => handleClick(item)}
                key={item.id}
                className={`flex justify-between cursor-pointer items-center text-sm px-6 py-3 rounded-lg font-medium transition-colors duration-100
                  ${
                    item.id === programId
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-50"
                  }`}
              >
                <div className="flex flex-col items-start">
                  <p className="text-md font-medium">Result {item.order}</p>
                </div>
                <p className="text-xs font-extralight"> {item.name}</p>
              </button>
            ))}
        </div>

        <hr className="my-3" />

        {/* Announced Results */}
        <div className="flex flex-col gap-2">
          <p className="text-center text-sm text-gray-600">Announced Results</p>

          <button className="flex justify-between items-center px-4 py-3 rounded-lg font-medium bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition">
            <p>Result</p>
            <p>Announced</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPortal;
