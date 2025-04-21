"use client"

import { useEffect, useRef, useState } from "react"

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawing = useRef(false)

  const [brushColor, setBrushColor] = useState("red")
  const [brushSize, setBrushSize] = useState(10)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 800

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const getCoords = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const startDrawing = (e: MouseEvent) => {
      isDrawing.current = true
      draw(e)
    }

    const stopDrawing = () => {
      isDrawing.current = false
      ctx?.beginPath()
    }

    const draw = (e: MouseEvent) => {
      if (!isDrawing.current) return

      const { x, y } = getCoords(e)
      ctx.fillStyle = brushColor
      ctx.beginPath()
      ctx.arc(x, y, brushSize, 0, 2 * Math.PI)
      ctx.fill()
    }

    canvas.addEventListener("mousedown", startDrawing)
    canvas.addEventListener("mouseup", stopDrawing)
    canvas.addEventListener("mouseout", stopDrawing)
    canvas.addEventListener("mousemove", draw)

    return () => {
      canvas.removeEventListener("mousedown", startDrawing)
      canvas.removeEventListener("mouseup", stopDrawing)
      canvas.removeEventListener("mouseout", stopDrawing)
      canvas.removeEventListener("mousemove", draw)
    }
  }, [brushColor, brushSize])

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex gap-4 items-center">
        <label className="text-sm uppercase tracking-wide">Brush size</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
        <label className="text-sm uppercase tracking-wide">Color</label>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
        />
      </div>

      <div className="border border-gray-300 w-full max-w-[800px] aspect-square">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  )
}
