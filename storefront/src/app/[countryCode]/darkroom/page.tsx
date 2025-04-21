// storefront/src/app/[countryCode]/darkroom/page.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"
import { HexColorPicker } from "react-colorful"
import { usePathname } from "next/navigation"

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)

  const [mode, setMode] = useState<"select" | "draw" | "text">("select")
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(4)
  const [textValue, setTextValue] = useState("")
  const [side, setSide] = useState<"front" | "back">("front")

  const mockup = "/mockups/il_fullxfull.6008848563_7wnj.avif"

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 800,
        selection: true,
      })
      fabricRef.current = canvas

      fabric.Image.fromURL(mockup, (img) => {
        const half = img.width! / 2
        img.set({
          cropX: side === "front" ? 0 : half,
          cropY: 0,
          width: half,
          height: img.height!,
          scaleX: 600 / half,
          scaleY: 800 / img.height!,
          selectable: false,
          evented: false,
        })
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
      })
    }
    return () => {
      fabricRef.current?.dispose()
    }
  }, [side])

  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.isDrawingMode = mode === "draw"
    if (mode === "draw") {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
      canvas.freeDrawingBrush.color = color
      canvas.freeDrawingBrush.width = brushSize
    }
  }, [mode, color, brushSize])

  const addText = () => {
    if (!textValue.trim()) return
    const canvas = fabricRef.current
    const text = new fabric.Textbox(textValue, {
      left: 100,
      top: 100,
      fontSize: 28,
      fill: color,
      fontFamily: "Arial",
      editable: true,
    })
    canvas?.add(text)
    setTextValue("")
  }

  const handlePrint = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 5 })
    const link = document.createElement("a")
    link.download = `gmorkl_darkroom_${side}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="px-4 py-10 max-w-screen-lg mx-auto font-sans">
      <h1 className="text-4xl uppercase tracking-wider font-medium mb-6">
        Darkroom Editor
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Controls */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <div className="flex gap-2">
            <button
              onClick={() => setSide("front")}
              className={`border px-3 py-1 uppercase text-sm tracking-wide ${
                side === "front" ? "bg-black text-white" : ""
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setSide("back")}
              className={`border px-3 py-1 uppercase text-sm tracking-wide ${
                side === "back" ? "bg-black text-white" : ""
              }`}
            >
              Back
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode("select")}
              className={`border px-3 py-1 uppercase text-sm tracking-wide ${
                mode === "select" ? "bg-black text-white" : ""
              }`}
            >
              Move
            </button>
            <button
              onClick={() => setMode("draw")}
              className={`border px-3 py-1 uppercase text-sm tracking-wide ${
                mode === "draw" ? "bg-black text-white" : ""
              }`}
            >
              Draw
            </button>
            <button
              onClick={() => setMode("text")}
              className={`border px-3 py-1 uppercase text-sm tracking-wide ${
                mode === "text" ? "bg-black text-white" : ""
              }`}
            >
              Text
            </button>
          </div>

          {mode === "text" && (
            <>
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter text"
                className="border p-2 text-sm"
              />
              <button
                onClick={addText}
                className="border px-3 py-1 text-sm uppercase hover:bg-black hover:text-white"
              >
                Add Text
              </button>
            </>
          )}

          <div>
            <label className="block text-sm uppercase mb-1">Color</label>
            <HexColorPicker color={color} onChange={setColor} />
          </div>

          {mode === "draw" && (
            <>
              <label className="text-sm uppercase">Brush Size</label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
              />
            </>
          )}

          <button
            onClick={handlePrint}
            className="border px-4 py-2 uppercase text-sm tracking-wide mt-6 hover:bg-black hover:text-white"
          >
            Print
          </button>
        </div>

        {/* Canvas */}
        <div className="w-full md:w-2/3 border border-black">
          <canvas ref={canvasRef} width={600} height={800} className="w-full h-auto" />
        </div>
      </div>
    </div>
  )
}
