// src/modules/darkroom/EditorCanvas.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const CANVAS_WIDTH = 985;
const CANVAS_HEIGHT = 1271;
const DISPLAY_WIDTH = 500;
const DISPLAY_HEIGHT = 645; // сохранение пропорции 985:1271

const EditorCanvas = () => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [mockupType, setMockupType] = useState<"front" | "back">("front");
  const [copiedImage, setCopiedImage] = useState<any | null>(null);

  const [mockupImage] = useImage(
    mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png"
  );

  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          const newImage = {
            image: img,
            x: 100,
            y: 150,
            width: img.width / 4,
            height: img.height / 4,
            rotation: 0,
            opacity: 1,
            id: Date.now().toString(),
          };
          setImages((prev) => [...prev, newImage]);
          setSelectedImageIndex(images.length);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const copy = (isMac && e.metaKey && e.key === "c") || (!isMac && e.ctrlKey && e.key === "c");
      const paste = (isMac && e.metaKey && e.key === "v") || (!isMac && e.ctrlKey && e.key === "v");

      if (copy && selectedImageIndex !== null) {
        setCopiedImage({ ...images[selectedImageIndex] });
      }
      if (paste && copiedImage) {
        const duplicated = {
          ...copiedImage,
          id: Date.now().toString(),
          x: copiedImage.x + 20,
          y: copiedImage.y + 20,
        };
        setImages((prev) => [...prev, duplicated]);
        setSelectedImageIndex(images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copiedImage, selectedImageIndex, images]);

  useEffect(() => {
    if (transformerRef.current && selectedImageIndex !== null) {
      transformerRef.current.nodes([
        stageRef.current.findOne(`#img-${selectedImageIndex}`),
      ]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedImageIndex]);

  const handleDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) setSelectedImageIndex(null);
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <div className="w-1/2 p-10">
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Opacity: {Math.round(opacity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => {
              setOpacity(Number(e.target.value));
              if (selectedImageIndex !== null) {
                const newImages = [...images];
                newImages[selectedImageIndex].opacity = Number(e.target.value);
                setImages(newImages);
              }
            }}
            className="w-full h-[2px] bg-black appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="border px-4 py-2" onClick={() => setMockupType("front")}>Front</button>
          <button className="border px-4 py-2" onClick={() => setMockupType("back")}>Back</button>
          <button
            className="bg-black text-white px-4 py-2"
            onClick={() => console.log("Print", images)}
          >
            Print
          </button>
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="border border-dashed border-gray-400" style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}>
          <Stage
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            scale={{ x: DISPLAY_WIDTH / CANVAS_WIDTH, y: DISPLAY_HEIGHT / CANVAS_HEIGHT }}
            ref={stageRef}
            onMouseDown={handleDeselect}
          >
            <Layer>
              {mockupImage && (
                <KonvaImage
                  image={mockupImage}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                />
              )}
              {images.map((img, index) => (
                <KonvaImage
                  key={img.id}
                  id={`img-${index}`}
                  image={img.image}
                  x={img.x}
                  y={img.y}
                  width={img.width}
                  height={img.height}
                  rotation={img.rotation}
                  opacity={img.opacity}
                  draggable
                  onClick={() => setSelectedImageIndex(index)}
                  onTap={() => setSelectedImageIndex(index)}
                />
              ))}
              {selectedImageIndex !== null && <Transformer ref={transformerRef} rotateEnabled={true} />}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
