"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function DarkroomPage() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [scale, setScale] = useState(1)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  return (
    <div className="px-4 sm:px-8 py-10">
      <h1 className="text-4xl font-[505] tracking-wider mb-6 uppercase">
        Darkroom
      </h1>

      <div className="flex flex-col sm:flex-row gap-10">
        {/* Editor Panel */}
        <div className="flex-1 space-y-4">
          <label className="block">
            <span className="uppercase tracking-widest text-sm mb-1 block">
              Upload Your Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border px-4 py-2 w-full text-sm"
            />
          </label>

          <label className="block">
            <span className="uppercase tracking-widest text-sm mb-1 block">
              Scale
            </span>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>

        {/* Mockup Canvas */}
        <div
          className="relative w-full sm:w-[400px] h-[500px] border"
          onClick={handleDrag}
        >
          <Image
            src="/mockup-shirt-front.jpg"
            alt="Shirt Mockup"
            fill
            style={{ objectFit: "contain" }}
            className="pointer-events-none"
          />

          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Uploaded design"
              className="absolute pointer-events-none"
              style={{
                width: `${100 * scale}px`,
                height: "auto",
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link
          href={`/${countryCode}/account`}
          className="px-6 py-2 border border-black text-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          Confirm & Save
        </Link>
      </div>
    </div>
  )
}
