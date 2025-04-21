// Обновлённый компонент DarkroomEditor.jsx

'use client'

import { useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const mockups = {
  front: '/mockups/MOCAP_FRONT.png',
  back: '/mockups/MOCAP_BACK.png',
}

function UploadedImage({ image, isSelected, onSelect, onChange }) {
  const shapeRef = useRef()
  const trRef = useRef()
  const [img] = useImage(image.src)

  return (
    <>
      <KonvaImage
        image={img}
        x={image.x}
        y={image.y}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        rotation={image.rotation}
        opacity={image.opacity}
        draggable
        onClick={onSelect}
        ref={shapeRef}
        onTransformEnd={e => {
          const node = shapeRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX,
            scaleY,
          })
        }}
        onDragEnd={e => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => newBox}
        />
      )}
    </>
  )
}

export default function DarkroomEditor() {
  const [selectedId, setSelectedId] = useState(null)
  const [images, setImages] = useState([])
  const [mockup, setMockup] = useState('front')

  const handleImageUpload = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const newImage = {
        id: Date.now(),
        src: reader.result,
        x: 150,
        y: 150,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1,
      }
      setImages(prev => [...prev, newImage])
    }
    reader.readAsDataURL(file)
  }

  const updateImage = updated => {
    setImages(images.map(img => (img.id === updated.id ? updated : img)))
  }

  const selected = images.find(i => i.id === selectedId)

  return (
    <div className="px-6 pb-20 pt-6">
      <h1 className="text-4xl tracking-wider font-[505] uppercase mb-6">Darkroom Editor</h1>
      <div className="flex gap-8">
        <div className="w-1/2 space-y-4">
          <div>
            <label className="block font-medium mb-2 uppercase text-sm">Upload Print</label>
            <input type="file" onChange={handleImageUpload} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setMockup('front')}>Front</Button>
            <Button variant="outline" onClick={() => setMockup('back')}>Back</Button>
          </div>

          {selected && (
            <div className="pt-4">
              <label className="block text-sm mb-1 uppercase">Opacity</label>
              <Slider
                defaultValue={[selected.opacity * 100]}
                max={100}
                step={1}
                onValueChange={([val]) =>
                  updateImage({ ...selected, opacity: val / 100 })
                }
              />
            </div>
          )}

          <Button className="mt-6" onClick={() => alert('Print logic here')}>Print</Button>
        </div>

        <div className="w-1/2 border border-gray-200 rounded-md shadow relative">
          <Stage width={600} height={720} className="bg-white">
            <Layer>
              <KonvaImage image={useImage(mockups[mockup])[0]} x={0} y={0} width={600} height={720} />
              {images.map(img => (
                <UploadedImage
                  key={img.id}
                  image={img}
                  isSelected={img.id === selectedId}
                  onSelect={() => setSelectedId(img.id)}
                  onChange={updateImage}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  )
}
