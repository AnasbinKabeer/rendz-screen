
'use client'
import { useState, useEffect, useRef,useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCirclePlay, FaCirclePause, FaBarsStaggered } from "react-icons/fa6";
import { BiReset, BiSolidUserVoice } from "react-icons/bi";
import { PiBellRingingLight } from "react-icons/pi";
import { MdAutoAwesome } from "react-icons/md";
import { useProgrameContext } from "@/context/programContext";


const TimerData = [

    {
        id: "1",
        warning: "4:30",
        final: "4:50",
        time: "5:00"
    },

    {
        id: "2",
        warning: "2:30",
        final: "2:50",
        time: "3:00"
    },
    
    {
        id: "3",
        warning: "5:00",
        final: "5:50",
        time: "6:00"
    },
    
    {
        id: "4",
        warning: "7:00",
        final: "7:50",
        time: "8:00"
    },
    
    {
        id: "5",
        warning: "8:00",
        final: "9:50",
        time: "10:00"
    },
    {
        id: "6",
        warning: "12:00",
        final: "14:50",
        time: "15:00"
    },   
     {
        id: "7",
        warning: "00:05",
        final: "00:10",
        time: "00:20"
    },
       
]


// import JudgeView from '../../components/viewbygpt';

const page = () => {
    const [autoBellEnabled, setAutoBellEnabled] = useState(true); 
    const [autoStart, setAutoStart] = useState(false)
    const [menu, setMenu] = useState(false)
  const { timeId } = useProgrameContext();
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showPauseIcon, setShowPauseIcon] = useState(false);
    const [cancelVisible, setCancelVisible] = useState(false);
    const [, setIsBellRinging] = useState(false);
    const [clickTimeout, setClickTimeout] = useState(null);
    const [animation, setAnimation] = useState("");



    console.log(animation)

    const audioRef = useRef(new Audio('/warning.mp3'));
    const lastBellRef = useRef(new Audio('/last.mp3'));
    const autoWarnimgBellRef = useRef(new Audio('/autoWarning.mp3'));
    const autoLastBellRef = useRef(new Audio('/autolast.mp3'));
    const [disbell, setDisbell] = useState(false);
    const [selectedTimerIndex, setSelectedTimerIndex] = useState(0);
    const countdownIntervalRef = useRef(null);


    const parseTimeToSeconds = (timeStr) => {
        const [minutes, seconds] = timeStr.split(":").map(Number);
        return minutes * 60 + seconds;
    };

    const warningTimeInSeconds = parseTimeToSeconds(TimerData[selectedTimerIndex].warning);
    const finalTimeInSeconds = parseTimeToSeconds(TimerData[selectedTimerIndex].final);

    console.log(selectedTimerIndex)
    useEffect(() => {
        let timerInterval;
        if (isRunning) {
            timerInterval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [isRunning]);

    useEffect(() => {
        if (time === warningTimeInSeconds) {
            autoWarningBell();
        }
        if (time === finalTimeInSeconds) {
            autoLastBell();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time, warningTimeInSeconds, finalTimeInSeconds]);

console.log(finalTimeInSeconds)

    const displayFinalTimePlus3 = (timeStr) => {
        const [minutes, seconds] = timeStr.split(":").map(Number);
        const totalSeconds = minutes * 60 + seconds + 10;
        const adjustedMinutes = Math.floor(totalSeconds / 60);
        const adjustedSeconds = totalSeconds % 60;
        return `${String(adjustedMinutes).padStart(2, "0")}:${String(adjustedSeconds).padStart(2, "0")}`;
    };


    const triggerAnimation = (animationName, duration = 3000) => {
        setAnimation(`animate__${animationName}`);
        setTimeout(() => {
            setAnimation(""); // Clear animation after duration
        }, duration);
    };



    console.log(animation)

    const startTimer = () => {
        setDisbell(true);
        setIsRunning(true);
        setShowPauseIcon(true);
        setCancelVisible(false);

        setTimeout(() => {
         
            setTimeout(() => {
                setDisbell(false);
            }, 1000);
        }, 3000);
    };

    const pauseTimer = () => {


        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }

        autoLastBellRef.current.pause();
        autoLastBellRef.current.currentTime = 0;

        setIsRunning(false);
        setShowPauseIcon(false);
        setCancelVisible(false);

    };

    const resetTimer = () => {

        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }

        autoLastBellRef.current.pause();
        autoLastBellRef.current.currentTime = 0;

     

        setTime(0);
        setIsRunning(false);
        setShowPauseIcon(false);
        setDisbell(true);
        setCancelVisible(false);
        setTimeout(() => {
            setDisbell(false);

        }, 1000);
    };


    const autoLastBell = () => {
        if (time === 290 && selectedTimerIndex === 0) {
            if (window.confirm("Do you want to proceed with the final bell?")) {
                executeAutoLastBell();
            } else {
                resetTimer();
                return; // Exit if user cancels
            }
        } else {
           
            executeAutoLastBell();
       
        }
    };
    
    const executeAutoLastBell = () => {
        if (!autoBellEnabled) return; // Exit if auto bells are disabled
        setDisbell(true);
        let countdown = 10;
        setAlertMessage(`Final bell rings in ${countdown} seconds`);
        setCancelVisible(true);
        clearInterval(countdownIntervalRef.current); // Clear any previous interval
        countdownIntervalRef.current = setInterval(() => {
            countdown -= 1;
            setAlertMessage(`Final bell rings in ${countdown} seconds`);
    
            if (countdown === 0) {
                clearInterval(countdownIntervalRef.current);
                setCancelVisible(false);
    
                setAlertMessage("Final Bell");
                triggerAnimation("fadeInDown");
    
                setTimeout(() => {
                    setAlertMessage("");
                    setDisbell(false);
                }, 1000);
            }
        }, 1005);
    
        autoLastBellRef.current.play();
    };
    



    const playWarningBell = () => {
        setDisbell(true);
        let countdown = 3;
        setAlertMessage(`Warning bell rings in ${countdown} seconds`);
        setCancelVisible(true);

        clearInterval(countdownIntervalRef.current); // Clear any previous interval
        countdownIntervalRef.current = setInterval(() => {
            countdown -= 1;
            setAlertMessage(`Warning bell rings in ${countdown} seconds`);

            if (countdown === 0) {
                clearInterval(countdownIntervalRef.current);
                setCancelVisible(false);

                setAlertMessage("~warning bell~");
                triggerAnimation("fadeInDown");

                setTimeout(() => {
                    setAlertMessage("");
                    setDisbell(false);
                }, 1000);
            }
        }, 1005);

        audioRef.current.play();
    };

    const stopBell = () => {
        setIsBellRinging(false);

        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }

        autoLastBellRef.current.pause();
        autoLastBellRef.current.currentTime = 0;
        
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        setAlertMessage("Bell stopped");
        setCancelVisible(false);
        setDisbell(false);
       

        setInterval(() => {
            setAlertMessage("");
           
        }, 1000);
    };

    const playLastBell = () => {
        setAlertMessage("Final bell rings now!");
        setDisbell(true);
        setAnimation("animate__fadeInDown");
        lastBellRef.current.play();

        setTimeout(() => {
            setAlertMessage("");
            setDisbell(false);
        }, 2000);
    };

  const autoWarningBell = () => {
    if (!autoBellEnabled) return; // Exit if auto bells are disabled
    setAlertMessage("Warning bell!");
    autoWarnimgBellRef.current.play();
    setDisbell(true);
    triggerAnimation("fadeInDown");

    setTimeout(() => {
        setAlertMessage("");
        setDisbell(false);
    }, 3000);
};


    const handleBellClick = () => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }

        if (clickTimeout) {
            playLastBell();
        } else {
            const timeout = setTimeout(() => {
                setClickTimeout(null);
                playWarningBell();
            }, 250);

            setClickTimeout(timeout);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const handleTimerSelection = (index) => {
        setSelectedTimerIndex(index);
    };

    console.log(animation)

    return (
        <div className="timer_container">
<div className={menu ? "slider show" : "slider"}>


{TimerData.map((data, index) => (
                        <button
                            key={data.id}
                            onClick={() => {handleTimerSelection(index); setMenu(!menu)} }
                            className={selectedTimerIndex === index ? "selected timebtn select" : "timebtn"}
                        >
                             {data.time +  " minutes" }
                        </button>
                    ))}

</div>
<div className="timer_left_container">

    {menu?  <IoMdClose style={{zIndex:"10" , color:"white"}} 
    onClick={()=>setMenu(!menu)} /> : 
    
    <FaBarsStaggered 
    onClick={()=>setMenu(!menu)}
    />
}
                
            </div>

            <div className="timer_main_container">
                <div className="timer_main_contents">
                    <div className="timer_main_controller">
                        <div className="alert_box">
                            <p className={`alert_text animate__animated ${animation}`}>{alertMessage}</p>
                            {cancelVisible && (
                                <p className="cancel_button" onClick={stopBell}>cancel X</p>
                            )}
                        </div>

                        {autoStart ? (<PreTimer />
                        ) : (<div className="timer_display_board">{formatTime(time)}</div>
                        )}



                        <div className="timer_controller">
                            <button className="manual_bell" disabled={disbell} onClick={handleBellClick}>
                                <PiBellRingingLight />
                            </button>
                            <div className="play_pause">
                                {showPauseIcon ? (
                                    <FaCirclePause style={{
                                        pointerEvents: autoStart ? "none" : "auto",
                                        opacity: autoStart ? 0.3 : 1, // Optional: Visual indication
                                    }} onClick={pauseTimer} />
                                ) : (
                                    <FaCirclePlay style={{
                                        pointerEvents: autoStart ? "none" : "auto",
                                        opacity: autoStart ? 0.3 : 1, // Optional: Visual indication
                                    }} onClick={startTimer} />
                                )}
                            </div>
                            <div className="reset_btn" style={{
                                pointerEvents: autoStart ? "none" : "auto",
                                opacity: autoStart ? 0.3 : 1, // Optional: Visual indication
                            }} onClick={resetTimer}><BiReset /></div>
                        </div>
                    </div>
                </div>

             {autoBellEnabled?    <div className="timer_main_showcase">
                    <div className="arrow_left time_slider"></div>

                    <div className="warning_time">
                        <p className="Placeholder_text">Warning </p>
                        
                        {autoStart? <p className="time_sample">
                           
                           {TimerData[timeId].warning}
                           
                           </p>:   <p className="time_sample">
                           
                           {TimerData[selectedTimerIndex].warning}
                           
                           </p> }


                      
                    </div>
                    <div className="war_las_seperator"></div>
                    <div className="lat_time">
                        <p className="Placeholder_text">Final bell</p>

{autoStart? <p className="time_sample">{displayFinalTimePlus3(TimerData[timeId].final)}</p> :
 <p className="time_sample">{displayFinalTimePlus3(TimerData[selectedTimerIndex].final)}</p>}

                        
                    </div>
                    <div className="arrow_right time_slider"></div>
                </div>: ""}

                {/* Timer selection controls */}
                <div className="timer_selection">
                    
                </div>
            </div>

            <div className="timer_right_container">
                
                <div className="theme_changer">

                   
                <div className="toggle-container">

<div
    className={`toggle-button ${autoStart ? "on" : "off"}`}
    onClick={() => setAutoStart(!autoStart)}
>
    <div className="toggle-circle"></div>
</div>
<p className="toggle-status">{autoStart ? "ON" : "OFF"}</p>
</div>
                    {/* <FaMoon /> */}



                </div>
                <div className="autos">




                    <div className={`voice_controller ${autoBellEnabled ? "focus" : ""}`}><BiSolidUserVoice 
                    onClick={()=>setAutoBellEnabled(!autoBellEnabled)}/></div>
                    <div className="auto_bell"><MdAutoAwesome /></div>
                </div>
            </div>
        </div>
    );
};

export default page;
