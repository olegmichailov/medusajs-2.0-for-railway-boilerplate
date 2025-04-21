// storefront/src/modules/darkroom/components/editor-canvas.tsx

"use client"

import { useRef, useEffect } from "react"
import { Stage, Layer, Image as KonvaImage } from "react-konva"
import useImage from "use-image"
import { useDarkroomStore } from "../store"

export default function EditorCanvas() {
  const {
    mockupSrc,
    uploadedImage,
    imageProps,
    setImageProps,
    canvasSize,
  } = useDarkroomStore()

  const [mockup] = useImage(mockupSrc)
  const [print] = useImage(uploadedImage || "")

  const imageRef = useRef<any>(null)
  const stageRef = useRef<any>(null)

  // Обновление позиции при драг-н-дропе
  useEffect(() => {
    if (!imageRef.current) return
    imageRef.current.to({
      x: imageProps.x,
      y: imageProps.y,
      scaleX: imageProps.scale,
      scaleY: imageProps.scale,
      rotation: imageProps.rotation,
    })
  }, [imageProps])

  return (
    <div className="w-full">
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        ref={stageRef}
        className="border border-white bg-[#0b0b0b] mx-auto"
      >
        <Layer>
          {/* Мокап худи (фон) */}
          {mockup && (
            <KonvaImage
              image={mockup}
              width={canvasSize.width}
              height={canvasSize.height}
              listening={false}
            />
          )}

          {/* Загруженное изображение принта */}
          {print && (
            <KonvaImage
              image={print}
              draggable
              ref={imageRef}
              x={imageProps.x}
              y={imageProps.y}
              scaleX={imageProps.scale}
              scaleY={imageProps.scale}
              rotation={imageProps.rotation}
              onDragEnd={(e) => {
                setImageProps({
                  ...imageProps,
                  x: e.target.x(),
                  y: e.target.y(),
                })
              }}
              onTransformEnd={(e) => {
                const node = e.target
                const scale = node.scaleX()
                setImageProps({
                  ...imageProps,
                  scale,
                  rotation: node.rotation(),
                })
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}
