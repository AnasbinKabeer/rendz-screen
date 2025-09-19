// 'use client'
// import { useState, useEffect, useRef, useContext } from "react";
// import { storage } from "../firerbase/firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { gsap } from "gsap";



// export default function VoiceRecorderSample() {
//  const [recording, setRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [audioURL, setAudioURL] = useState(null);
//   const [devices, setDevices] = useState([]);
//   const [selectedDeviceId, setSelectedDeviceId] = useState("");
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   // const [devices] = useState([
//   //   { deviceId: "1", label: "Microphone 1" },
//   //   { deviceId: "2", label: "Microphone 2" },
//   // ]);
//   // const [selectedDeviceId, setSelectedDeviceId] = useState("1");


//     const canvasRef = useRef(null);
//   const analyserRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   const fileName = "APK123"


//    useEffect(() => {
//     const getDevices = async () => {
//       try {
//         const devicesList = await navigator.mediaDevices.enumerateDevices();
//         const audioInputDevices = devicesList.filter(
//           (device) => device.kind === "audioinput"
//         );
//         setDevices(audioInputDevices);
//         if (audioInputDevices.length > 0) {
//           setSelectedDeviceId(audioInputDevices[0].deviceId);
//         }
//       } catch (error) {
//         console.error("Error accessing devices:", error);
//       }
//     };

//     getDevices();

//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//       if (audioContextRef.current) {
//         audioContextRef.current.close();
//       }
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
//       });

//       // Set up Web Audio API
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 256;

//       const source = audioContext.createMediaStreamSource(stream);
//       source.connect(analyser);

//       audioContextRef.current = audioContext;
//       analyserRef.current = analyser;

//       visualize();

//       // MediaRecorder setup
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       mediaRecorderRef.current.ondataavailable = (e) => {
//         audioChunksRef.current.push(e.data);
//       };
//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//         setAudioBlob(blob);
//         setAudioURL(URL.createObjectURL(blob));
//         audioChunksRef.current = [];
//       };
//       setRecording(true);
//       mediaRecorderRef.current.start();
//     } catch (error) {
//       console.error("Error starting recording:", error);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && recording) {
//       setRecording(false);
//       mediaRecorderRef.current.stop();
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     }
//   };

//   const uploadToFirebase = async () => {
//     if (audioBlob && fileName) {
//       const fileRef = ref(storage, `audio/${fileName}.webm`);
//       await uploadBytes(fileRef, audioBlob);
//       const downloadURL = await getDownloadURL(fileRef);
//       alert(`File uploaded successfully: ${downloadURL}`);
//     } else {
//       alert("Please provide a file name and record audio!");
//     }
//   };

