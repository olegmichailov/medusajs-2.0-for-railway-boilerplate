// src/modules/darkroom/EditorCanvas.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva"
import useImage from "use-image"

const CANVAS_WIDTH = 985
const CANVAS_HEIGHT = 1271
const STAGE_SCALE = 0.6

const EditorCanvas = () => {
  const [images, setImages] = useState<any[]>([])
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [mockupType, setMockupType] = useState<"front" | "back">("front")
  const [opacity, setOpacity] = useState(1)

  const stageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)

  const [mockupImage] = useImage(
    mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png"
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.src = reader.result as string
      img.onload = () => {
        const id = Date.now().toString()
        const newImg = {
          id,
          image: img,
          x: 200,
          y: 200,
          width: img.width / 4,
          height: img.height / 4,
          opacity: 1,
          rotation: 0,
        }
        setImages((prev) => [...prev, newImg])
        setSelectedImageId(id)
        setOpacity(1)
      }
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (transformerRef.current && selectedImageId) {
      const selectedNode = stageRef.current.findOne(`#${selectedImageId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer().batchDraw()
      }
    }
  }, [selectedImageId, images])

  const handleStageMouseDown = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedImageId(null)
    }
  }

  const handlePrint = () => {
    console.log("Printing layers:", images)
  }

  const handleCopy = () => {
    const selected = images.find((img) => img.id === selectedImageId)
    if (selected) {
      const copy = {
        ...selected,
        id: Date.now().toString(),
        x: selected.x + 30,
        y: selected.y + 30,
      }
      setImages((prev) => [...prev, copy])
      setSelectedImageId(copy.id)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault()
        handleCopy()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [images, selectedImageId])

  return (
    <div className="w-screen h-screen flex bg-white">
      <div className="w-1/2 p-10">
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Opacity: {Math.round(opacity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => {
              const newVal = Number(e.target.value)
              setOpacity(newVal)
              setImages((prev) =>
                prev.map((img) =>
                  img.id === selectedImageId ? { ...img, opacity: newVal } : img
                )
              )
            }}
            className="w-full h-[1px] bg-black rounded-none appearance-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="border px-4 py-2" onClick={() => setMockupType("front")}>Front</button>
          <button className="border px-4 py-2" onClick={() => setMockupType("back")}>Back</button>
          <button className="bg-black text-white px-4 py-2" onClick={handlePrint}>Print</button>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="border border-dashed border-gray-400">
          <Stage
            ref={stageRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            scale={{ x: STAGE_SCALE, y: STAGE_SCALE }}
            onMouseDown={handleStageMouseDown}
          >
            <Layer>
              <KonvaImage image={mockupImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
              {images.map((img) => (
                <KonvaImage
                  key={img.id}
                  id={img.id}
                  image={img.image}
                  x={img.x}
                  y={img.y}
                  width={img.width}
                  height={img.height}
                  rotation={img.rotation}
                  opacity={img.opacity}
                  draggable
                  onClick={() => setSelectedImageId(img.id)}
                  onTap={() => setSelectedImageId(img.id)}
                />
              ))}
              {selectedImageId && <Transformer ref={transformerRef} rotateEnabled={true} />}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  )
}

export default EditorCanvas
