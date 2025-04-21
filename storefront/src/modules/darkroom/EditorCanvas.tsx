// src/app/[countryCode]/darkroom/page.tsx

'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Rnd } from 'react-rnd'

const DarkroomEditor = () => {
  const [image, setImage] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 200, height: 200 })

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-1/4 p-6 border-r border-black">
        <h1 className="text-3xl tracking-wider font-[505] mb-6">DARKROOM EDITOR</h1>
        <div>
          <p className="font-semibold mb-2">UPLOAD PRINT</p>
          <input type="file" onChange={handleUpload} className="mb-4" />
          <p className="text-sm text-gray-600">Drag, scale, rotate print freely</p>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative w-3/4 flex items-center justify-center bg-white overflow-hidden">
        <div className="relative w-[600px] h-[800px]">
          <Image
            src="/mockups/MOCAP_FRONT_BACK.png"
            alt="Mockup Hoodie"
            layout="fill"
            objectFit="contain"
            priority
          />

          {image && (
            <Rnd
              bounds="parent"
              size={{ width: size.width, height: size.height }}
              position={{ x: position.x, y: position.y }}
              onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
              onResizeStop={(_, __, ref, ___, pos) => {
                setSize({
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                })
                setPosition(pos)
              }}
            >
              <img
                src={image}
                alt="Uploaded design"
                className="w-full h-full object-contain pointer-events-auto border border-black"
              />
            </Rnd>
          )}
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(DarkroomEditor), { ssr: false })
