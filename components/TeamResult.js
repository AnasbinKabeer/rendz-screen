import React, { useState } from 'react'

export default function TeamResult() {
    const [after, setAfter] = useState(10)
    return (

        <main className="w-[800px]  rounded-lg h-[200px] mt-6 flex gap-4 text-blue-900">
            {/* Timer Card */}
            <div className="w-1/2 border rounded-lg  bg-white p-6 flex flex-col">
                {/* Title */}
                <div className="h-5 flex  items-center justify-center">
                    <p className="text-sm text-gray-500">Team Point</p>
                </div>

                {/* <div className="text-center">
                <div className="flexitems-center justify-center gap-2 font-normal text-base mt-1">
                    After
                    <input type="text" className='border w-12 text-center' name="" id="" /> Results
                </div>
            </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 p-4">
                    <div className='text-sm border border-zinc-200 bg-zinc-50 rounded-lg flex gap-2 items-center justify-center text-violet-600'>
                        <p> after </p>
                        <input type="text" onChange={(e)=> setAfter(e.target.value)} value={after} name="" id="" className='border w-8 text-center rounded-lg' />
                        <p>results</p>

                    </div>
                    <button className="border border-gray-300  rounded-lg py-1.5 text-sm px-2 hover:bg-blue-500 hover:text-white transition-colors font-medium ">
                        Minor
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

            {/* Timer Controller Card */}
            <div className="w-1/2 border rounded-lg  bg-white p-6 flex flex-col">
                {/* Title */}
                <div className="h-5 flex  items-center justify-center">
                    <p className="text-sm text-gray-500">Campus Order</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-4">
                    <button className="border border-gray-300 rounded-lg text-sm py-1 px-2 text-white bg-blue-600 hover:bg-blue-500 hover:text-white transition-colors font-medium ">
                        1
                    </button>
                    <button className="border border-gray-300 rounded-lg text-sm  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        2
                    </button>
                    <button className="border border-gray-300 rounded-lg text-sm  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        3
                    </button>
                    <button className="border border-gray-300 rounded-lg text-sm  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        4
                    </button>
                    <button className="border border-gray-300 rounded-lg text-sm  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        5
                    </button>

                    <button className="border border-gray-300 text-sm rounded-lg py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        6
                    </button>
                    <button className="border border-gray-300 text-sm rounded-lg  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        7
                    </button>
                    <button className="border border-gray-300 text-sm rounded-lg  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        8
                    </button>
                    <button className="border border-gray-300 text-sm rounded-lg  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        9
                    </button>
                    <button className="border border-gray-300 text-sm rounded-lg  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        10
                    </button>
                        <button className="border border-gray-300 text-sm rounded-lg py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        11
                    </button>
                    <button className="border border-gray-300 text-sm rounded-lg  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        12
                    </button>
                    <button className="border border-gray-300 text-sm rounded-lg  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        13
                    </button>
                    <button className="border border-gray-300 text-sm rounded-lg  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        14
                    </button>
                    <button className="border border-gray-300 text-sm rounded-lg  py-1 px-2 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors font-medium ">
                        15
                    </button>
                </div>

                <div className="flex flex-1 gap-5 items-center justify-center">



                </div>



            </div>

        </main>



    )
}
