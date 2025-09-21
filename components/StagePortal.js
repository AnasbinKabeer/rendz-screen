// ResultPortal.jsx
"use client";
import { useProgrameContext } from "@/context/programContext";
import React, { useEffect, useState } from "react";

const scheduleData= [
    {id: "01",
        name : "Qurthuba",
        schedule:[]
    },
      {id: "02",
        name : "Qurthuba",
        schedule:[]
    },
      {id: "03",
        name : "Qurthuba",
        schedule:[]
    },
      {id: "04",
        name : "Qurthuba",
        schedule:[]
    },
      {id: "05",
        name : "Qurthuba",
        schedule:[]
    },
      {id: "06",
        name : "Qurthuba",
        schedule:[]
    },
      {id: "07",
        name : "Qurthuba",
        schedule:[]
    },
      {id: "08",
        name : "Qurthuba",
        schedule:[]
    },
      {id: "09",
        name : "Qurthuba",
        schedule:[]
    },
     {id: "10",
        name : "Qurthuba",
        schedule:[]
    },
     {id: "11",
        name : "Qurthuba",
        schedule:[]
    },
    
]

function StagePortal() {
  const { selectedResult, setSelectedResult, setIndividualResult } = useProgrameContext();
  const [stageId, setStageId] = useState(null);

  // const url = stageId
  //   ? `https://rendezvous.abaqas.in/campusresults/action.php?program=${programId}&action=proResult`
  //   : null;

  // ✅ Set first result automatically when data is available
  useEffect(() => {
    if (scheduleData?.length > 0 && !stageId) {
      const first = [...scheduleData].sort((a, b) => a.order - b.order)[0];
      setStageId(first.id);
    }
  }, [scheduleData, stageId]);

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
  }, [stageId]);

  const handleClick = (data) => {
    setIndividualResult(null);
    setStageId(data.id);
  };

  console.log("selectedResult", selectedResult)

  return (
    <div className="w-[300px] h-[95vh] ml-2">
      <div className="bg-white w-full h-full rounded-lg border border-zinc-200 p-4 overflow-auto no-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center px-2 pb-6">
          <p className="text-center w-full text-zinc-500 text-sm font-medium">Stage Portal</p>
        </div>

        {/* Upcoming Results */}
        <div className="flex flex-col gap-2 mb-4">
          {scheduleData
            .map((item) => (
              <button
                onClick={() => handleClick(item)}
                key={item.id}
               className={`flex justify-between cursor-pointer items-center text-sm px-6 py-3 rounded-lg font-medium transition-colors duration-100
                  ${
                    item.id === stageId 
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-50"
                  }`}
              >
                <div className="flex flex-col items-start">
                  <p className="text-md font-medium">Stage {item.id}</p>
                </div>
                <p className="text-xs font-extralight"> {item.name}</p>
              </button>
            ))}
        </div>

   
      </div>
    </div>
  );
}

export default StagePortal;
