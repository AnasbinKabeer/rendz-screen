"use client";
import { useState, useEffect, useRef } from "react";
import { storage } from "../firerbase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdFiberManualRecord } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
import { gsap } from "gsap";
import { CircleCheckBig } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useProgrameContext } from "@/context/programContext";

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { selectedDeviceId, setSelectedDeviceId, codeData } = useProgrameContext();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const savedIconRef = useRef(null);
  const sample = 4028

  const fileName = codeData ? `${codeData.program}-${codeData.code}` : "unknown";

  const [savedFiles, setSavedFiles] = useState(() => {
  // Load saved files from localStorage
  try {
    return JSON.parse(localStorage.getItem("savedFiles")) || {};
  } catch {
    return {};
  }
});
  // Fetch audio devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devicesList = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devicesList.filter(
          (device) => device.kind === "audioinput"
        );
        setDevices(audioInputDevices);

        if (!selectedDeviceId && audioInputDevices.length > 0) {
          setSelectedDeviceId(audioInputDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error accessing devices:", error);
      }
    };

    getDevices();
    navigator.mediaDevices.ondevicechange = getDevices;

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      navigator.mediaDevices.ondevicechange = null;
    };
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
      });

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      visualize();

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        audioChunksRef.current = [];
      };

      setRecording(true);
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      setRecording(false);
      mediaRecorderRef.current.stop();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Upload audio with animation
  const uploadToFirebase = async () => {
  if (audioBlob && fileName) {
    try {
      setIsSaving(true);

      const fileRef = ref(storage, `audio/${fileName}.webm`);
      await uploadBytes(fileRef, audioBlob);
      await getDownloadURL(fileRef);

      // Mark as saved
      const newSavedFiles = { ...savedFiles, [fileName]: true };
      setSavedFiles(newSavedFiles);
      localStorage.setItem("savedFiles", JSON.stringify(newSavedFiles));

      setIsSaving(false);

    } catch (error) {
      setIsSaving(false);
      console.error("Upload failed:", error);
    }
  } else {
    alert("Please record audio first!");
  }
};


  // Audio visualization
  const visualize = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barHeights = new Array(bufferLength).fill(0);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      dataArray.forEach((value, i) => {
        const targetHeight = (value / 255) * canvas.height;
        gsap.to(barHeights, { duration: 0.2, [i]: targetHeight, ease: "power2.out" });
        const barHeight = barHeights[i];

        const r = 255 - value;
        const g = value;
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  return (
    <div className="w-[300px] flex-1 p-4 mt-8 bg-white border border-zinc-200 rounded-lg flex flex-col gap-4 text-gray-900">
      <div className="text-center pt-2 pb-4 text-zinc-500 text-sm font-medium">Audio Recorder</div>

      {/* File info + saving status */}
      <div className="text-xs flex justify-between px-1 h-5 b">
        <p className="text-zinc-400">
          File Name: <span className="text-blue-600">{fileName}</span>
        </p>

      <p className="flex items-center gap-1 text-green-700">
  {savedFiles[fileName] ? (
    <span className="flex gap-1">
      Saved <CircleCheckBig size={18} />
    </span>
  ) : (
     <span className="flex text-red-500">
      Not Saved
    </span>
  )}
</p>
      </div>

      {/* Device selector */}
      <div className="flex gap-4">
        <label className="text-sm">Input:</label>
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          className="border w-50 text-xs"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="flex-1 w-full mt-4"
        style={{ border: "1px solid #ccc", borderRadius: "10px", background: "#000" }}
      ></canvas>

      {/* Buttons */}
      <div className="flex gap-1 mt-2">
        {!recording ? (
          <button
            className="flex justify-center items-center gap-1 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={startRecording}
            disabled={recording}
          >
            <MdFiberManualRecord size={18} /> Record
          </button>
        ) : (
          <button
            className="flex justify-center items-center gap-1 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={stopRecording}
            disabled={!recording}
          >
            <FaStop size={18} /> Stop
          </button>
        )}

        <button
  className={`flex justify-center items-center gap-2 w-full px-4 py-2 rounded text-white ${
    isSaving || !audioBlob || !fileName ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
  }`}
  onClick={uploadToFirebase}
  disabled={!audioBlob || !fileName || isSaving}
>
  {isSaving ? (
    <>
      <Loader2 className="animate-spin" size={18} /> Saving
    </>
  ) : (
    <>
      <FaSave /> Save
    </>
  )}
</button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
