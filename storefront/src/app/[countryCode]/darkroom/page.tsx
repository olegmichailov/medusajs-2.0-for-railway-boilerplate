// storefront/src/app/[countryCode]/darkroom/page.tsx

"use client"

import { usePathname } from "next/navigation"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Draggable from "react-draggable"

const mockups = [
  {
    name: "Mockup A",
    src: "/mockups/il_fullxfull.6008848563_7wnj.avif",
  },
  {
    name: "Mockup B",
    src: "/mockups/il_570xN.6002672805_egkj.avif",
  },
]

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [selectedMockup, setSelectedMockup] = useState(mockups[0])
  const [side, setSide] = useState<"front" | "back">("front")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [texts, setTexts] = useState<string[]>([])
  const [activeText, setActiveText] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [textColor, setTextColor] = useState("black")

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handlePrint = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !uploadedImage) return

    const mockupImg = new Image()
    mockupImg.src = selectedMockup.src
    mockupImg.onload = () => {
      canvas.width = mockupImg.width / 2
      canvas.height = mockupImg.height
      const offsetX = side === "front" ? 0 : mockupImg.width / 2
      ctx.drawImage(
        mockupImg,
        offsetX,
        0,
        mockupImg.width / 2,
        mockupImg.height,
        0,
        0,
        canvas.width,
        canvas.height
      )

      const uploaded = new Image()
      uploaded.src = uploadedImage
      uploaded.onload = () => {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.drawImage(
          uploaded,
          -uploaded.width * scale / 2,
          -uploaded.height * scale / 2,
          uploaded.width * scale,
          uploaded.height * scale
        )
        ctx.restore()

        const link = document.createElement("a")
        link.download = `gmorkl_mockup_${selectedMockup.name}_${side}.png`
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
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <label className="block uppercase text-sm">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />

          <label className="block uppercase text-sm">Add Text</label>
          <input
            type="text"
            className="border p-2 text-sm w-full"
            placeholder="Enter your text"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value) {
                setTexts([...texts, e.currentTarget.value])
                e.currentTarget.value = ""
              }
            }}
          />

          <label className="block uppercase text-sm">Mockup</label>
          <div className="flex gap-2 flex-wrap">
            {mockups.map((m) => (
              <button
                key={m.src}
                onClick={() => setSelectedMockup(m)}
                className={`border px-2 py-1 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition ${
                  selectedMockup.src === m.src ? "bg-black text-white" : ""
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <label className="block uppercase text-sm">Side</label>
          <div className="flex gap-2">
            <button
              className={`border px-3 py-1 uppercase text-sm tracking-wider hover:bg-black hover:text-white transition ${
                side === "front" ? "bg-black text-white" : ""
              }`}
              onClick={() => setSide("front")}
            >
              Front
            </button>
            <button
              className={`border px-3 py-1 uppercase text-sm tracking-wider hover:bg-black hover:text-white transition ${
                side === "back" ? "bg-black text-white" : ""
              }`}
              onClick={() => setSide("back")}
            >
              Back
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <label className="text-sm">Zoom</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
            <label className="text-sm">Rotate</label>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={rotation}
              onChange={(e) => setRotation(parseFloat(e.target.value))}
            />
          </div>

          <Button onClick={handlePrint} className="mt-6">
            Print to Mockup
          </Button>
        </div>

        <div className="flex-1 relative border border-black aspect-[4/5]">
          <Image
            src={selectedMockup.src}
            alt="Mockup"
            fill
            className="object-cover"
            style={{ objectPosition: side === "front" ? "left" : "right" }}
          />
          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Preview"
              style={{
                position: "absolute",
                top: "30%",
                left: "30%",
                width: "120px",
                opacity: 0.8,
                transform: `scale(${scale}) rotate(${rotation}deg)`
              }}
            />
          )}
          {texts.map((text, i) => (
            <Draggable key={i}>
              <div
                style={{
                  position: "absolute",
                  top: `${35 + i * 10}%`,
                  left: "35%",
                  color: textColor,
                  fontWeight: 500,
                }}
                className="cursor-move select-none text-lg"
              >
                {text}
              </div>
            </Draggable>
          ))}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  )
}
