"use client"

import { useEffect, useRef, useState } from "react"

export default function DarkroomEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const [brushColor, setBrushColor] = useState("#00ff00")
  const [brushSize, setBrushSize] = useState(5)
  const [background, setBackground] = useState<string | null>(null)

  let lastX = 0
  let lastY = 0

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const ctx = canvas.getContext("2d")
    if (ctx) ctx.fillStyle = "black"
    ctx?.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getCoords = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if (e instanceof MouseEvent) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    } else {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
  }

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    isDrawing.current = true
    const { x, y } = getCoords(e)
    lastX = x
    lastY = y
  }

  const endDrawing = () => {
    isDrawing.current = false
  }

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoords(e)
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()

    lastX = x
    lastY = y
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBackground(reader.result as string)
    reader.readAsDataURL(file)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <div className="px-6 pt-10">
      <h1 className="text-4xl tracking-wider uppercase mb-8 font-medium">Darkroom Editor</h1>

      <div className="flex items-center gap-4 mb-6">
        <label className="uppercase text-sm">Brush size</label>
        <input
          type="range"
          min="1"
          max="30"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
        <label className="uppercase text-sm">Color</label>
        <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
        <button
          onClick={clearCanvas}
          className="border border-black px-3 py-1 text-xs uppercase tracking-wider hover:bg-black hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="mb-6">
        <label className="uppercase text-sm mr-4">Upload Background</label>
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      <div className="relative aspect-square w-full sm:w-2/3 border border-gray-300">
        {background && (
          <img
            src={background}
            alt="Background"
            className="absolute w-full h-full object-contain"
          />
        )}
        <canvas
          ref={canvasRef}
          className="absolute w-full h-full"
          onMouseDown={startDrawing as any}
          onMouseMove={draw as any}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing as any}
          onTouchMove={draw as any}
          onTouchEnd={endDrawing}
        />
      </div>
    </div>
  )
}
