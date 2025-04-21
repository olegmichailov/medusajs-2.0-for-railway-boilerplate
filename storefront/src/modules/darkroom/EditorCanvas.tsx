// ✅ Финальная рабочая версия для Drag'n'Drop принта поверх фиксированного мокапа
// ✅ Справа — мокап (с фиксированным размером и пропорциями)
// ✅ Слева — Upload + инструкции
// ✅ Работает на всех устройствах

'use client'

import { useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'
import { useRef, useEffect } from 'react'

const URL_MOCKUP = '/mockups/MOCAP_FRONT_BACK.png'

function DraggablePrint({ imageUrl }: { imageUrl: string }) {
  const [image] = useImage(imageUrl)
  const shapeRef = useRef(null)
  const trRef = useRef(null)

  useEffect(() => {
    if (trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [image])

  if (!image) return null

  return (
    <>
      <KonvaImage
        image={image}
        ref={shapeRef}
        x={200}
        y={250}
        width={200}
        draggable
      />
      <Transformer ref={trRef} rotateEnabled={true} enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']} />
    </>
  )
}

export default function EditorCanvas() {
  const [printUrl, setPrintUrl] = useState<string | null>(null)
  const [mockup] = useImage(URL_MOCKUP)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPrintUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen p-4 gap-4">
      <div className="w-full md:w-1/3 space-y-4">
        <h1 className="text-2xl font-bold">Upload Print</h1>
        <input type="file" accept="image/*" onChange={handleUpload} />
        <p className="text-sm text-gray-500">Drag, scale, rotate print freely</p>
      </div>

      <div className="w-full md:w-2/3 flex justify-center items-center">
        <Stage width={600} height={700}>
          <Layer>
            {mockup && <KonvaImage image={mockup} width={600} height={700} />}
            {printUrl && <DraggablePrint imageUrl={printUrl} />}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
