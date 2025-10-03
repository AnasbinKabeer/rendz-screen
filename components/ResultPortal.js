"use client";
import { useProgrameContext } from "@/context/programContext";
import { RotateCw } from "lucide-react";
import React, { useEffect, useState } from "react";

function ResultPortal() {
  const [resultData, setResultData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const {
    programId,
    setProgramId,
    selectedResult,
    setSelectedResult,
    setIndividualResult,
    setProgramName,
    announcedIds,
    programName,
  } = useProgrameContext();

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(
        "https://rendezvous.abaqas.in/programs/action.php?status=judged&action=pagination&page=1&limit=500"
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      setResultData(result.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (resultData.length > 0 && !programId) {
      const first = [...resultData].sort((a, b) => a.order - b.order)[0];
      setProgramId(first.id);
      setProgramName(first);
    }
  }, [resultData, programId, setProgramId, setProgramName]);

  useEffect(() => {
    if (!programId) return;
    const fetchSelectedResult = async () => {
      try {
        setSelectedResult(null);
        const response = await fetch(
          `https://rendezvous.abaqas.in/results/action.php?program=${programId}&action=proResult`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        setSelectedResult(result.data);
      } catch (err) {
        console.error("Error fetching selected result:", err.message);
      }
    };
    fetchSelectedResult();
  }, [programId, setSelectedResult]);

  const handleClick = (data) => {
    setIndividualResult(null);
    setProgramId(data.id);
    setProgramName(data);
  };

  const remainingResults = resultData
    ?.filter((data) => !announcedIds.includes(data.order))
    ?.sort((a, b) => a.order - b.order);

  const announcedResults = resultData
    ?.filter((data) => announcedIds.includes(data.order))
    ?.sort((a, b) => a.order - b.order);

console.log("programIdFilter", programId)

  return (
    <div className="w-[300px] h-[95vh] ml-2">
      <div className="bg-white w-full h-full rounded-lg border border-zinc-200 p-4 overflow-auto no-scrollbar">
        <div className="flex justify-between w-full items-center px-2 pb-6 gap-2">
          <p className="text-zinc-500 text-sm font-medium">Result Portal</p>
          <button
            onClick={fetchData}
            className={`text-zinc-700 text-sm cursor-pointer transition-transform duration-500 ${isFetching ? "animate-spin" : ""}`}
          >
            <RotateCw strokeWidth={2.5} size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {remainingResults?.map((item) => (
            <button
              onClick={() => handleClick(item)}
              key={item.id}
              className={`flex justify-between cursor-pointer items-center text-sm px-6 py-3 rounded-lg font-medium transition-colors duration-100
                ${item.id === programId ? "bg-violet-600 text-white hover:bg-violet-500" : "bg-gray-100 text-gray-800 hover:bg-gray-50"}`}
            >
              <div className="flex flex-col items-start">
                <p className="text-md font-medium">Result {item.order}</p>
                <div className="flex gap-1 text-zinc-500">
                  <p className={`text-[10px] text-left font-extralight uppercase ${item.id === programId ? "text-gray-100" : ""}`}>
                    {item.name}
                  </p>
                  <p className={`text-[10px] ${item.id === programId ? "text-yellow-400" : "text-yellow-500"} uppercase font-extralight`}>
                    {item.category}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {announcedResults?.length > 0 && <hr className="my-3" />}

        <div className="flex flex-col gap-2">
          {announcedResults?.length > 0 && <p className="text-center text-sm text-gray-600">Announced Results</p>}
          {announcedResults?.map((item) => (
            <button
              onClick={() => handleClick(item)}
              key={item.id}
              className={`flex justify-between cursor-pointer items-center text-sm px-6 py-3 rounded-lg font-medium transition-colors duration-100
                ${item.id === programId ? "bg-violet-600 text-white hover:bg-violet-500" : "bg-gray-100 text-gray-800 hover:bg-gray-50"}`}
            >
              <div className="flex flex-col items-start">
                <p className="text-md font-medium">Result {item.order}</p>
                <div className="flex gap-1">
                  <p className="text-[10px] font-extralight">{item.name}</p>
                  <p className="text-[10px] text-yellow-600 uppercase font-extralight">({item.category})</p>
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
