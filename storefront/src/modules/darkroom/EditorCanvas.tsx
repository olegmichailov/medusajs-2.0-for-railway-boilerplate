"use client"

import { useRef, useState, useEffect } from "react"
import { Rnd } from "react-rnd"
import Image from "next/image"

export default function DarkroomEditor() {
  const [brushColor, setBrushColor] = useState("#00ff00")
  const [brushSize, setBrushSize] = useState(5)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true
    const rect = canvasRef.current!.getBoundingClientRect()
    lastPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false
    lastPointRef.current = null
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx || !lastPointRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"

    ctx.beginPath()
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    ctx.lineTo(currentPoint.x, currentPoint.y)
    ctx.stroke()

    lastPointRef.current = currentPoint
  }

  const handleClearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setBackgroundImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="px-6 pt-10">
      <h1 className="text-4xl tracking-wider uppercase mb-8 font-medium">
        Darkroom Editor
      </h1>

      <div className="flex flex-col gap-4 mb-6">
        <label className="text-sm uppercase tracking-wide">Brush Size</label>
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

        <button
          onClick={handleClearCanvas}
          className="border px-3 py-1 text-sm w-fit"
        >
          Clear
        </button>

        <label className="text-sm uppercase tracking-wide mt-4">
          Upload Background
        </label>
        <input type="file" accept="image/*" onChange={handleBackgroundUpload} />

        <label className="text-sm uppercase tracking-wide mt-2">
          Upload Print
        </label>
        <input type="file" accept="image/*" onChange={handleUploadImage} />
      </div>

      <div className="relative w-full max-w-3xl aspect-square border border-gray-300">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-contain"
            style={{ zIndex: 0 }}
          />
        )}

        {uploadedImage && (
          <Rnd
            default={{ x: 100, y: 100, width: 200, height: 200 }}
            bounds="parent"
          >
            <Image
              src={uploadedImage}
              alt="Uploaded"
              fill
              className="object-contain"
            />
          </Rnd>
        )}

        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onMouseMove={handleCanvasMouseMove}
          className="absolute top-0 left-0 w-full h-full z-10"
        />
      </div>
    </div>
  )
}
