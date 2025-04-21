// src/app/[countryCode]/darkroom/page.tsx

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Rnd } from 'react-rnd'

export default function DarkroomPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [size, setSize] = useState({ width: 200, height: 200 })

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-1/3 p-4 border-r border-gray-300">
        <h1 className="text-xl font-semibold mb-4">Upload Print</h1>
        <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />
        <p className="text-sm text-gray-500">Drag to position the print on the mockup.</p>
      </div>

      {/* Canvas Area */}
      <div className="relative w-2/3 bg-white flex items-center justify-center overflow-hidden">
        <div className="relative w-[750px] h-[1087px]">
          <Image
            src="/mockups/MOCAP_FRONT_BACK.png"
            alt="Mockup"
            fill
            style={{ objectFit: 'cover', objectPosition: 'left' }}
            priority
          />

          {imageSrc && (
            <Rnd
              bounds="parent"
              size={size}
              position={position}
              onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
              onResizeStop={(_, __, ref, ___, position) => {
                setSize({ width: ref.offsetWidth, height: ref.offsetHeight })
                setPosition(position)
              }}
            >
              <img src={imageSrc} alt="User print" className="w-full h-full object-contain" />
            </Rnd>
          )}
        </div>
      </div>
    </div>
  )
}
