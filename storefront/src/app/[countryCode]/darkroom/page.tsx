// storefront/src/app/[countryCode]/darkroom/page.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"
import { usePathname } from "next/navigation"
import Image from "next/image"

const mockup = {
  name: "Mockup A",
  src: "/mockups/il_fullxfull.6008848563_7wnj.avif"
}

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [side, setSide] = useState<"front" | "back">("front")
  const [imgLoaded, setImgLoaded] = useState(false)
  const [mockupImg, setMockupImg] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (canvasEl.current && !canvasRef.current) {
      const canvas = new fabric.Canvas(canvasEl.current, {
        width: 600,
        height: 800,
        selection: true,
      })
      canvasRef.current = canvas
    }
  }, [])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImgLoaded(true)
      setMockupImg(img)
    }
    img.src = mockup.src
  }, [])

  useEffect(() => {
    if (!imgLoaded || !mockupImg || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.clear()

    const width = mockupImg.width / 2
    const height = mockupImg.height
    const sideOffset = side === "front" ? 0 : width

    const mockupFabricImg = new fabric.Image(mockupImg, {
      left: 0,
      top: 0,
      scaleX: 600 / width,
      scaleY: 800 / height,
      cropX: sideOffset,
      cropY: 0,
      width,
      height,
      selectable: false,
      evented: false,
    })

    canvas.setBackgroundImage(mockupFabricImg, canvas.renderAll.bind(canvas))
  }, [imgLoaded, side])

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      fabric.Image.fromURL(reader.result as string, (img) => {
        img.set({ left: 200, top: 200, scaleX: 0.4, scaleY: 0.4 })
        canvasRef.current?.add(img)
      })
    }
    reader.readAsDataURL(file)
  }

  const handleAddText = () => {
    const text = new fabric.Textbox("Your text", {
      left: 150,
      top: 150,
      fontSize: 24,
      fill: "black",
      fontFamily: "Barlow Condensed",
    })
    canvasRef.current?.add(text)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL({ format: "png" })
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `gmorkl-${side}.png`
    link.click()
  }

  return (
    <div className="px-6 py-10 max-w-screen-lg mx-auto font-sans">
      <h1 className="text-4xl uppercase tracking-wider mb-6">Darkroom Editor</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full md:w-1/3 gap-4">
          <input type="file" onChange={handleAddImage} />
          <button
            onClick={handleAddText}
            className="border px-4 py-2 uppercase text-sm tracking-wider hover:bg-black hover:text-white"
          >
            Add Text
          </button>
          <div className="flex gap-2">
            <button
              className={`border px-4 py-1 uppercase text-sm ${
                side === "front" ? "bg-black text-white" : ""
              }`}
              onClick={() => setSide("front")}
            >
              Front
            </button>
            <button
              className={`border px-4 py-1 uppercase text-sm ${
                side === "back" ? "bg-black text-white" : ""
              }`}
              onClick={() => setSide("back")}
            >
              Back
            </button>
          </div>
          <button
            onClick={handleDownload}
            className="border px-4 py-2 mt-4 uppercase text-sm tracking-wider hover:bg-black hover:text-white"
          >
            Print
          </button>
        </div>

        <div className="w-full md:w-2/3 border">
          <canvas ref={canvasEl} className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
