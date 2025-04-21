import { useEffect, useRef } from "react"
import { fabric } from "fabric"

export default function EditorCanvas() {
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const canvasWidth = 1000
  const canvasHeight = 1200

  useEffect(() => {
    const canvas = new fabric.Canvas("editor-canvas", {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#fff",
      preserveObjectStacking: true,
    })

    // Load mockup and cut front part (left half)
    fabric.Image.fromURL("/mockups/MOCAP_FRONT_BACK.png", (img) => {
      const halfWidth = img.width / 2
      const front = new fabric.Image(img.getElement(), {
        left: 0,
        top: 0,
        scaleX: canvasWidth / halfWidth,
        scaleY: canvasHeight / img.height,
        cropX: 0,
        cropY: 0,
        width: halfWidth,
        height: img.height,
        selectable: false,
        evented: false,
      })
      canvas.setBackgroundImage(front, canvas.renderAll.bind(canvas))
    })

    canvasRef.current = canvas
    return () => canvas.dispose()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = function (f) {
      fabric.Image.fromURL(f.target.result, (img) => {
        img.set({
          left: canvasWidth / 2 - img.width / 4,
          top: canvasHeight / 2 - img.height / 4,
          scaleX: 0.5,
          scaleY: 0.5,
          hasRotatingPoint: true,
          cornerStyle: "circle",
          transparentCorners: false,
          cornerColor: "black",
        })
        canvasRef.current.add(img)
        canvasRef.current.setActiveObject(img)
        canvasRef.current.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex w-full h-screen">
      <div className="w-[320px] p-4 border-r border-black">
        <h2 className="font-semibold text-lg mb-4">DARKROOM EDITOR</h2>
        <label className="text-sm font-semibold block mb-2">UPLOAD PRINT</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="mb-4"
        />
        <p className="text-xs">Drag, scale, rotate print freely</p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <canvas id="editor-canvas" className="border" />
      </div>
    </div>
  )
}
