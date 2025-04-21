"use client"

import { useEffect, useRef } from "react"
import { fabric } from "fabric"
import { useDarkroomStore } from "./store"
import Toolbar from "./Toolbar"
import ExportButton from "./ExportButton"

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { tool, color, brushSize } = useDarkroomStore()

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: "#0b0b0b",
    })

    fabric.Canvas.activeInstance = canvas

    const handleDraw = () => {
      canvas.isDrawingMode = tool === "draw"
      if (tool === "draw") {
        const brush = new fabric.PencilBrush(canvas)
        brush.width = brushSize
        brush.color = color
        canvas.freeDrawingBrush = brush
      }
    }

    handleDraw()

    return () => {
      canvas.dispose()
    }
  }, [tool, brushSize, color])

  return (
    <div className="text-white font-sans">
      <Toolbar />
      <canvas
        ref={canvasRef}
        width={500}
        height={600}
        className="border border-white bg-[#0b0b0b]"
      />
      <ExportButton canvasRef={canvasRef} />
    </div>
  )
}
