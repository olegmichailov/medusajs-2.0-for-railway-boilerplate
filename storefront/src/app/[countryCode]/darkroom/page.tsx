// storefront/src/app/[countryCode]/darkroom/page.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function DarkroomPage() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [scale, setScale] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds || !imageSrc) return

    const offsetX = e.clientX - bounds.left
    const offsetY = e.clientY - bounds.top

    setPosition({ x: offsetX, y: offsetY })
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6">
      <h1 className="text-4xl font-medium tracking-wider uppercase">
        Darkroom
      </h1>

      <div className="flex gap-4 flex-col sm:flex-row">
        {/* Upload Area */}
        <div className="w-full sm:w-1/2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="uppercase font-normal border border-black rounded-none"
          >
            Upload your design
          </Button>
        </div>

        {/* Mockup Area */}
        <div className="w-full sm:w-1/2 relative border border-black" ref={containerRef}>
          <Image
            src="/mockups/il_570xN.6002672805_egkj.avif"
            alt="T-Shirt Mockup"
            width={500}
            height={600}
            className="w-full h-auto"
          />
          {imageSrc && (
            <div
              onClick={handleDrag}
              className="absolute cursor-move"
              style={{
                top: position.y,
                left: position.x,
                transform: `translate(-50%, -50%) scale(${scale})`,
              }}
            >
              <Image
                src={imageSrc}
                alt="Uploaded design"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
