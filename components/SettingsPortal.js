"use client";
import { useProgrameContext } from "@/context/programContext";
import React, { useEffect, useState } from "react";
import { BsFillBoxFill } from "react-icons/bs";
import { FaCode } from "react-icons/fa";
import { BsInfoCircleFill } from "react-icons/bs";
import { MdOutlineMonitor } from "react-icons/md";
import { LuPresentation } from "react-icons/lu";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { FaRecordVinyl } from "react-icons/fa6";
import { IoTimer } from "react-icons/io5";







const scheduleData = [
    { id: "01", name: "General", schedule: [], Icon: BsFillBoxFill },
    { id: "02", name: "API", schedule: [], Icon: FaCode },
    { id: "03", name: "About", schedule: [], Icon: BsInfoCircleFill },
    { id: "04", name: "Monitor", schedule: [], Icon: MdOutlineMonitor },
    { id: "05", name: "PreScreen", schedule: [], Icon: LuPresentation },
    { id: "06", name: "Audio Recorder", schedule: [], Icon: FaRecordVinyl },
    { id: "07", name: "Timer", schedule: [], Icon: IoTimer },
    
];

function SettingsPortal() {
    const { selectedResult, setSelectedResult, setIndividualResult } = useProgrameContext();
    const [stageId, setStageId] = useState(null);

    // Build URL dynamically
    const url = stageId
        ? `https://rendezvous.abaqas.in/campusresults/action.php?program=${stageId}&action=proResult`
        : null;

    // ✅ Set default stageId (first item)
    useEffect(() => {
        if (scheduleData?.length > 0 && !stageId) {
            setStageId(scheduleData[0].id);
        }
    }, [stageId]);

    // ✅ Fetch results when stageId changes
    useEffect(() => {
        const fetchData = async () => {
            if (!url) return;
            try {
                setSelectedResult(null); // reset before fetching
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

    return (
        <div className="w-[300px] h-[95vh] ml-2">
            <div className="bg-white w-full h-full rounded-lg border border-zinc-200 p-4 overflow-auto no-scrollbar">
                {/* Header */}
                <div className="flex justify-between items-center px-2 pb-6">
                    <p className="text-center w-full text-zinc-500 text-sm font-medium">Settings</p>
                </div>

                {/* Upcoming Results */}
                <div className="flex flex-col gap-2 mb-4">
                    {scheduleData.map((item) => (
                        <button
                            onClick={() => handleClick(item)}
                            key={item.id}
                            className={`flex justify-between cursor-pointer items-center text-sm px-4 py-3 rounded-lg font-medium transition-colors duration-100
                                    ${item.id === stageId
                                    ? "bg-violet-600 text-white hover:bg-violet-500"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex w-full items-start justify-between">
                                <div className=" flex w-full items-center  gap-2">
                                    {item.Icon ? <item.Icon size={16} /> : <BsFillBoxFill />}
                                    <p className="text-md font-medium">{item.name}</p>

                                </div>
                                    <div className="flex items-center justify-between">

                                        <PiDotsThreeVerticalBold size={20}/>
                                    </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SettingsPortal;
