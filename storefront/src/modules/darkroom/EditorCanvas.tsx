// ✅ NEW Darkroom Editor with mockup front image, image upload and transformable print
"use client"

import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"
import Image from "next/image"

export default function DarkroomEditor() {
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  // Init canvas
  useEffect(() => {
    const c = new fabric.Canvas("darkroom-canvas", {
      preserveObjectStacking: true,
    })
    setCanvas(c)
    return () => c.dispose()
  }, [])

  // Load mockup (left half only)
  useEffect(() => {
    if (!canvas) return
    fabric.Image.fromURL("/mockups/MOCAP_FRONT_BACK.png", (img) => {
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        scaleX: 0.5,
      })
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleY: canvas.height ? canvas.height / img.height! : 1,
      })
    })
  }, [canvas])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canvas) return
    const reader = new FileReader()
    reader.onload = function (f) {
      const data = f.target?.result as string
      fabric.Image.fromURL(data, (img) => {
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.2,
          scaleY: 0.2,
        })
        canvas.add(img)
        canvas.setActiveObject(img)
      })
    }
    reader.readAsDataURL(file)
  }

  const handleExport = () => {
    if (!canvas) return
    const dataURL = canvas.toDataURL({ format: "png", multiplier: 4 })
    const link = document.createElement("a")
    link.href = dataURL
    link.download = "print.png"
    link.click()
  }

  return (
    <div className="flex gap-6 px-6 pt-6">
      {/* Sidebar */}
      <div className="w-64 flex flex-col gap-4">
        <label className="text-xs">UPLOAD PRINT</label>
        <input type="file" onChange={handleUpload} />
        <button
          onClick={handleExport}
          className="border border-black px-3 py-1 uppercase text-xs"
        >
          Print
        </button>
      </div>

      {/* Canvas area */}
      <div className="flex-1">
        <canvas
          id="darkroom-canvas"
          ref={canvasRef as any}
          width={1500}
          height={1087}
          className="border"
        />
      </div>
    </div>
  )
}
