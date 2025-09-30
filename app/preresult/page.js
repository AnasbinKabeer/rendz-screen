"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const Page = () => {
    const [receivedData, setReceivedData] = useState(null);
    const lettersRef = useRef([]);
    const campusNameRef = useRef(null);
    const windowRef = useRef(null);

    useEffect(() => {
        if (window.electron?.receive) {
            window.electron.receive("data-updated", (data) => {
                console.log("Received Data:", data);
                setReceivedData(data);
                lettersRef.current = [];
            });
        } else {
            // Demo data
            setReceivedData({
                id: "14",
                name: "Madh Song",
                category: "Senior",
                rank: "1",
                studentName: "Sayyid Hussain Jamalullaily",
                campusName: "Markaz Garden PG1",
            });
        }
    }, []);

    useEffect(() => {
        if (receivedData?.studentName) {
            gsap.killTweensOf(lettersRef.current);

            gsap.fromTo(
                lettersRef.current,
                { y: 20, opacity: 0, scale: 0.8 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "power2.out",
                }
            );

            if (campusNameRef.current) {
                gsap.fromTo(
                    campusNameRef.current,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        delay: 1.5,
                        ease: "power2.out",
                    }
                );
            }
        }
    }, [receivedData]);

    const splitAndCapitalize = (text) => {
        if (!text) return [];
        return text
            .split(" ")
            .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")
            .split("");
    };

    return (
        <div className="w-full h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 flex items-center justify-center">
            {receivedData && (
                <div
                    ref={windowRef}
                    className="w-full h-screen relative overflow-hidden text-white px-10"
                >
                    {/* Background Accent */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20 blur-sm" />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        {/* Header */}
                        <div className="w-full flex justify-between mt-6">
                            <div className="flex items-center gap-8 text-amber-300">
                                <p className=" px-5 h-14 bg-gradient-to-r from-orange-500 to-amber-400 text-black flex items-center justify-center font-bold text-2xl rounded-2xl shadow-lg">
                                    Result {receivedData.id}
                                </p>
                                <p className="capitalize tracking-wide text-xl sm:text-2xl">
                                    {receivedData.name} ({receivedData.category})
                                </p>
                            </div>
                            <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 text-[100px] drop-shadow-md">
                                #{receivedData.rank}
                            </p>
                        </div>

                        {/* Main Student Name */}
                        <div className="flex flex-col items-center justify-center text-center mt-12">
                            <div className="text-[10vw] leading-[120px] text-center font-[MLU-Jwala] break-words whitespace-normal">
                                {splitAndCapitalize(receivedData.studentName).map((char, index) => (
                                    <span
                                        key={index}
                                        ref={(el) => (lettersRef.current[index] = el)}
                                        className="inline"
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>


                            {/* Campus Name */}
                            <div
                                ref={campusNameRef}
                                className="text-[3vw] opacity-0 mt-6 uppercase tracking-widest text-amber-100 font-semibold drop-shadow-md"
                            >
                                {receivedData.campusName}
                            </div>
                        </div>

                        {/* Footer bar */}
                        <div className="w-full h-2 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 rounded-full shadow-lg mt-12" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
