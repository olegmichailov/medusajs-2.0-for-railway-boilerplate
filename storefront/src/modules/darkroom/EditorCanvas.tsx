"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const CANVAS_HEIGHT = 750;
const MOCKUP_ASPECT_RATIO = 985 / 1271;
const CANVAS_WIDTH = Math.round(CANVAS_HEIGHT * MOCKUP_ASPECT_RATIO);

export default function EditorCanvas() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [mockupType, setMockupType] = useState<"front" | "back">("front");

  const [mockupImage] = useImage(
    mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png"
  );

  const transformerRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      const isCopy = (isMac && e.metaKey) || (!isMac && e.ctrlKey);

      if (isCopy && e.key.toLowerCase() === "c" && selectedImageIndex !== null) {
        const copied = images[selectedImageIndex];
        const clone = {
          ...copied,
          x: copied.x + 30,
          y: copied.y + 30,
          id: Date.now().toString(),
        };
        setImages((prev) => [...prev, clone]);
        setSelectedImageIndex(images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images, selectedImageIndex]);

  useEffect(() => {
    if (transformerRef.current && selectedImageIndex !== null) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne(`#img-${selectedImageIndex}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImageIndex]);

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

  const handleDeselect = (e: any) => {
    const clicked = e.target;
    if (clicked === clicked.getStage()) {
      setSelectedImageIndex(null);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1">
        <div className="w-1/2 p-10">
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Upload Print</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-gray-500 mt-2">Drag, scale, rotate print freely</p>
          </div>
          <div className="mb-4">
            <label className="text-sm">Opacity: {Math.round(opacity * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              className="w-full appearance-none bg-black h-px mt-1"
              onChange={(e) => {
                const val = Number(e.target.value);
                setOpacity(val);
                if (selectedImageIndex !== null) {
                  const updated = [...images];
                  updated[selectedImageIndex].opacity = val;
                  setImages(updated);
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <button className="border px-4 py-2" onClick={() => setMockupType("front")}>
              Front
            </button>
            <button className="border px-4 py-2" onClick={() => setMockupType("back")}>
              Back
            </button>
            <button className="bg-black text-white px-4 py-2" onClick={() => console.log("Print", images)}>
              Print
            </button>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center overflow-hidden">
          {mockupImage && (
            <Stage
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseDown={handleDeselect}
              style={{ border: "1px dashed #ccc" }}
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
                {selectedImageIndex !== null && <Transformer ref={transformerRef} />}
              </Layer>
            </Stage>
          )}
        </div>
      </div>
    </div>
  );
}
