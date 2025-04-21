"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const mockups = [
  {
    name: "Front",
    filename: "/mockups/il_fullxfull.6008848563_7wnj.avif",
    side: "left",
  },
  {
    name: "Back",
    filename: "/mockups/il_570xN.6002672805_egkj.avif",
    side: "right",
  },
]

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [selectedMockup, setSelectedMockup] = useState(mockups[0])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setUploadedImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handlePrint = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !uploadedImage) return

    const mockupImg = new Image()
    mockupImg.src = selectedMockup.filename
    mockupImg.onload = () => {
      canvas.width = mockupImg.width / 2
      canvas.height = mockupImg.height

      const sx = selectedMockup.side === "left" ? 0 : mockupImg.width / 2
      ctx.drawImage(
        mockupImg,
        sx,
        0,
        mockupImg.width / 2,
        mockupImg.height,
        0,
        0,
        mockupImg.width / 2,
        mockupImg.height
      )

      const uploaded = imageRef.current
      if (uploaded) {
        const centerX = canvas.width / 2 + offsetX
        const centerY = canvas.height / 2 + offsetY
        const imgWidth = uploaded.width * scale
        const imgHeight = uploaded.height * scale

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.drawImage(
          uploaded,
          -imgWidth / 2,
          -imgHeight / 2,
          imgWidth,
          imgHeight
        )
        ctx.restore()

        const link = document.createElement("a")
        link.download = `gmorkl_mockup_${selectedMockup.name}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  return (
    <div className="px-4 py-10 sm:px-10 max-w-7xl mx-auto font-sans">
      <h1 className="text-4xl tracking-wider font-medium uppercase mb-6">
        Darkroom Editor
      </h1>

      <div className="flex flex-col sm:flex-row gap-10">
        {/* Controls */}
        <div className="flex flex-col gap-6 w-full sm:w-1/3">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="text-sm tracking-wide uppercase border border-black p-2"
          />

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
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
          />

          <label className="text-sm uppercase tracking-wide">Move X</label>
          <input
            type="range"
            min={-200}
            max={200}
            step={5}
            value={offsetX}
            onChange={(e) => setOffsetX(parseInt(e.target.value))}
          />

          <label className="text-sm uppercase tracking-wide">Move Y</label>
          <input
            type="range"
            min={-200}
            max={200}
            step={5}
            value={offsetY}
            onChange={(e) => setOffsetY(parseInt(e.target.value))}
          />

          <Button onClick={handlePrint}>Print to Mockup</Button>

          <div className="flex gap-2 mt-4">
            {mockups.map((m) => (
              <button
                key={m.name}
                onClick={() => setSelectedMockup(m)}
                className={`border text-xs px-2 py-1 tracking-wider uppercase hover:bg-black hover:text-white transition ${
                  selectedMockup.name === m.name
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mockup View */}
        <div className="relative w-full sm:w-2/3 border border-black aspect-[3/4]">
          <Image
            src={selectedMockup.filename}
            alt="Mockup preview"
            fill
            className="object-contain"
          />

          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Preview"
              ref={imageRef}
              className="absolute top-1/2 left-1/2 w-32 opacity-80 pointer-events-none"
              style={{
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`
              }}
            />
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  )
}
