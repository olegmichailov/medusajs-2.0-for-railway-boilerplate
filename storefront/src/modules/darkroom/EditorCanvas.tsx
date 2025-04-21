// src/app/[countryCode]/darkroom/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const CANVAS_WIDTH = 985;
const CANVAS_HEIGHT = 1271;
const DISPLAY_SCALE = 0.5;

interface UploadedLayer {
  image: HTMLImageElement;
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

const DarkroomEditor = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedLayer[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [konvaImage] = useImage(currentImage || "");
  const [mockupImage, setMockupImage] = useImage("/mockups/MOCAP_FRONT.png");
  const imageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [konvaImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmLayer = () => {
    if (konvaImage) {
      const imageNode = imageRef.current;
      const { x, y, width, height, rotation } = imageNode;
      setUploadedImages([
        ...uploadedImages,
        {
          image: konvaImage,
          opacity,
          x,
          y,
          width,
          height,
          rotation
        }
      ]);
      setCurrentImage(null);
      setOpacity(1);
    }
  };

  const switchMockup = (type: "front" | "back") => {
    const newMockup = type === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png";
    setMockupImage(null);
    const [newImg] = useImage(newMockup);
    setMockupImage(newImg);
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      {/* Left UI */}
      <div className="w-1/2 p-10">
        <h1 className="text-2xl font-bold mb-6 uppercase tracking-wider">Darkroom Editor</h1>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Opacity</label>
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
        <div className="flex space-x-4">
          <button onClick={() => switchMockup("front")} className="border px-4 py-2">Front</button>
          <button onClick={() => switchMockup("back")} className="border px-4 py-2">Back</button>
          <button onClick={handleConfirmLayer} className="bg-black text-white px-4 py-2">Print</button>
        </div>
      </div>

      {/* Right Canvas */}
      <div className="w-1/2 flex items-center justify-center">
        {mockupImage && (
          <div style={{ width: CANVAS_WIDTH * DISPLAY_SCALE, height: CANVAS_HEIGHT * DISPLAY_SCALE }}>
            <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} scale={{ x: DISPLAY_SCALE, y: DISPLAY_SCALE }}>
              <Layer>
                <KonvaImage image={mockupImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />

                {uploadedImages.map((layer, i) => (
                  <KonvaImage
                    key={i}
                    image={layer.image}
                    x={layer.x}
                    y={layer.y}
                    width={layer.width}
                    height={layer.height}
                    opacity={layer.opacity}
                    rotation={layer.rotation}
                  />
                ))}

                {konvaImage && (
                  <>
                    <KonvaImage
                      image={konvaImage}
                      ref={imageRef}
                      x={100}
                      y={100}
                      width={200}
                      height={200}
                      opacity={opacity}
                      draggable
                    />
                    <Transformer ref={transformerRef} />
                  </>
                )}
              </Layer>
            </Stage>
          </div>
        )}
      </div>
    </div>
  );
};

export default DarkroomEditor;
