import { BellRing, Play, TimerReset } from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";



import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { BiReset, } from "react-icons/bi";



import { ref, set } from "firebase/database";
import { db } from "../../firerbase/firebase"; // Import Firebase database
import { TimerData } from "./timer-data";
import { useProgrameContext } from "@/context/programContext";



const OnlineController = () => {
    const [time, setTime] = useState(0);
    const [clickTimeout, setClickTimeout] = useState(null);
const {timeId, setTimeId} =useProgrameContext()
    const [isRunning, setIsRunning] = useState(false);
    const [showPauseIcon, setShowPauseIcon] = useState(false);

    const autoWarningBellRef = useRef(null);
    const autoLastBellRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            autoWarningBellRef.current = new Audio("/audio/oldwarning.mp3");
            autoLastBellRef.current = new Audio("/audio/last.mp3");
        }
    }, []);




    const autoWarningBell = () => {
        autoWarningBellRef.current.play();
    };

    const autoLastBell = () => {
        autoLastBellRef.current.play();
    };


    useEffect(() => {
        let timerInterval;
        if (isRunning) {
            timerInterval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [isRunning]);





    const updateTimerStatus = (status) => {
        set(ref(db, "timer/status"), status);
        set(ref(db, "timer/time"), time); // Sync current time
    };


const handleClick= (items)=> {
            set(ref(db, "timer/timeId"), items.id);

}





    const startTimer = () => {

        setIsRunning(true);
        setShowPauseIcon(true);
        updateTimerStatus("start");
    };

    const pauseTimer = () => {
        setIsRunning(false);
        setShowPauseIcon(false);
        updateTimerStatus("pause");

    };

    const resetTimer = () => {
        // Immediately set the timer value to 0 in the database
        set(ref(db, "timer/time"), 0)
            .then(() => {
                console.log("Timer reset to 0 in database");
            })
            .catch((error) => {
                console.error("Error resetting timer in database:", error);
            });

        // Update the timer status to "reset" in the database
        set(ref(db, "timer/status"), "reset")
            .then(() => {
                console.log("Timer status set to 'reset' in database");
            })
            .catch((error) => {
                console.error("Error updating timer status in database:", error);
            });

        // Reset the local state
        setIsRunning(false);
        setTime(0);
        setShowPauseIcon(false);
    };



    const handleBellClick = () => {
        if (clickTimeout) {
            // Second click → play warning bell immediately
            clearTimeout(clickTimeout);
            setClickTimeout(null);

            autoLastBell();
        } else {
            // First click → wait 250ms to see if it's a double click
            const timeout = setTimeout(() => {
                setClickTimeout(null);
                autoWarningBell();

            }, 250);
            setClickTimeout(timeout);
        }
    };


    return (
        <>

            <div className="flex flex-1 gap-5 items-center justify-center">



                <div className="relative group">
                    <button onClick={handleBellClick} className="flex items-center gap-2 p-4 cursor-pointer bg-gray-700 hover:bg-gray-800 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105">
                        <BellRing className="w-3 h-3" />
                    </button>
                    <span className="tooltip absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
                        Alarm
                    </span>
                </div>


                <div className="relative group">
                    <div className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105">
                        {showPauseIcon ? (
                            <FaCirclePause style={{ fontSize: "65px" }} onClick={pauseTimer} />
                        ) : (
                            <FaCirclePlay style={{ fontSize: "65px" }} onClick={startTimer} />
                        )}            </div>
                    <span className="tooltip absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
                        Start
                    </span>
                </div>


                <div className="relative group">
                    <button onClick={resetTimer} className="flex items-center gap-2 p-4 cursor-pointer bg-gray-700 hover:bg-gray-800 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105">
                        <TimerReset className="w-4 h-4" />
                    </button>
                    <span className="tooltip absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded">
                        Reset
                    </span>
                </div>







            </div>

            <div className=" items-center justify-center flex gap-2">
                {TimerData.map((item, idx) => (
                    <p
                        key={idx} //
                        onClick={() => handleClick(item)}
                        className={` ${timeId===item.id? "bg-violet-600 text-white":"bg-yellow-100 text-zinc-500"}  py-1 text-sm px-3 rounded-lg cursor-pointer`}
                    >
                        {item.time} {/* Replace with item property */}
                    </p>
                ))}




            </div>

        </>
    );
};

export default OnlineController;