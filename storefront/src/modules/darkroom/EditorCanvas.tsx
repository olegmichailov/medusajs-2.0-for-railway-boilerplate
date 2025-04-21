"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const CANVAS_WIDTH = 985;
const CANVAS_HEIGHT = 1271;
const DISPLAY_WIDTH = 500;
const DISPLAY_HEIGHT = (DISPLAY_WIDTH * CANVAS_HEIGHT) / CANVAS_WIDTH;

const DarkroomEditor = () => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [mockupType, setMockupType] = useState<"front" | "back">("front");
  const [mockupImage] = useImage(
    mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png"
  );

  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

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
            x: (CANVAS_WIDTH - img.width / 4) / 2,
            y: (CANVAS_HEIGHT - img.height / 4) / 2,
            width: img.width / 4,
            height: img.height / 4,
            opacity: 1,
            id: Date.now().toString(),
          };
          setImages((prev) => [...prev, newImage]);
          setSelectedImageIndex(images.length);
          setOpacity(1);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTransformer = useCallback(() => {
    if (transformerRef.current && selectedImageIndex !== null) {
      const stage = stageRef.current;
      const selectedNode = stage.findOne(`#img-${selectedImageIndex}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImageIndex]);

  useEffect(() => {
    updateTransformer();
  }, [selectedImageIndex, updateTransformer]);

  const handleDeselect = () => {
    setSelectedImageIndex(null);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c" && selectedImageIndex !== null) {
        const copied = { ...images[selectedImageIndex], id: Date.now().toString() };
        setImages((prev) => [...prev, copied]);
        setSelectedImageIndex(images.length);
      }
    },
    [images, selectedImageIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-screen h-screen flex bg-white overflow-hidden">
      <div className="w-1/2 p-10">
        <h1 className="text-2xl font-bold mb-6 uppercase tracking-wider">Darkroom Editor</h1>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Opacity: {(opacity * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => {
              const value = Number(e.target.value);
              setOpacity(value);
              if (selectedImageIndex !== null) {
                const updated = [...images];
                updated[selectedImageIndex].opacity = value;
                setImages(updated);
              }
            }}
            className="w-full appearance-none h-[1px] bg-black"
          />
        </div>
        <div className="flex gap-2">
          <button className="border px-4 py-2" onClick={() => setMockupType("front")}>Front</button>
          <button className="border px-4 py-2" onClick={() => setMockupType("back")}>Back</button>
          <button className="bg-black text-white px-4 py-2" onClick={() => console.log("Print", images)}>
            Print
          </button>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }} className="border">
          {mockupImage && (
            <Stage
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              ref={stageRef}
              scale={{ x: DISPLAY_WIDTH / CANVAS_WIDTH, y: DISPLAY_HEIGHT / CANVAS_HEIGHT }}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                  handleDeselect();
                }
              }}
            >
              <Layer>
                <KonvaImage image={mockupImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                {images.map((img, index) => (
                  <KonvaImage
                    key={img.id}
                    id={`img-${index}`}
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
