import React, { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const mockups = [
  { id: "front", src: "/mockups/il_fullxfull.6008848563_7wnj.avif" },
  { id: "back", src: "/mockups/il_570xN.6002672805_egkj.avif" },
]

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mockup, setMockup] = useState(mockups[0])
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

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
    mockupImg.src = mockup.src
    mockupImg.onload = () => {
      canvas.width = mockupImg.width
      canvas.height = mockupImg.height
      ctx.drawImage(mockupImg, 0, 0)

      const uploaded = imageRef.current
      if (uploaded) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
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
      }

      const link = document.createElement("a")
      link.download = `gmorkl_mockup_${mockup.id}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="px-4 py-10 sm:px-10 max-w-5xl mx-auto font-sans">
      <h1 className="text-4xl tracking-wider font-medium uppercase mb-6">
        Darkroom Editor
      </h1>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1">
          <div className="border border-black p-2 mb-4">
            <input
              type="file"
              onChange={handleImageUpload}
              className="text-lg uppercase tracking-wider cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {mockups.map((m) => (
              <button
                key={m.id}
                onClick={() => setMockup(m)}
                className={`border px-2 py-1 uppercase text-sm tracking-wider hover:bg-black hover:text-white transition ${
                  mockup.id === m.id ? "bg-black text-white" : ""
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-1">
              Zoom
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
            </label>
            <label className="flex items-center gap-1">
              Rotate
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
              />
            </label>
          </div>

          <Button onClick={handlePrint}>Print to Mockup</Button>
        </div>

        <div className="flex-1 relative border border-black p-2">
          <Image
            src={mockup.src}
            alt="Mockup"
            width={600}
            height={800}
            className="w-full h-auto"
          />
          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Preview"
              ref={imageRef}
              className="absolute top-1/3 left-1/3 w-32 opacity-80 pointer-events-none"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`
              }}
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  )
}
