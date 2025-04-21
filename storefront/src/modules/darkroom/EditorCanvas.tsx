// src/app/[countryCode]/darkroom/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const DarkroomEditor = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [image] = useImage(uploadedImage || "");
  const [mockupImage] = useImage("/mockups/MOCAP_FRONT.png");
  const imageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      {/* Left: Upload control */}
      <div className="w-1/2 p-10">
        <h1 className="text-2xl font-bold mb-6 uppercase tracking-wider">Darkroom Editor</h1>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
        </div>
      </div>

      {/* Right: Mockup canvas */}
      <div className="w-1/2 flex items-center justify-center">
        {mockupImage && (
          <Stage width={500} height={700}>
            <Layer>
              <KonvaImage
                image={mockupImage}
                width={500}
                height={700}
                x={0}
                y={0}
              />
              {image && (
                <>
                  <KonvaImage
                    image={image}
                    ref={imageRef}
                    x={100}
                    y={150}
                    width={200}
                    height={200}
                    draggable
                  />
                  <Transformer
                    ref={transformerRef}
                    rotateEnabled={true}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 50 || newBox.height < 50) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                </>
              )}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
};

export default DarkroomEditor;
