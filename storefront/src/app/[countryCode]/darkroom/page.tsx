// storefront/src/app/[countryCode]/darkroom/page.tsx

"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

const mockups = [
  {
    name: "Front Side",
    filename: "/mockups/il_fullxfull.6008848563_7wnj.avif",
  },
  {
    name: "Back Side",
    filename: "/mockups/il_570xN.6002672805_egkj.avif",
  },
]

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [selectedMockup, setSelectedMockup] = useState(mockups[0].filename)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [textElements, setTextElements] = useState<{ id: number; text: string; x: number; y: number; rotation: number; scale: number }[]>([])
  const [activeTextId, setActiveTextId] = useState<number | null>(null)
  const [freehandStrokes, setFreehandStrokes] = useState<string[]>([])
  const [drawing, setDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

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

  const handleAddText = () => {
    const newId = Date.now()
    setTextElements((prev) => [...prev, { id: newId, text: "New Text", x: 100, y: 100, rotation: 0, scale: 1 }])
    setActiveTextId(newId)
  }

  const handlePrint = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const mockupImg = new Image()
    mockupImg.src = selectedMockup
    mockupImg.onload = () => {
      canvas.width = mockupImg.width
      canvas.height = mockupImg.height
      ctx.drawImage(mockupImg, 0, 0)

      if (uploadedImage && imageRef.current) {
        ctx.drawImage(imageRef.current, 150, 150, 300, 300)
      }

      textElements.forEach((el) => {
        ctx.save()
        ctx.translate(el.x, el.y)
        ctx.rotate((el.rotation * Math.PI) / 180)
        ctx.scale(el.scale, el.scale)
        ctx.fillStyle = "black"
        ctx.font = "24px sans-serif"
        ctx.fillText(el.text, 0, 0)
        ctx.restore()
      })

      const link = document.createElement("a")
      link.download = `gmorkl_mockup_final.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="px-6 py-10 font-sans">
      <h1 className="text-4xl uppercase tracking-wider font-medium mb-6">Darkroom Editor</h1>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="border p-2 text-sm uppercase tracking-wide"
          />

          <div className="flex gap-2">
            {mockups.map((m) => (
              <button
                key={m.filename}
                onClick={() => setSelectedMockup(m.filename)}
                className={`border px-4 py-2 uppercase tracking-wide text-sm font-medium transition-colors hover:bg-black hover:text-white ${
                  selectedMockup === m.filename ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddText}
            className="border border-black px-4 py-2 text-sm uppercase tracking-wide"
          >
            Add Text
          </button>

          <button
            onClick={handlePrint}
            className="border border-black px-4 py-2 text-sm uppercase tracking-wide"
          >
            Print
          </button>
        </div>

        <div className="relative flex-1 border border-black">
          <Image
            src={selectedMockup}
            alt="Mockup Preview"
            width={600}
            height={800}
            className="w-full h-auto"
          />

          {uploadedImage && (
            <img
              ref={imageRef}
              src={uploadedImage}
              alt="Uploaded"
              className="absolute top-[30%] left-[30%] w-32 h-32 opacity-80"
            />
          )}

          {textElements.map((el) => (
            <div
              key={el.id}
              style={{
                position: "absolute",
                top: el.y,
                left: el.x,
                transform: `rotate(${el.rotation}deg) scale(${el.scale})`,
              }}
              className="text-black font-medium cursor-move"
              onClick={() => setActiveTextId(el.id)}
              contentEditable={activeTextId === el.id}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const updated = e.currentTarget.innerText
                setTextElements((prev) =>
                  prev.map((t) => (t.id === el.id ? { ...t, text: updated } : t))
                )
              }}
            >
              {el.text}
            </div>
          ))}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  )
}
