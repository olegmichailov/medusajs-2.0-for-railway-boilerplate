"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

const mockupSrc = "/mockups/il_fullxfull.6008848563_7wnj.avif" // один файл с front/back

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [side, setSide] = useState<"front" | "back">("front")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 200, y: 200 })
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left - 50,
      y: e.clientY - rect.top - 50,
    })
  }

  const handlePrint = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !uploadedImage) return

    const mockup = new Image()
    mockup.src = mockupSrc
    mockup.onload = () => {
      const width = 2400 // hi-res for 300dpi at ~20cm width
      const height = 3000
      canvas.width = width
      canvas.height = height

      const half = mockup.width / 2
      ctx.drawImage(
        mockup,
        side === "front" ? 0 : half,
        0,
        half,
        mockup.height,
        0,
        0,
        width,
        height
      )

      const img = new Image()
      img.src = uploadedImage
      img.onload = () => {
        ctx.save()
        ctx.translate(position.x * 4, position.y * 4) // scale to hi-res
        ctx.rotate((rotation * Math.PI) / 180)
        const w = img.width * scale * 4
        const h = img.height * scale * 4
        ctx.drawImage(img, -w / 2, -h / 2, w, h)
        ctx.restore()

        const a = document.createElement("a")
        a.download = `gmorkl_darkroom_${side}.png`
        a.href = canvas.toDataURL()
        a.click()
      }
    }
  }

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto font-sans">
      <h1 className="text-4xl tracking-wider uppercase font-medium mb-6">
        Darkroom Editor
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left panel */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="uppercase tracking-wider text-sm border border-black p-2"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setSide("front")}
              className={`border px-4 py-1 text-sm uppercase tracking-wider transition hover:bg-black hover:text-white ${side === "front" ? "bg-black text-white" : ""}`}
            >
              Front
            </button>
            <button
              onClick={() => setSide("back")}
              className={`border px-4 py-1 text-sm uppercase tracking-wider transition hover:bg-black hover:text-white ${side === "back" ? "bg-black text-white" : ""}`}
            >
              Back
            </button>
          </div>

          <label className="text-sm uppercase tracking-wide">Zoom</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />

          <label className="text-sm uppercase tracking-wide">Rotate</label>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
          />

          <button
            onClick={handlePrint}
            className="border mt-4 px-4 py-2 tracking-wider uppercase hover:bg-black hover:text-white"
          >
            Print
          </button>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-1/2 relative border border-black aspect-[4/5] overflow-hidden">
          <Image
            src={mockupSrc}
            alt="Mockup"
            fill
            className="object-cover"
            style={{ objectPosition: side === "front" ? "left" : "right" }}
          />
          {uploadedImage && (
            <div
              className="absolute w-28 h-28 cursor-move"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleDrag}
              style={{
                top: position.y,
                left: position.x,
                transform: `scale(${scale}) rotate(${rotation}deg)`,
              }}
            >
              <img
                ref={imageRef}
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  )
}
