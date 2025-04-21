// src/app/[countryCode]/darkroom/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const DarkroomEditor = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [image] = useImage(uploadedImage || "");
  const [mockupSide, setMockupSide] = useState<"front" | "back">("front");
  const [opacity, setOpacity] = useState(1);
  const [mockupImage] = useImage(
    mockupSide === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png"
  );

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
    <div className="w-screen h-screen flex flex-col bg-white">
      <div className="flex justify-between items-start w-full px-10 pt-10">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-6">Darkroom Editor</h1>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Upload Print</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              className="px-4 py-2 border border-black uppercase text-sm"
              onClick={() => setMockupSide("front")}
            >
              Front
            </button>
            <button
              className="px-4 py-2 border border-black uppercase text-sm"
              onClick={() => setMockupSide("back")}
            >
              Back
            </button>
            <button className="px-4 py-2 bg-black text-white uppercase text-sm">Print</button>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center border border-dashed border-gray-300 p-4">
          {mockupImage && (
            <Stage width={500} height={700} className="border border-gray-400">
              <Layer>
                <KonvaImage image={mockupImage} width={500} height={700} x={0} y={0} />
                {image && (
                  <>
                    <KonvaImage
                      image={image}
                      ref={imageRef}
                      x={100}
                      y={150}
                      width={200}
                      height={200}
                      opacity={opacity}
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
    </div>
  );
};

export default DarkroomEditor;
