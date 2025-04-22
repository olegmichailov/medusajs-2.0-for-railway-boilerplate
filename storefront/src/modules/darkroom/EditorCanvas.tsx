// TODO: Реализовать следующие задачи:
// 1. Добавить жесты pinch-to-zoom и поворот для изображений в мобильной версии.
// 2. Переместить кнопку Create влево, а Back вправо — одинаковый стиль.
// 3. Поднять мокап выше в мобильной версии.
// 4. Починить сброс трансформ-хендлов при клике в пустое место.

"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { isMobile } from "react-device-detect";
import { useGesture } from "@use-gesture/react";

const CANVAS_WIDTH = 985;
const CANVAS_HEIGHT = 1271;
const DISPLAY_HEIGHT = isMobile ? 650 : 750;
const DISPLAY_WIDTH = (DISPLAY_HEIGHT * CANVAS_WIDTH) / CANVAS_HEIGHT;

const EditorCanvas = () => {
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
    if (transformerRef.current && selectedImageIndex !== null) {
      const stage = transformerRef.current.getStage();
      const node = stage.findOne(`#img-${selectedImageIndex}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImageIndex]);

  const handleDeselect = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedImageIndex(null);
    }
  };

  // TODO: Добавить useGesture для multitouch масштабирования и поворота (мобила)

  return (
    <div className="w-screen h-screen flex bg-white">
      <div className="absolute top-4 left-4 z-50">
        <button className="border px-4 py-1 text-sm" onClick={() => alert("Create clicked")}>Create</button>
      </div>
      <div className="absolute top-4 right-4 z-50">
        <button className="border px-4 py-1 text-sm" onClick={() => window.history.back()}>Back</button>
      </div>
      <div className="absolute bottom-4 left-4 z-50">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}>
          <Stage
            ref={stageRef}
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            scaleX={DISPLAY_WIDTH / CANVAS_WIDTH}
            scaleY={DISPLAY_HEIGHT / CANVAS_HEIGHT}
            onMouseDown={handleDeselect}
            onTouchStart={handleDeselect}
          >
            <Layer>
              {mockupImage && (
                <KonvaImage
                  image={mockupImage}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  y={isMobile ? -30 : 0}
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
              {selectedImageIndex !== null && !isMobile && (
                <Transformer ref={transformerRef} rotateEnabled={true} />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
