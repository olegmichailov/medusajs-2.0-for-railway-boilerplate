// storefront/src/app/[countryCode]/darkroom/page.tsx

"use client"

import React, { useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Line } from "react-konva"
import useImage from "use-image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import mockupFrontBack from "@/public/mockups/il_fullxfull.6008848563_7wnj.avif"
import mockupAlt from "@/public/mockups/il_570xN.6002672805_egkj.avif"

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 750

const Darkroom = () => {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [selectedSide, setSelectedSide] = useState<"front" | "back">("front")
  const [selectedMockup, setSelectedMockup] = useState<"a" | "b">("a")

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imagePos, setImagePos] = useState({ x: 200, y: 300 })
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [text, setText] = useState("Your Text Here")
  const [textPos, setTextPos] = useState({ x: 100, y: 100 })
  const [lines, setLines] = useState<Array<number[]>>([])
  const [isDrawing, setIsDrawing] = useState(false)

  const stageRef = useRef<any>(null)

  const [img] = useImage(selectedMockup === "a" ? mockupFrontBack.src : mockupAlt.src)
  const [userImage] = useImage(uploadedImage || "")

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handlePrint = () => {
    const uri = stageRef.current.toDataURL()
    const link = document.createElement("a")
    link.download = `gmorkl_mockup_${selectedMockup}_${selectedSide}.png`
    link.href = uri
    link.click()
  }

  const handleDrawStart = (e: any) => {
    setIsDrawing(true)
    const pos = e.target.getStage().getPointerPosition()
    if (pos) setLines([...lines, [pos.x, pos.y]])
  }

  const handleDraw = (e: any) => {
    if (!isDrawing) return
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()
    if (!point) return
    let lastLine = lines[lines.length - 1]
    if (!lastLine) return
    lastLine = lastLine.concat([point.x, point.y])
    const newLines = lines.slice(0, -1).concat([lastLine])
    setLines(newLines)
  }

  const handleDrawEnd = () => {
    setIsDrawing(false)
  }

  const crop = {
    x: selectedSide === "front" ? 0 : img?.width / 2 || 0,
    y: 0,
    width: img?.width / 2 || 300,
    height: img?.height || 750,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-sans">
      <h1 className="text-4xl tracking-wider font-medium uppercase mb-8">Darkroom Editor</h1>

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:w-1/3">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="text-sm border p-2"
          />

          <input
            type="text"
            placeholder="Enter your text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-sm border p-2"
          />

          <div className="flex gap-4">
            <button onClick={() => setSelectedSide("front")}>Front</button>
            <button onClick={() => setSelectedSide("back")}>Back</button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setSelectedMockup("a")}>Mockup A</button>
            <button onClick={() => setSelectedMockup("b")}>Mockup B</button>
          </div>

          <Button onClick={handlePrint}>Print</Button>
        </div>

        {/* Canvas Preview */}
        <div className="border border-black">
          <Stage
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            ref={stageRef}
            onMouseDown={handleDrawStart}
            onMousemove={handleDraw}
            onMouseup={handleDrawEnd}
          >
            <Layer>
              {img && (
                <KonvaImage
                  image={img}
                  x={0}
                  y={0}
                  crop={crop}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                />
              )}
              {userImage && (
                <KonvaImage
                  image={userImage}
                  x={imagePos.x}
                  y={imagePos.y}
                  draggable
                  rotation={rotation}
                  scaleX={scale}
                  scaleY={scale}
                  onDragEnd={(e) =>
                    setImagePos({ x: e.target.x(), y: e.target.y() })
                  }
                />
              )}
              <KonvaText
                text={text}
                x={textPos.x}
                y={textPos.y}
                fontSize={24}
                fill="white"
                draggable
                onDragEnd={(e) =>
                  setTextPos({ x: e.target.x(), y: e.target.y() })
                }
              />
              {lines.map((line, idx) => (
                <Line
                  key={idx}
                  points={line}
                  stroke="red"
                  strokeWidth={2}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  )
}

export default Darkroom
