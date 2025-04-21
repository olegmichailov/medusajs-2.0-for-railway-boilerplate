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
  const [opacity, setOpacity] = useState(1);
  const transformerRef = useRef<any>(null);

  const [mockupImage] = useImage(
    mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png"
  );

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
            x: CANVAS_WIDTH / 2 - img.width / 8,
            y: CANVAS_HEIGHT / 2 - img.height / 8,
            width: img.width / 4,
            height: img.height / 4,
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
    if (transformerRef.current && selectedImageIndex !== null) {
      const selectedNode = transformerRef.current.getStage().findOne(`#img-${selectedImageIndex}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImageIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
      if (selectedImageIndex !== null) {
        const copied = { ...images[selectedImageIndex], id: Date.now().toString() };
        setImages((prev) => [...prev, copied]);
        setSelectedImageIndex(images.length);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images, selectedImageIndex]);

  const handleDeselect = () => setSelectedImageIndex(null);

  return (
    <div className="w-screen h-screen flex bg-white">
      <div className="w-1/2 p-10">
        <h1 className="text-2xl font-bold mb-6 uppercase tracking-wider">Darkroom Editor</h1>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Upload Print</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Opacity: {Math.round(opacity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            className="w-72 appearance-none bg-black h-[1px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[2px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black"
            onChange={(e) => {
              setOpacity(Number(e.target.value));
              if (selectedImageIndex !== null) {
                const newImages = [...images];
                newImages[selectedImageIndex].opacity = Number(e.target.value);
                setImages(newImages);
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <button className="border px-4 py-2" onClick={() => setMockupType("front")}>Front</button>
          <button className="border px-4 py-2" onClick={() => setMockupType("back")}>Back</button>
          <button className="bg-black text-white px-4 py-2" onClick={() => console.log("Print", images)}>Print</button>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[500px] aspect-[1985/1271] border">
          {mockupImage && (
            <Stage
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              scaleX={500 / CANVAS_WIDTH}
              scaleY={(500 / CANVAS_WIDTH)}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) handleDeselect();
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
