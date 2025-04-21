"use client"

import { useEffect, useRef } from "react"

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Размер canvas
    canvas.width = 800
    canvas.height = 800

    // Заливка чёрным
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Обработка кликов — рисуем красный кружок
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ctx.fillStyle = "red"
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, 2 * Math.PI)
      ctx.fill()
    }

    canvas.addEventListener("click", handleClick)
    return () => {
      canvas.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <div className="border border-gray-300 w-full max-w-[800px] aspect-square">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
