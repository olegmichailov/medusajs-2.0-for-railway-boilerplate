"use client"

import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"
import Image from "next/image"

const mockups = {
  front: "/mockups/il_fullxfull.6008848563_7wnj.avif",
  back: "/mockups/il_570xN.6002672805_egkj.avif",
}

export default function EditorCanvas() {
  const [selectedView, setSelectedView] = useState<'front' | 'back'>('front')
  const [brushSize, setBrushSize] = useState(10)
  const [color, setColor] = useState("#00ff00")
  const [mode, setMode] = useState<'draw' | 'move'>('draw')
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 1500,
      height: 1875,
      backgroundColor: "black",
      preserveObjectStacking: true,
    })
    canvasRef.current = canvas
    fabric.Object.prototype.transparentCorners = false
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
    canvas.freeDrawingBrush.color = color
    canvas.freeDrawingBrush.width = brushSize
    canvas.isDrawingMode = mode === "draw"

    return () => {
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.freeDrawingBrush.color = color
      canvasRef.current.freeDrawingBrush.width = brushSize
      canvasRef.current.isDrawingMode = mode === "draw"
    }
  }, [color, brushSize, mode])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canvasRef.current) return

    const reader = new FileReader()
    reader.onload = () => {
      fabric.Image.fromURL(reader.result as string, (img) => {
        img.set({
          left: 300,
          top: 400,
          scaleX: 0.5,
          scaleY: 0.5,
          selectable: true,
        })
        canvasRef.current?.add(img)
      })
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    canvasRef.current?.getObjects().forEach((obj) => {
      if (obj !== canvasRef.current?.backgroundImage) {
        canvasRef.current?.remove(obj)
      }
    })
  }

  useEffect(() => {
    if (!canvasRef.current) return

    fabric.Image.fromURL(mockups[selectedView], (img) => {
      img.scaleToWidth(1500)
      img.scaleToHeight(1875)
      canvasRef.current?.setBackgroundImage(img, canvasRef.current.renderAll.bind(canvasRef.current))
    })
  }, [selectedView])

  return (
    <div className="flex px-6 pt-10 gap-10">
      {/* Sidebar */}
      <div className="flex flex-col gap-4 w-1/4">
        <div>
          <label className="text-xs uppercase tracking-wide">Brush Size</label>
          <input
            type="range"
            min={1}
            max={50}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full appearance-none bg-black h-[2px] rounded"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 border"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('draw')}
            className={`border px-3 py-1 text-sm uppercase ${mode === 'draw' ? 'bg-black text-white' : 'bg-white'}`}
          >
            Draw
          </button>
          <button
            onClick={() => setMode('move')}
            className={`border px-3 py-1 text-sm uppercase ${mode === 'move' ? 'bg-black text-white' : 'bg-white'}`}
          >
            Move
          </button>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('front')}
            className={`border px-3 py-1 text-sm uppercase ${selectedView === 'front' ? 'bg-black text-white' : 'bg-white'}`}
          >
            Front
          </button>
          <button
            onClick={() => setSelectedView('back')}
            className={`border px-3 py-1 text-sm uppercase ${selectedView === 'back' ? 'bg-black text-white' : 'bg-white'}`}
          >
            Back
          </button>
        </div>

        <button
          onClick={handleClear}
          className="border px-3 py-2 text-sm uppercase"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div ref={canvasWrapperRef} className="w-3/4">
        <canvas id="canvas" style={{ transform: "scale(0.5)", transformOrigin: "top left" }} />
      </div>
    </div>
  )
}
