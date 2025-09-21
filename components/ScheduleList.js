import React, { useState } from 'react'

export default function ScheduleList() {
    const [after, setAfter] = useState(10)
    return (

        <main className="w-[800px]  rounded-lg h-[200px] mt-6 flex gap-4 text-blue-900">
            {/* Timer Card */}
            <div className="w-full border rounded-lg  bg-white p-6 flex flex-col">
                {/* Title */}
                <div className="h-5 flex  items-center justify-center">
                    <p className="text-sm text-gray-500">Schedule - Stage 01</p>
                </div>

                {/* <div className="text-center">
                <div className="flexitems-center justify-center gap-2 font-normal text-base mt-1">
                    After
                    <input type="text" className='border w-12 text-center' name="" id="" /> Results
                </div>
            </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-2 gap-y-1 p-4">
                   
                    <button className="border border-gray-300 text-nowrap overflow-hidden rounded-lg py-1.5 text-sm px-2 hover:bg-blue-500 hover:text-white transition-colors font-medium ">
                        S Kathaprasangam Malayalam
                    </button>
                    <button className="border border-gray-300 rounded-lg  py-1.5 text-sm px-2 bg-white hover:bg-blue-500 hover:text-white transition-colors font-medium ">
                        Primer
                    </button>
                    <button className="border border-gray-300 rounded-lg  py-1.5 text-sm px-2 bg-white hover:bg-blue-500 hover:text-white transition-colors font-medium ">
                        SubJunior
                    </button>
                    <button className="border border-gray-300 rounded-lg  py-1.5 text-sm px-2 bg-white hover:bg-blue-500 hover:text-white transition-colors font-medium ">
                        Junior
                    </button>
                    <button className="border border-gray-300 rounded-lg  py-1.5 text-sm px-2 bg-white hover:bg-blue-500 hover:text-white transition-colors font-medium ">
                        Senior
                    </button>


                </div>
            </div>

          

        </main>



    )
}
