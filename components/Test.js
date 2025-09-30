"use client";
import { useEffect, useState } from "react";
import { storage } from "../firerbase/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { FaCirclePlay } from "react-icons/fa6";
import { FaStopCircle } from "react-icons/fa";
import { useProgrameContext } from "@/context/programContext";

const Test = () => {
  const [allAudioFiles, setAllAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  const { selectedResult } = useProgrameContext();

  useEffect(() => {
    const fetchAllAudioFiles = async () => {
      try {
        const audioRef = ref(storage, "audio/");
        const audioList = await listAll(audioRef);
        const audioURLs = await Promise.all(
          audioList.items.map(async (audio) => ({
            name: audio.name,
            url: await getDownloadURL(audio),
          }))
        );
        setAllAudioFiles(audioURLs);
      } catch (err) {
        console.error("Error fetching audio files:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAudioFiles();
  }, []);

  if (loading) return <p>Loading audio...</p>;

  const programIdFilter = selectedResult?.id && String(selectedResult.id);
  const codeFilters = selectedResult
    ? [
        ...(selectedResult.first?.map((i) => i.code) || []),
        ...(selectedResult.second?.map((i) => i.code) || []),
        ...(selectedResult.third?.map((i) => i.code) || []),
      ].map((c) => c.toUpperCase())
    : [];

  const audioFiles =
    programIdFilter && codeFilters.length > 0
      ? allAudioFiles
          .filter((file) => {
            const [programId, codeWithExt] = file.name.split("-");
            const code = codeWithExt.split(".")[0].toUpperCase();
            return programId === programIdFilter && codeFilters.includes(code);
          })
          .sort((a, b) => {
            const codeA = a.name.split("-")[1].split(".")[0].toUpperCase();
            const codeB = b.name.split("-")[1].split(".")[0].toUpperCase();
            return codeFilters.indexOf(codeA) - codeFilters.indexOf(codeB);
          })
      : [];

  const handlePlay = (url, index) => {
    if (currentAudio) currentAudio.pause();
    const audioEl = new Audio(url);
    audioEl.play();
    setCurrentAudio(audioEl);
    setPlayingIndex(index);
    audioEl.onended = () => {
      setCurrentAudio(null);
      setPlayingIndex(null);
    };
  };

  const handleStop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingIndex(null);
    }
  };

console.log("audioFiles", audioFiles)

  return (
    <div className="play-container2">
      {audioFiles.length === 0 ? (
        <p>No audio files found for this program.</p>
      ) : (
        audioFiles.map((audio, index) => (
          <div className="play" key={audio.name}>
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

export default Test;
