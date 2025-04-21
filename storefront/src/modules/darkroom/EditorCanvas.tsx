// src/modules/darkroom/EditorCanvas.tsx

"use client";

import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import { useImage } from "react-konva";
import { useRef, useState } from "react";
import { useDarkroomStore } from "./store";

interface UploadedImageProps {
  src: string;
}

const UploadedImage = ({ src }: UploadedImageProps) => {
  const [image] = useImage(src);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [isSelected, setIsSelected] = useState(true);

  return (
    <>
      <KonvaImage
        image={image}
        ref={shapeRef}
        x={150}
        y={150}
        draggable
        onClick={() => setIsSelected(true)}
        onTap={() => setIsSelected(true)}
        onDragEnd={(e) => {
          const node = shapeRef.current;
          if (node) {
            node.to({
              x: e.target.x(),
              y: e.target.y(),
              duration: 0.2,
            });
          }
        }}
      />
      {isSelected && shapeRef.current && (
        <Transformer
          ref={trRef}
          nodes={[shapeRef.current]}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          rotateEnabled
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </>
  );
};

const EditorCanvas = () => {
  const [uploadedSrc, setUploadedSrc] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-1/3 p-4">
        <h1 className="text-2xl font-bold mb-4">DARKROOM EDITOR</h1>
        <p className="mb-2">UPLOAD PRINT</p>
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>
      <div className="w-2/3 h-screen relative">
        <Stage width={window.innerWidth * 0.66} height={window.innerHeight}>
          <Layer>
            <KonvaImage
              image={useImage("/mockups/MOCAP_FRONT_BACK.png")[0]}
              x={0}
              y={0}
              width={window.innerWidth * 0.66}
              height={window.innerHeight}
            />
            {uploadedSrc && <UploadedImage src={uploadedSrc} />}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default EditorCanvas;
