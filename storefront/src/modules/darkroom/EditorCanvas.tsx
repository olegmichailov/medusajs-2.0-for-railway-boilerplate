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
    console.log("EditorCanvas mounted")

    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: "#0b0b0b",
      selection: true,
    })

    fabric.Canvas.activeInstance = canvas

    return () => {
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    const canvas = fabric.Canvas.activeInstance
    if (!canvas) return

    console.log("Tool or brush settings changed:", { tool, color, brushSize })

    if (tool === "draw") {
      const brush = new fabric.PencilBrush(canvas)
      brush.width = brushSize
      brush.color = color
      canvas.freeDrawingBrush = brush
      canvas.isDrawingMode = true
    } else {
      canvas.isDrawingMode = false
    }
  }, [tool, brushSize, color])

  return (
    <div className="w-full font-sans text-white">
      <h2 className="text-xl mb-4">Hello from Darkroom</h2>

      <Toolbar />
      <ExportButton />

      <canvas
        ref={canvasRef}
        width={500}
        height={600}
        style={{ border: "2px dashed red" }}
        className="bg-[#0b0b0b]"
      />
    </div>
  )
}
