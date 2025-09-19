import { BellRing, Play, TimerReset } from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { useState, useEffect } from "react";


import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { BiReset, } from "react-icons/bi";



import { ref, set } from "firebase/database";
import { db } from "../../firerbase/firebase"; // Import Firebase database



const OnlineController = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [showPauseIcon, setShowPauseIcon] = useState(false);


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







    return (
        <div className="flex flex-1 gap-5 items-center justify-center">

<style jsx>{`
          .tooltip {
            transition: opacity 0.3s ease;
          }
          .group:hover .tooltip {
            opacity: 1;
            transition-delay: 1s; /* show after 1 second */
          }
          .tooltip {
            opacity: 0;
            transition-delay: 0s; /* hide instantly */
          }
        `}</style>

            <div className="relative group">
                <button className="flex items-center gap-2 p-4 cursor-pointer bg-gray-700 hover:bg-gray-800 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105">
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
    );
};

export default OnlineController;