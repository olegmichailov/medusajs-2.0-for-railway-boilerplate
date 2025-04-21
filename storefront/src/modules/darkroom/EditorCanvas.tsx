"use client"

import { useState } from "react"
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva"
import useImage from "use-image"

export default function EditorCanvas() {
  const [printImage, setPrintImage] = useState(null)
  const [mockup] = useImage("/mockups/MOCAP_FRONT.png")
  const [print] = useImage(printImage)

  const [selected, setSelected] = useState(false)

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPrintImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex w-full h-screen">
      {/* Left Panel */}
      <div className="w-1/2 p-10 flex flex-col justify-start">
        <h2 className="text-2xl tracking-widest font-bold mb-4">UPLOAD PRINT</h2>
        <input type="file" accept="image/*" onChange={handleUpload} className="mb-2" />
        <p className="text-sm text-gray-500">Drag, scale, rotate print freely</p>
      </div>

      {/* Right Canvas */}
      <div className="w-1/2 flex items-center justify-center">
        <Stage width={500} height={700}>
          <Layer>
            {mockup && (
              <KonvaImage image={mockup} width={500} height={700} />
            )}

            {print && (
              <>
                <KonvaImage
                  image={print}
                  x={100}
                  y={200}
                  width={200}
                  height={200}
                  draggable
                  rotation={0}
                  onClick={() => setSelected(true)}
                  onTap={() => setSelected(true)}
                  name="print"
                />
                {selected && (
                  <Transformer
                    rotateEnabled={true}
                    enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                    boundBoxFunc={(oldBox, newBox) => newBox}
                    nodes={
                      print ? [
                        ...document
                          .querySelectorAll(".konvajs-content canvas")
                          .values()
                      ] : []
                    }
                  />
                )}
              </>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
