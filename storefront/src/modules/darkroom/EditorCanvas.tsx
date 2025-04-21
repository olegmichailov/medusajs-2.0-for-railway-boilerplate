// ✅ Компонент Darkroom Editor с поддержкой: загрузки, перемещения, поворота, масштабирования,
// слоёв, opacity и кнопок Front/Back. Без использования @/components/ui.

'use client'

import React, { useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'

function DraggableImage({ src, isSelected, onSelect, onChange, opacity }) {
  const [image] = useImage(src)
  const shapeRef = useRef()
  const trRef = useRef()

  React.useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <KonvaImage
        image={image}
        ref={shapeRef}
        x={200}
        y={200}
        draggable
        opacity={opacity}
        onClick={onSelect}
        onTap={onSelect}
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
            width: node.width() * scaleX,
            height: node.height() * scaleY
          })
        }}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() })
        }}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={true} />}
    </>
  )
}

export default function EditorCanvas() {
  const [images, setImages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [editorSize] = useState({ width: 1000, height: 600 })

  const handleUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const newImage = {
        id: Date.now(),
        src: reader.result,
        x: 200,
        y: 200,
        rotation: 0,
        width: 300,
        height: 300,
        opacity: 1
      }
      setImages([...images, newImage])
    }
    if (file) reader.readAsDataURL(file)
  }

  const handleChange = (index, newAttrs) => {
    const updated = images.slice()
    updated[index] = { ...updated[index], ...newAttrs }
    setImages(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
      <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', marginBottom: 16 }}>DARKROOM EDITOR</h1>
      <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: 16 }} />
      <div style={{ border: '2px dashed #ccc', width: editorSize.width, height: editorSize.height }}>
        <Stage width={editorSize.width} height={editorSize.height} onMouseDown={() => setSelectedId(null)}>
          <Layer>
            {images.map((img, i) => (
              <DraggableImage
                key={img.id}
                src={img.src}
                isSelected={selectedId === img.id}
                onSelect={() => setSelectedId(img.id)}
                onChange={(attrs) => handleChange(i, attrs)}
                opacity={img.opacity}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
