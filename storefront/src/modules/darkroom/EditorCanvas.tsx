"use client"

import React, { useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva"
import { useImage } from "react-konva"

interface UploadedImageProps {
  imageUrl: string
  isSelected: boolean
  onSelect: () => void
  onChange: (newAttrs: any) => void
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
}

const UploadedImage = ({
  imageUrl,
  isSelected,
  onSelect,
  onChange,
  x,
  y,
  scaleX,
  scaleY,
  rotation,
}: UploadedImageProps) => {
  const shapeRef = useRef<any>(null)
  const trRef = useRef<any>(null)
  const [image] = useImage(imageUrl)

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <KonvaImage
        image={image}
        draggable
        x={x}
        y={y}
        scaleX={scaleX}
        scaleY={scaleY}
        rotation={rotation}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
            rotation: e.target.rotation(),
            scaleX: e.target.scaleX(),
            scaleY: e.target.scaleY(),
          })
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX,
            scaleY,
          })
        }}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={true} />} 
    </>
  )
}

export const EditorCanvas = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageProps, setImageProps] = useState<any>({
    x: 180,
    y: 180,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  })
  const [selected, setSelected] = useState<boolean>(false)
  const [mockup] = useImage("/mockups/MOCAP_FRONT_BACK.png")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-[85vh]">
      <div className="w-full md:w-1/3 p-4 border-r">
        <h2 className="text-2xl font-bold mb-4">UPLOAD PRINT</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <p className="text-sm mt-2">Drag, scale, rotate print freely</p>
      </div>
      <div className="w-full md:w-2/3 h-full bg-white flex justify-center items-center">
        <Stage
          width={600}
          height={700}
          onMouseDown={() => setSelected(false)}
          className="border shadow-lg bg-white"
        >
          <Layer>
            {mockup && (
              <KonvaImage image={mockup} width={600} height={700} />
            )}
            {imageUrl && (
              <UploadedImage
                imageUrl={imageUrl}
                isSelected={selected}
                onSelect={() => setSelected(true)}
                onChange={(newAttrs) =>
                  setImageProps({ ...imageProps, ...newAttrs })
                }
                {...imageProps}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default EditorCanvas
