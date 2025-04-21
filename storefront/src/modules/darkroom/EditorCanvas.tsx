"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const CANVAS_WIDTH = 1985;
const CANVAS_HEIGHT = 1271;

const DarkroomEditor = () => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [mockupType, setMockupType] = useState<"front" | "back">("front");
  const [mockupImage] = useImage(
    mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png"
  );

  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        if (selectedImageIndex !== null) {
          const copied = { ...images[selectedImageIndex] };
          copied.x += 20;
          copied.y += 20;
          copied.id = Date.now().toString();
          setImages((prev) => [...prev, copied]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, images]);

  useEffect(() => {
    if (transformerRef.current && selectedImageIndex !== null) {
      const selectedNode = stageRef.current.findOne(`#img-${images[selectedImageIndex].id}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImageIndex, images]);

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
            x: 200,
            y: 200,
            width: img.width / 3,
            height: img.height / 3,
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

  const handleMockupChange = (type: "front" | "back") => {
    setMockupType(type);
  };

  return (
    <div className="w-screen h-screen flex bg-white overflow-hidden">
      <div className="w-1/2 p-10 flex flex-col justify-start">
        <h1 className="text-2xl font-bold mb-6 uppercase tracking-wider">Darkroom Editor</h1>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedImageIndex !== null ? images[selectedImageIndex].opacity : 1}
            className="w-full appearance-none h-1 bg-black"
            onChange={(e) => {
              if (selectedImageIndex !== null) {
                const newImages = [...images];
                newImages[selectedImageIndex].opacity = Number(e.target.value);
                setImages(newImages);
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <button className="border px-4 py-2" onClick={() => handleMockupChange("front")}>Front</button>
          <button className="border px-4 py-2" onClick={() => handleMockupChange("back")}>Back</button>
          <button
            className="bg-black text-white px-4 py-2"
            onClick={() => console.log("Print", images)}
          >
            Print
          </button>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="border border-gray-400" style={{ width: 500, height: (500 * CANVAS_HEIGHT) / CANVAS_WIDTH }}>
          {mockupImage && (
            <Stage
              ref={stageRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              scale={{ x: 500 / CANVAS_WIDTH, y: 500 / CANVAS_WIDTH }}
              onMouseDown={(e) => {
                const clicked = e.target;
                if (clicked === e.target.getStage()) {
                  setSelectedImageIndex(null);
                }
              }}
            >
              <Layer>
                <KonvaImage image={mockupImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                {images.map((img, index) => (
                  <KonvaImage
                    key={img.id}
                    id={`img-${img.id}`}
                    image={img.image}
                    x={img.x}
                    y={img.y}
                    width={img.width}
                    height={img.height}
                    opacity={img.opacity}
                    draggable
                    onClick={() => setSelectedImageIndex(index)}
                    onTap={() => setSelectedImageIndex(index)}
                  />
                ))}
                {selectedImageIndex !== null && <Transformer ref={transformerRef} rotateEnabled={true} />}
              </Layer>
            </Stage>
          )}
        </div>
      </div>
    </div>
  );
};

export default DarkroomEditor;
