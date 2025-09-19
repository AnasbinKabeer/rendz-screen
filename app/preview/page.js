'use client'
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.on("data-updated", (incoming) => {
        console.log("Preview received:", incoming);
        setData(incoming);
      });
    }
  }, []);



  return (
     <div className={`w-full h-screen flex items-center justify-center ${data?.code === "" ? "bg-green-600" : "bg-black"} overflow-hidden`}>
    
      {/* Center letter */}
      <h1 className="relative  text-[400px] font-black text-white tracking-tighter drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
        {data?.code || ""}
      </h1>
    </div>
  );
}
