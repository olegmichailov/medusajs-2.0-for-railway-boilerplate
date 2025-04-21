// File: src/app/[countryCode]/darkroom/page.tsx

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import Image from 'next/image'

const DarkroomPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const mockupImage = '/mockups/MOCAP_FRONT_BACK.png'

  useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      selection: true,
    })
    setCanvas(fabricCanvas)

    // Load mockup and crop left half (front)
    fabric.Image.fromURL(mockupImage, (img) => {
      img.set({
        left: 0,
        top: 0,
        scaleX: 0.5,
        originX: 'left',
        originY: 'top',
        selectable: false,
      })
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas))
    }, { crossOrigin: 'anonymous' })

    return () => {
      fabricCanvas.dispose()
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = function (f) {
        fabric.Image.fromURL(f.target?.result as string, (img) => {
          img.set({
            left: 200,
            top: 200,
            scaleX: 0.3,
            scaleY: 0.3,
            cornerColor: 'black',
            transparentCorners: false,
          })
          canvas?.add(img)
          canvas?.setActiveObject(img)
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex w-full h-screen">
      {/* Controls */}
      <div className="w-1/4 p-4 space-y-4">
        <label className="block text-sm font-medium">Upload Print</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
        <button
          onClick={() => {
            const dataURL = canvas?.toDataURL({ format: 'png', multiplier: 4 })
            if (dataURL) {
              const a = document.createElement('a')
              a.href = dataURL
              a.download = 'print.png'
              a.click()
            }
          }}
          className="mt-4 bg-black text-white px-4 py-2"
        >
          Print
        </button>
      </div>

      {/* Canvas area */}
      <div className="w-3/4 flex items-center justify-center">
        <canvas ref={canvasRef} width={1500} height={1087} className="border shadow-md" />
      </div>
    </div>
  )
}

export default DarkroomPage
