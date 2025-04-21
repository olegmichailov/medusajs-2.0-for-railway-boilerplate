import React, { useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva"
import useImage from "use-image"

const hoodie = "/mockups/hoodie_front.png"

export default function EditorCanvas() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [image] = useImage(uploadedImage || "")
  const [hoodieImage] = useImage(hoodie)
  const imageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 text-center">
        <label className="text-lg font-semibold">Upload Print</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block mt-2"
        />
        <p className="text-sm mt-1 text-gray-500">
          Drag, scale, rotate print freely
        </p>
      </div>

      <Stage
        width={window.innerWidth * 0.8}
        height={window.innerHeight * 0.75}
        className="border"
      >
        <Layer>
          {hoodieImage && (
            <KonvaImage
              image={hoodieImage}
              width={500}
              height={(hoodieImage.height / hoodieImage.width) * 500}
              x={window.innerWidth * 0.4 - 250}
              y={20}
            />
          )}

          {image && (
            <>
              <KonvaImage
                image={image}
                draggable
                ref={imageRef}
                x={window.innerWidth * 0.4 - 100}
                y={150}
                width={200}
                height={200}
                onClick={() => {
                  transformerRef.current.nodes([imageRef.current])
                  transformerRef.current.getLayer().batchDraw()
                }}
              />
              <Transformer ref={transformerRef} />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  )
}
