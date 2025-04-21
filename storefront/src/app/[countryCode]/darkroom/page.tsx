"use client"

import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"
import { usePathname } from "next/navigation"

const mockupImage = "/mockups/il_fullxfull.6008848563_7wnj.avif"

export default function DarkroomEditor() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const canvasRef = useRef(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const [side, setSide] = useState<"front" | "back">("front")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const canvas = new fabric.Canvas(canvasEl, {
      preserveObjectStacking: true,
      selection: true,
    })

    fabricRef.current = canvas

    fabric.Image.fromURL(mockupImage, (img) => {
      img.scaleToWidth(450)
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
    })

    return () => {
      canvas.dispose()
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const imageUrl = reader.result as string
      setUploadedImage(imageUrl)
      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          left: 150,
          top: 150,
          scaleX: 0.5,
          scaleY: 0.5,
          hasControls: true,
          hasBorders: true,
        })
        fabricRef.current?.add(img).setActiveObject(img)
      })
    }
    reader.readAsDataURL(file)
  }

  const handlePrint = () => {
    const canvas = fabricRef.current
    if (!canvas) return

    const exportCanvas = canvas.toDataURL({ format: "png", multiplier: 4 })
    const link = document.createElement("a")
    link.href = exportCanvas
    link.download = `gmorkl_${side}_mockup.png`
    link.click()
  }

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto font-sans">
      <h1 className="text-4xl tracking-wider font-medium uppercase mb-6">
        Darkroom Editor
      </h1>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 w-full sm:w-1/3">
          <input
            type="file"
            onChange={handleImageUpload}
            className="text-sm border border-black px-2 py-1 cursor-pointer uppercase tracking-wider"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setSide("front")}
              className={`px-4 py-1 border uppercase text-sm tracking-wider transition ${
                side === "front" ? "bg-black text-white" : ""
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setSide("back")}
              className={`px-4 py-1 border uppercase text-sm tracking-wider transition ${
                side === "back" ? "bg-black text-white" : ""
              }`}
            >
              Back
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="mt-4 px-6 py-2 border border-black uppercase tracking-wider hover:bg-black hover:text-white"
          >
            Print
          </button>
        </div>

        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={600}
            height={750}
            className="border border-black w-full"
          />
        </div>
      </div>
    </div>
  )
}
