"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { fabric } from "fabric"

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: "#fff",
    })

    // Example object
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 150,
      height: 100,
      angle: 0,
    })

    canvas.add(rect)

    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    <div className="flex justify-center items-center border border-gray-300 p-4">
      <canvas ref={canvasRef} width={500} height={600} />
    </div>
  )
}
