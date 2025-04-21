import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"

export default function DarkroomEditor() {
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 900,
      height: 1080,
      backgroundColor: "white",
      preserveObjectStacking: true,
    })

    fabric.Image.fromURL("/mockups/MOCAP_FRONT_BACK.png", (img) => {
      const frontHalf = new fabric.Image(img.getElement(), {
        left: 0,
        top: 0,
        scaleX: 0.5,
        scaleY: 0.5,
        selectable: false,
      })
      fabricCanvas.setBackgroundImage(frontHalf, fabricCanvas.renderAll.bind(fabricCanvas))
    })

    setCanvas(fabricCanvas)

    return () => {
      fabricCanvas.dispose()
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataURL = reader.result as string
      setImageURL(dataURL)
      if (!canvas) return

      fabric.Image.fromURL(dataURL, (img) => {
        img.set({
          left: 300,
          top: 300,
          scaleX: 0.5,
          scaleY: 0.5,
          cornerColor: "black",
          cornerSize: 10,
        })
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-1/3 p-6">
        <h1 className="text-3xl font-bold mb-4">DARKROOM EDITOR</h1>
        <label className="block mb-2">UPLOAD PRINT</label>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <p className="text-sm mt-2 text-gray-600">Drag, scale, rotate print freely</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