//   const visualize = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const analyser = analyserRef.current;
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     const draw = () => {
//       analyser.getByteFrequencyData(dataArray);

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const barWidth = (canvas.width / bufferLength) * 1.5;
//       let x = 0;

//       dataArray.forEach((value, i) => {
//         const barHeight = value * 0.5;
//         const r = 255 - value;
//         const g = value * 0.5;
//         const b = 50;

//         ctx.fillStyle = `rgb(${r},${g},${b})`;
//         ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

//         x += barWidth + 1;

//         // GSAP animation
//         gsap.to(ctx, { duration: 0.2, ease: "power2.out" });
//       });

//       animationFrameRef.current = requestAnimationFrame(draw);
//     };

//     draw();
//   };


//   return (
//     <div className="w-[300px] p-4 mt-2 bg-white rounded-lg shadow-md flex flex-col gap-4">
//       <div className="text-center text-gray-800  font-medium">Voice Recorder</div>

//       {/* Device Selector */}
//       <div className="flex flex-col">
//         <label className="mb-1 text-gray-800 text-sm font-medium">Input Device:</label>
//         <select
//           value={selectedDeviceId}
//           onChange={(e) => setSelectedDeviceId(e.target.value)}
//           className="border text-gray-800 border-gray-300 rounded px-3 py-2"
//         >
//           {devices.map((device) => (
//             <option className="text-gray-800" key={device.deviceId} value={device.deviceId}>
//               {device.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Canvas */}
//       <canvas
//         ref={canvasRef}
//         width="280"
//         height="100"
//         style={{
//           border: "1px solid #ccc",
//           borderRadius: "10px",
//          background:"#000",
//           marginTop: "20px",
//         }}
//       ></canvas>
// <div className="flex gap-1">
  
//       {/* Record / Stop Button */}
//       {!recording ? (
//         <button
//           className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           onClick={() => setRecording(true)}
//         >
//           Record
//         </button>
//       ) : (
//         <button
//           className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           onClick={() => setRecording(false)}
//         >
//           Stop
//         </button>
//       )}

//       {/* Save Button */}
//       <button
//         className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         disabled={false}
//       >
//         Save
//       </button>
// </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef, useContext } from "react";
import { storage } from "../firerbase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdFiberManualRecord } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";


import { gsap } from "gsap";
import './VoiceRecorder.css'
import { CircleCheckBig } from "lucide-react";

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
 

 const fileName = "APK123"
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devicesList = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devicesList.filter(
          (device) => device.kind === "audioinput"
        );
        setDevices(audioInputDevices);
        if (audioInputDevices.length > 0) {
          setSelectedDeviceId(audioInputDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error accessing devices:", error);
      }
    };

    getDevices();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
      });

      // Set up Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      visualize();

      // MediaRecorder setup
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      setRecording(false);
      mediaRecorderRef.current.stop();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const uploadToFirebase = async () => {
    if (audioBlob && fileName) {
      const fileRef = ref(storage, `audio/${fileName}.webm`);
      await uploadBytes(fileRef, audioBlob);
      const downloadURL = await getDownloadURL(fileRef);
      alert(`File uploaded successfully: ${downloadURL}`);
    } else {
      alert("Please provide a file name and record audio!");
    }
  };




  const visualize = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      dataArray.forEach((value, i) => {
        const barHeight = value * 0.5;
        const r = 255 - value;
        const g = value * 0.5;
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;

        // GSAP animation
        gsap.to(ctx, { duration: 0.2, ease: "power2.out" });
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  return (
 <div className="w-[300px]  p-4 mt-8 bg-white rounded-lg shadow-md flex flex-col gap-4 text-gray-900">   
 <div className="text-center pt-2 pb-4  text-gray-800  font-medium">Voice Recorder</div>
 <div className="text-xs px- flex justify-between">
      <p className="font-bold"> File Name:  <span className=" text-blue-600"> {fileName}</span></p> <p className="flex items-center gap-1 text-green-700">Saved <CircleCheckBig size={20}/></p>
      </div>
      <div className="flex gap-4 ">
      
        <label className="text-sm">
        Input:
         
        </label>

         <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value) }
            className="border w-50 text-xs"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId}`}
              </option>
            ))}
          </select>
      </div>
 
      <canvas
        ref={canvasRef}
        width="280"
        height="100"
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
         background:"#000",
          marginTop: "20px",
        }}
      ></canvas>

      <div className="flex gap-1">
  
    {!recording ? (
        <button
          className="flex cursor-pointer justify-center text-sm items-center gap-1 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
         onClick={startRecording} disabled={recording}
        ><MdFiberManualRecord size={18}/>

          Record
        </button>
      ) : (
        <button
          className="flex cursor-pointer justify-center text-sm items-center gap-1 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={stopRecording} disabled={!recording}
        >
          <FaStop ize={18}/>
          Stop
        </button>
      )}

      {/* Save Button */}
      <button
        className="flex cursor-pointer justify-center items-center text-sm gap-2 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={uploadToFirebase} disabled={!audioBlob || !fileName}>
          <FaSave />

        Save
      </button>

</div> 
  


{/* { !recording? <button className="record-btn" onClick={startRecording} disabled={recording}>
          Record
        </button> : 
     <button  className="stop-btn" onClick={stopRecording} disabled={!recording}>
     Stop
   </button>}

       
      
        <button onClick={uploadToFirebase} disabled={!audioBlob || !fileName}>
          Save
        </button> */}
    </div>
  );
};

export default VoiceRecorder;