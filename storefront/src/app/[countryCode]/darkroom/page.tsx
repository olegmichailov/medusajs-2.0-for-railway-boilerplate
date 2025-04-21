"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

const mockups = [
  {
    id: "mockup-a",
    name: "Mockup A",
    src: "/mockups/il_fullxfull.6008848563_7wnj.avif",
  },
  {
    id: "mockup-b",
    name: "Mockup B",
    src: "/mockups/il_570xN.6002672805_egkj.avif",
  },
]

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mockup, setMockup] = useState(mockups[0])
  const [side, setSide] = useState<"front" | "back">("front")
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
  }

  const handlePrint = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !uploadedImage) return

    const mockupImg = new Image()
    mockupImg.src = mockup.src
    mockupImg.onload = () => {
      canvas.width = mockupImg.width / 2
      canvas.height = mockupImg.height

      const sx = side === "front" ? 0 : mockupImg.width / 2
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

      const printImg = new Image()
      printImg.src = uploadedImage
      printImg.onload = () => {
        ctx.save()
        ctx.translate(position.x, position.y)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.drawImage(
          printImg,
          -printImg.width * scale / 2,
          -printImg.height * scale / 2,
          printImg.width * scale,
          printImg.height * scale
        )
        ctx.restore()

        const link = document.createElement("a")
        link.download = `gmorkl_${mockup.id}_${side}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  return (
    <div className="px-6 pt-10 pb-20 font-sans max-w-screen-xl mx-auto">
      <h1 className="text-4xl tracking-wider uppercase mb-8 font-medium">
        Darkroom Editor
      </h1>

      <div className="flex flex-col sm:flex-row gap-10">
        {/* Tools */}
        <div className="flex flex-col gap-6 w-full sm:w-1/3">
          <input
            type="file"
            onChange={handleImageUpload}
            className="text-sm tracking-wider uppercase"
          />

          <div className="flex gap-2 flex-wrap">
            {mockups.map((m) => (
              <button
                key={m.id}
                onClick={() => setMockup(m)}
                className={`border px-3 py-1 text-sm uppercase tracking-wider hover:bg-black hover:text-white transition ${
                  mockup.id === m.id ? "bg-black text-white" : ""
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              className={`border px-3 py-1 text-sm uppercase ${
                side === "front" ? "bg-black text-white" : ""
              }`}
              onClick={() => setSide("front")}
            >
              FRONT
            </button>
            <button
              className={`border px-3 py-1 text-sm uppercase ${
                side === "back" ? "bg-black text-white" : ""
              }`}
              onClick={() => setSide("back")}
            >
              BACK
            </button>
          </div>

          <label className="text-xs">Zoom</label>
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />

          <label className="text-xs">Rotation</label>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
          />

          <button
            onClick={handlePrint}
            className="mt-4 border px-4 py-2 text-sm uppercase tracking-wider hover:bg-black hover:text-white"
          >
            Print
          </button>
        </div>

        {/* Mockup Preview */}
        <div className="relative flex-1 border border-black overflow-hidden">
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative w-full aspect-[3/4] select-none"
          >
            <Image
              src={mockup.src}
              alt="mockup"
              fill
              className="object-contain"
              style={{ objectPosition: side === "front" ? "left" : "right" }}
            />
            {uploadedImage && (
              <img
                src={uploadedImage}
                ref={imageRef}
                style={{
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  width: 100 * scale,
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`
                }}
                className="pointer-events-none opacity-90"
                alt="print"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
    </div>
  )
}
