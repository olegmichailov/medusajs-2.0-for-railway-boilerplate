// src/modules/darkroom/EditorCanvas.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Transformer } from "react-konva";
import useImage from "use-image";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";

const CANVAS_WIDTH = 985;
const CANVAS_HEIGHT = 1271;
const DISPLAY_HEIGHT = isMobile ? 680 : 750;
const DISPLAY_WIDTH = (DISPLAY_HEIGHT * CANVAS_WIDTH) / CANVAS_HEIGHT;

const EditorCanvas = () => {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [mockupType, setMockupType] = useState<"front" | "back">("front");
  const [copiedImage, setCopiedImage] = useState<any | null>(null);
  const [drawings, setDrawings] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#d63384");
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState<"move" | "brush">("brush");
  const [menuOpen, setMenuOpen] = useState(false);
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [touchStartRotation, setTouchStartRotation] = useState<number | null>(null);

  const [mockupImage] = useImage(mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png");

  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const getDistance = (p1: any, p2: any) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const getAngle = (p1: any, p2: any) => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  };

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
          setMode("move");
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
      const node = stageRef.current.findOne(`#img-${selectedImageIndex}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImageIndex]);

  const scalePos = (pos: { x: number; y: number }) => ({
    x: (pos.x * CANVAS_WIDTH) / DISPLAY_WIDTH,
    y: (pos.y * CANVAS_HEIGHT) / DISPLAY_HEIGHT,
  });

  const handleTouchStart = (e: any) => {
    if (e.evt.touches.length === 2 && selectedImageIndex !== null) {
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      setTouchStartDist(getDistance(touch1, touch2));
      setTouchStartRotation(getAngle(touch1, touch2));
    }
  };

  const handleTouchMove = (e: any) => {
    if (e.evt.touches.length === 2 && selectedImageIndex !== null) {
      const index = selectedImageIndex;
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const currentDist = getDistance(touch1, touch2);
      const currentAngle = getAngle(touch1, touch2);

      const newImages = [...images];
      const image = newImages[index];

      if (touchStartDist && touchStartRotation !== null) {
        const scaleFactor = currentDist / touchStartDist;
        const rotationDelta = ((currentAngle - touchStartRotation) * 180) / Math.PI;
        image.width *= scaleFactor;
        image.height *= scaleFactor;
        image.rotation += rotationDelta;
        setImages(newImages);
        setTouchStartDist(currentDist);
        setTouchStartRotation(currentAngle);
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col lg:flex-row">
      <div className="absolute top-4 w-full px-4 flex justify-between z-50">
        <button className="border px-3 py-1 text-sm" onClick={() => router.back()}>Back</button>
        <button className="border px-3 py-1 text-sm" onClick={() => setMenuOpen(!menuOpen)}>Create</button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white p-4 z-40">
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />
          <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => {
            setOpacity(Number(e.target.value));
            if (selectedImageIndex !== null) {
              const newImages = [...images];
              newImages[selectedImageIndex].opacity = Number(e.target.value);
              setImages(newImages);
            }
          }} className="w-full mb-2 appearance-none h-[2px] bg-black" />
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 border mb-2" />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center">
        <div style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT, transform: "translateY(-30px) scale(0.95)" }}>
          <Stage
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            scale={{ x: DISPLAY_WIDTH / CANVAS_WIDTH, y: DISPLAY_HEIGHT / CANVAS_HEIGHT }}
            ref={stageRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) setSelectedImageIndex(null);
            }}
          >
            <Layer>
              {mockupImage && <KonvaImage image={mockupImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />}
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
              {selectedImageIndex !== null && !isMobile && <Transformer ref={transformerRef} rotateEnabled={true} />}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
