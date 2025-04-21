import { useEffect, useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva"
import useImage from "use-image"

const MOCKUP_SRC = "/mockups/MOCAP_FRONT.png"

function DraggableImage({ image, isSelected, onSelect, onChange }) {
  const shapeRef = useRef(null)
  const trRef = useRef(null)

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <KonvaImage
        image={image}
        x={350}
        y={120}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
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
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          })
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}

export default function EditorCanvas() {
  const [mockup] = useImage(MOCKUP_SRC)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedImageNode, setUploadedImageNode] = useState(null)
  const [selected, setSelected] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = function (evt) {
      const img = new window.Image()
      img.src = evt.target.result
      img.onload = () => setUploadedImageNode(img)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex w-full h-screen items-start justify-between gap-6 px-6 pt-12">
      <div className="w-1/2 max-w-xs">
        <h1 className="text-3xl font-medium tracking-widest mb-4">DARKROOM EDITOR</h1>
        <p className="font-semibold uppercase mb-2">Upload Print</p>
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <p className="text-sm text-gray-500">Drag, scale, rotate print freely</p>
      </div>
      <div className="w-1/2 h-[80vh]">
        <Stage width={window.innerWidth / 2} height={window.innerHeight * 0.8}>
          <Layer>
            <KonvaImage image={mockup} x={0} y={0} width={500} />
            {uploadedImageNode && (
              <DraggableImage
                image={uploadedImageNode}
                isSelected={selected}
                onSelect={() => setSelected(true)}
                onChange={() => {}}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
