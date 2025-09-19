'use client'
import React, { useState } from 'react'

export default function Page() {
    const [isActive, setIsActive] = useState(1)
  return (
    <div className={`flex flex-1 h-screen ${isActive? "bg-amber-950":" bg-green-700"}`}>page</div>
  )
}
