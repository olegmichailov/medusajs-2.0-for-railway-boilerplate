// src/modules/darkroom/EditorCanvas.tsx
'use client'

import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import { useRef, useEffect, useState } from 'react'
import useImage from 'use-image'
import { useDarkroomStore } from '@/modules/darkroom/store'

interface UploadedImageProps {
  src: string
}

const UploadedImage = ({ src }: UploadedImageProps) => {
  const [image] = useImage(src)
  const imageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)

  useEffect(() => {
    if (imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [image])

  return (
    <>
      <KonvaImage
        image={image}
        ref={imageRef}
        draggable
        x={150}
        y={100}
      />
      <Transformer
        ref={transformerRef}
        rotateEnabled
        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 20 || newBox.height < 20) return oldBox
          return newBox
        }}
      />
    </>
  )
}

export const EditorCanvas = ({ imageUrl }: { imageUrl: string }) => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200
  const height = typeof window !== 'undefined' ? window.innerHeight : 800

  return (
    <div className="w-full h-full">
      <Stage width={width} height={height} className="border">
        <Layer>
          <UploadedImage src={imageUrl} />
        </Layer>
      </Stage>
    </div>
  )
}

export default EditorCanvas
