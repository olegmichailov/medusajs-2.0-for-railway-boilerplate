"use client"

import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"
import { HexColorPicker } from "react-colorful"

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)

  const [tool, setTool] = useState<"draw" | "select" | "text">("select")
  const [color, setColor] = useState("#ffffff")
  const [brushSize, setBrushSize] = useState(4)
  const [textInput, setTextInput] = useState("")

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: "#0b0b0b",
      selection: true,
    })

    fabricRef.current = canvas

    return () => {
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    canvas.isDrawingMode = tool === "draw"

    if (tool === "draw") {
      const brush = new fabric.PencilBrush(canvas)
      brush.width = brushSize
      brush.color = color
      canvas.freeDrawingBrush = brush
    }
  }, [tool, brushSize, color])

  const handleExport = () => {
    const canvas = fabricRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 4 })
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = "gmorkl_darkroom_editor.png"
    link.click()
  }

  const handleAddText = () => {
    const canvas = fabricRef.current
    if (!canvas || !textInput.trim()) return

    const text = new fabric.Textbox(textInput, {
      left: 100,
      top: 100,
      fontSize: 28,
      fill: color,
      fontFamily: "Arial",
      editable: true,
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.requestRenderAll()
    setTextInput("")
  }

  return (
    <div className="w-full font-sans text-white">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <button
          onClick={() => setTool("select")}
          className={`px-3 py-1 uppercase text-sm tracking-wide border ${
            tool === "select" ? "bg-white text-black" : "bg-black border-white"
          }`}
        >
          Select
        </button>
        <button
          onClick={() => setTool("draw")}
          className={`px-3 py-1 uppercase text-sm tracking-wide border ${
            tool === "draw" ? "bg-white text-black" : "bg-black border-white"
          }`}
        >
          Draw
        </button>
        <button
          onClick={() => setTool("text")}
          className={`px-3 py-1 uppercase text-sm tracking-wide border ${
            tool === "text" ? "bg-white text-black" : "bg-black border-white"
          }`}
        >
          Text
        </button>

        {tool === "draw" && (
          <div className="flex items-center gap-2">
            <label className="text-sm uppercase">Brush</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        )}

        {tool === "text" && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add text..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="px-2 py-1 text-black text-sm"
            />
            <button
              onClick={handleAddText}
              className="border px-3 py-1 text-sm uppercase hover:bg-white hover:text-black"
            >
              Add
            </button>
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        )}

        <button
          onClick={handleExport}
          className="ml-auto px-4 py-2 uppercase text-sm tracking-wider border border-white hover:bg-white hover:text-black"
        >
          Print
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={600}
        className="border border-white bg-[#0b0b0b]"
      />
    </div>
  )
}
