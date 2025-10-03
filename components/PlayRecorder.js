import { useEffect, useState, useRef } from "react";
import { storage } from "../firerbase/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { FaCirclePlay } from "react-icons/fa6";
import { FaStopCircle } from "react-icons/fa";
import { useProgrameContext } from "@/context/programContext";

const PlayAudio = ({ results }) => {
  const [allAudioFiles, setAllAudioFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // const [programIdFilter, setProgramIdFilter] = useState("4063");
  const [codeFilters, setCodeFilters] = useState([]);

  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  // show "Go" after countdown

  const countdownRef = useRef(null);
  const fadeInRef = useRef(null);
  const fadeOutRef = useRef(null);
  const autoStopRef = useRef(null);

  const { selectedResult  ,programId , setCountdown,
 setShowGo} = useProgrameContext();
  const programIdFilter =  String(programId)

  // result {. "4602"  } 

  // Fetch all audio files
  useEffect(() => {
    const fetchAllAudioFiles = async () => {
      try {
        const audioRef = ref(storage, "audio/");
        const audioList = await listAll(audioRef);
        const audioURLs = await Promise.all(
          audioList.items.map(async (audio) => {
            const url = await getDownloadURL(audio);
            return { name: audio.name, url };
          })
        );
        setAllAudioFiles(audioURLs);
      } catch (error) {
        console.error("Error fetching audio files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAudioFiles();
  }, []);

  // Filters for selectedResult
  useEffect(() => {
    if (selectedResult) {
      const allCodes = selectedResult
        .filter((item) => ["1", "2", "3"].includes(item.rank))
        .sort((a, b) => Number(a.rank) - Number(b.rank))
        .map((item) => item.code);
      setCodeFilters([...new Set(allCodes)]);
    }
  }, [selectedResult]);

  // Filter audio files
  useEffect(() => {
    if (programIdFilter && codeFilters.length > 0) {
      const filteredFiles = allAudioFiles.filter((file) => {
        if (!file.name.includes("-")) return false;
        const [programId, codeWithExtension] = file.name.split("-");
        if (!codeWithExtension) return false;
        const code = codeWithExtension.split(".")[0];
        return programId === programIdFilter && codeFilters.includes(code);
      });

      const sortedFiles = filteredFiles.sort((a, b) => {
        const codeA = a.name.split("-")[1]?.split(".")[0];
        const codeB = b.name.split("-")[1]?.split(".")[0];
        return codeFilters.indexOf(codeA) - codeFilters.indexOf(codeB);
      });

      setAudioFiles(sortedFiles);
    } else {
      setAudioFiles([]);
    }
  }, [programIdFilter, codeFilters, allAudioFiles]);

  // Cleanup previous timers
  const clearAllTimers = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (fadeInRef.current) clearInterval(fadeInRef.current);
    if (fadeOutRef.current) clearInterval(fadeOutRef.current);
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    setCountdown(null);
    setShowGo(false);
  };

  // Play with smooth up-down fade (8s total) and countdown
  const handlePlay = (url, index) => {
    // Stop previous audio and timers
    if (currentAudio) currentAudio.pause();
    clearAllTimers();

    const audioElement = new Audio(url);
    audioElement.volume = 0;
    audioElement.play();
    setCurrentAudio(audioElement);
    setPlayingIndex(index);

    // Countdown 8 → 0
    setCountdown(8);
    let timeLeft = 8;
    countdownRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearInterval(countdownRef.current);
        setCountdown(null);
        setShowGo(true);
      } else {
        setCountdown(timeLeft);
      }
    }, 1000);

    // Smooth fade in (0 → 1 in 4s)
    let vol = 0;
    fadeInRef.current = setInterval(() => {
      if (vol < 1) {
        vol += 0.025; // ~4s to reach full
        audioElement.volume = Math.min(vol, 1);
      } else {
        clearInterval(fadeInRef.current);
      }
    }, 200);

    // Start fade out after 4s
    autoStopRef.current = setTimeout(() => {
      let volOut = audioElement.volume;
      fadeOutRef.current = setInterval(() => {
        if (volOut > 0) {
          volOut -= 0.025;
          audioElement.volume = Math.max(volOut, 0);
        } else {
          clearInterval(fadeOutRef.current);
          audioElement.pause();
          audioElement.currentTime = 0;
          setCurrentAudio(null);
          setPlayingIndex(null);
        }
      }, 200);
    }, 4000);

    // Ensure auto stop at 8s
    setTimeout(() => {
      audioElement.pause();
      audioElement.currentTime = 0;
      setCurrentAudio(null);
      setPlayingIndex(null);
      setCountdown(null);
      setShowGo(true);
    }, 8000);

    audioElement.onended = () => {
      setCurrentAudio(null);
      setPlayingIndex(null);
      setCountdown(null);
      setShowGo(true);
    };
  };

  // Manual stop with fade out
  const handleStop = () => {
    if (currentAudio) {
      clearAllTimers();
      let vol = currentAudio.volume;
      const fadeOut = setInterval(() => {
        if (vol > 0) {
          vol -= 0.05;
          currentAudio.volume = Math.max(vol, 0);
        } else {
          clearInterval(fadeOut);
          currentAudio.pause();
          currentAudio.currentTime = 0;
          setCurrentAudio(null);
          setPlayingIndex(null);
          setCountdown(null);
          setShowGo(false);
        }
      }, 100);
    }
  };

  if (loading) return <p></p>;

  return (
    <div className="flex flex-col gap-2 items-center">
      

      {audioFiles.length === 0 ? (
        <p></p>
      ) : (
        audioFiles.map((audio, index) => (
          <div
            className="w-9 h-10 bg-blue-100 p-1 cursor-pointer text-blue-800 rounded flex items-center justify-center"
            key={index}
          >
            {playingIndex === index ? (
              <FaStopCircle
                onClick={handleStop}
                style={{ fontSize: "29px", cursor: "pointer", color: "red" }}
              />
            ) : (
              <FaCirclePlay
                onClick={() => handlePlay(audio.url, index)}
                style={{ fontSize: "29px", cursor: "pointer" }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PlayAudio;
