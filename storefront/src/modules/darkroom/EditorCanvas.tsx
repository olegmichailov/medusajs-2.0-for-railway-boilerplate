"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const CANVAS_WIDTH = 985;
const CANVAS_HEIGHT = 1271;

export default function EditorCanvas() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [mockupType, setMockupType] = useState<"front" | "back">("front");
  const [mockupImage] = useImage(
    mockupType === "front"
      ? "/mockups/MOCAP_FRONT.png"
      : "/mockups/MOCAP_BACK.png"
  );

  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const [opacity, setOpacity] = useState(1);

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
            y: 100,
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
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      const copyKey = isMac ? e.metaKey : e.ctrlKey;

      if (copyKey && e.key === "c" && selectedImageIndex !== null) {
        const copied = { ...images[selectedImageIndex] };
        localStorage.setItem("clipboardImage", JSON.stringify(copied));
      }
      if (copyKey && e.key === "v") {
        const clipboard = localStorage.getItem("clipboardImage");
        if (clipboard) {
          const parsed = JSON.parse(clipboard);
          const newImage = {
            ...parsed,
            x: parsed.x + 20,
            y: parsed.y + 20,
            id: Date.now().toString(),
          };
          setImages((prev) => [...prev, newImage]);
          setSelectedImageIndex(images.length);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images, selectedImageIndex]);

  useEffect(() => {
    if (transformerRef.current && selectedImageIndex !== null) {
      const shape = stageRef.current.findOne(`#img-${selectedImageIndex}`);
      if (shape) {
        transformerRef.current.nodes([shape]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImageIndex, images]);

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedImageIndex(null);
    }
  };

  return (
    <div className="w-full h-screen flex bg-white overflow-hidden">
      <div className="w-1/2 p-10">
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Opacity: {(opacity * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            className="w-full appearance-none h-[2px] bg-black"
            onChange={(e) => {
              const newOpacity = Number(e.target.value);
              setOpacity(newOpacity);
              if (selectedImageIndex !== null) {
                const newImages = [...images];
                newImages[selectedImageIndex].opacity = newOpacity;
                setImages(newImages);
              }
            }}
          />
        </div>

        <div className="flex gap-2">
          <button className="border px-4 py-2" onClick={() => setMockupType("front")}>Front</button>
          <button className="border px-4 py-2" onClick={() => setMockupType("back")}>Back</button>
          <button
            className="bg-black text-white px-4 py-2"
            onClick={() => console.log("Print", images)}
          >Print</button>
        </div>
      </div>

      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="border border-dashed border-gray-400 max-h-full">
          <Stage
            ref={stageRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={handleStageClick}
          >
            <Layer>
              <KonvaImage
                image={mockupImage}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
              />
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
              {selectedImageIndex !== null && (
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
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
