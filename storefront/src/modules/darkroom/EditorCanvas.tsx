'use client'

import { useState, useRef } from 'react'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'

export default function EditorCanvas() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [selected, setSelected] = useState(true)
  const imageRef = useRef<any>(null)
  const trRef = useRef<any>(null)

  const [mockup] = useImage('/mockups/MOCAP_FRONT_BACK.png')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.src = reader.result as string
      img.onload = () => setImage(img)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex w-full h-[80vh]">
      <div className="w-1/3 p-4">
        <h2 className="text-lg font-bold mb-4">UPLOAD PRINT</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <p className="text-sm mt-2">Drag, scale, rotate print freely</p>
      </div>
      <div className="w-2/3">
        <Stage width={800} height={800}>
          <Layer>
            {mockup && <KonvaImage image={mockup} />}
            {image && (
              <>
                <KonvaImage
                  image={image}
                  ref={imageRef}
                  x={250}
                  y={300}
                  width={300}
                  draggable
                  onClick={() => setSelected(true)}
                />
                {selected && (
                  <Transformer
                    ref={trRef}
                    nodes={[imageRef.current]}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 20 || newBox.height < 20) {
                        return oldBox
                      }
                      return newBox
                    }}
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
