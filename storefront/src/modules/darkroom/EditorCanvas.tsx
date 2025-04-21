// storefront/src/app/[countryCode]/darkroom/page.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import { Rnd } from "react-rnd"
import { fabric } from "fabric"
import Image from "next/image"
import { usePathname } from "next/navigation"

const MOCKUP_SRC = "/mockups/il_fullxfull.6008848563_7wnj.avif"

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)

  const [brushSize, setBrushSize] = useState(10)
  const [brushColor, setBrushColor] = useState("#000000")
  const [mode, setMode] = useState<"draw" | "move">("draw")
  const [uploadedImages, setUploadedImages] = useState<
    { src: string; id: string }[]
  >([])

  const CANVAS_WIDTH = 1500
  const CANVAS_HEIGHT = 1087
  const SCALE = 3

  useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH * SCALE,
      height: CANVAS_HEIGHT * SCALE,
      selection: false,
    })

    fabricCanvas.setBackgroundColor("#000000", () => {})
    fabricCanvas.isDrawingMode = true
    fabricCanvas.freeDrawingBrush.color = brushColor
    fabricCanvas.freeDrawingBrush.width = brushSize * SCALE
    fabricCanvas.renderAll()

    fabricRef.current = fabricCanvas

    return () => {
      fabricCanvas.dispose()
    }
  }, [])

  useEffect(() => {
    if (!fabricRef.current) return
    fabricRef.current.isDrawingMode = mode === "draw"
    if (fabricRef.current.freeDrawingBrush) {
      fabricRef.current.freeDrawingBrush.width = brushSize * SCALE
      fabricRef.current.freeDrawingBrush.color = brushColor
    }
  }, [brushSize, brushColor, mode])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return

    const reader = new FileReader()
    reader.onload = () => {
      fabric.Image.fromURL(reader.result as string, (img) => {
        img.scaleToWidth(CANVAS_WIDTH * SCALE * 0.5)
        img.set({ left: CANVAS_WIDTH * SCALE * 0.25, top: CANVAS_HEIGHT * SCALE * 0.25 })
        img.set({ hasControls: true, hasBorders: true, selectable: true })
        fabricRef.current!.add(img).setActiveObject(img)
        fabricRef.current!.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    if (!fabricRef.current) return
    fabricRef.current.getObjects().forEach((obj) => {
      if (obj !== fabricRef.current!.backgroundImage) {
        fabricRef.current!.remove(obj)
      }
    })
    fabricRef.current.renderAll()
  }

  return (
    <div className="flex flex-col sm:flex-row w-full h-full px-6 pt-10 gap-8">
      {/* Controls */}
      <div className="w-full sm:w-1/3 flex flex-col gap-4">
        <h1 className="text-4xl uppercase tracking-wider font-medium mb-4">Darkroom Editor</h1>

        <label className="text-sm uppercase tracking-wider">Upload Print</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="text-sm border border-black p-2"
        />

        <label className="text-sm uppercase tracking-wider pt-4">Brush Size</label>
        <input
          type="range"
          min={1}
          max={50}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="appearance-none h-1 bg-black rounded-full"
        />

        <label className="text-sm uppercase tracking-wider pt-4">Color</label>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="w-10 h-10 border border-black"
        />

        <label className="text-sm uppercase tracking-wider pt-4">Mode</label>
        <div className="flex gap-4">
          <button
            onClick={() => setMode("draw")}
            className={`px-4 py-2 text-sm border ${
              mode === "draw" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Draw
          </button>
          <button
            onClick={() => setMode("move")}
            className={`px-4 py-2 text-sm border ${
              mode === "move" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Move
          </button>
        </div>

        <button
          onClick={handleClear}
          className="mt-4 px-4 py-2 text-sm border border-black hover:bg-black hover:text-white transition"
        >
          Clear
        </button>
      </div>

      {/* Mockup Canvas */}
      <div className="w-full sm:w-2/3 relative flex justify-center items-center">
        {/* Background image */}
        <div
          className="absolute"
          style={{
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            overflow: "hidden",
          }}
        >
          <Image
            src={MOCKUP_SRC}
            alt="Mockup"
            width={3000}
            height={2174}
            style={{ objectFit: "cover", objectPosition: "left", width: "100%", height: "100%" }}
          />
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH * SCALE}
          height={CANVAS_HEIGHT * SCALE}
          style={{
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            pointerEvents: "auto",
          }}
        />
      </div>
    </div>
  )
}
