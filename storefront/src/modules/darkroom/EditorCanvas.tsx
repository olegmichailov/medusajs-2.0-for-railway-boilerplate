// storefront/src/app/[countryCode]/darkroom/page.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Rnd } from "react-rnd"

export default function DarkroomPage() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imagePosition, setImagePosition] = useState({ x: 100, y: 100 })
  const [imageSize, setImageSize] = useState({ width: 200, height: 200 })

  const mockup = "/mockups/il_fullxfull.6008848563_7wnj.avif" // Front side for now

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="px-6 pt-10">
      <h1 className="text-4xl tracking-wider uppercase mb-8 font-medium">
        Darkroom Editor
      </h1>

      <div className="flex flex-col gap-4 max-w-4xl">
        {/* Upload Print */}
        <label className="text-sm uppercase tracking-wide">Upload Print</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="border border-black p-2 text-sm"
        />

        {/* Mockup with Overlay */}
        <div className="relative w-full aspect-[4/5] border border-gray-300 bg-black">
          <Image
            src={mockup}
            alt="Mockup preview"
            fill
            className="object-contain"
            priority
          />

          {uploadedImage && (
            <Rnd
              bounds="parent"
              size={imageSize}
              position={imagePosition}
              onDragStop={(e, d) => setImagePosition({ x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                setImageSize({
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                })
                setImagePosition(position)
              }}
            >
              <img
                src={uploadedImage}
                alt="Uploaded Print"
                className="w-full h-full object-contain"
              />
            </Rnd>
          )}
        </div>
      </div>
    </div>
  )
}
