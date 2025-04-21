"use client"

import { useEffect, useRef } from "react"

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  return (
    <div className="border border-gray-400 w-full max-w-2xl aspect-square">
      <canvas ref={canvasRef} width={500} height={500} />
    </div>
  )
}
