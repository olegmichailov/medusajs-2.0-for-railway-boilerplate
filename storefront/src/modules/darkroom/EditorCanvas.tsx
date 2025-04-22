"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
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
  const [mockupType, setMockupType] = useState<"front" | "back">("front");
  const [mockupImage] = useImage(mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png");

  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const lastTouchRef = useRef({ distance: 0, angle: 0 });

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
            scaleX: 1,
            scaleY: 1,
            id: Date.now().toString(),
          };
          setImages((prev) => [...prev, newImage]);
          setSelectedImageIndex(images.length);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTouchMove = (e: any) => {
    if (selectedImageIndex === null) return;
    const imgNode = stageRef.current.findOne(`#img-${selectedImageIndex}`);
    if (!imgNode) return;

    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);
      const newAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

      if (!lastTouchRef.current.distance) {
        lastTouchRef.current = { distance: newDistance, angle: newAngle };
        return;
      }

      const scale = newDistance / lastTouchRef.current.distance;
      const rotationDelta = newAngle - lastTouchRef.current.angle;

      imgNode.scaleX(imgNode.scaleX() * scale);
      imgNode.scaleY(imgNode.scaleY() * scale);
      imgNode.rotation(imgNode.rotation() + rotationDelta);

      lastTouchRef.current = { distance: newDistance, angle: newAngle };
      e.evt.preventDefault();
      stageRef.current.batchDraw();
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = { distance: 0, angle: 0 };
  };

  useEffect(() => {
    if (transformerRef.current && selectedImageIndex !== null) {
      const node = stageRef.current.findOne(`#img-${selectedImageIndex}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImageIndex]);

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col lg:flex-row">
      <div className={`lg:w-1/2 p-4 ${isMobile ? "absolute z-50 top-0 w-full bg-white" : ""}`}>
        {isMobile && (
          <div className="flex justify-between items-center mb-2">
            <button onClick={() => router.back()} className="text-sm border px-3 py-1">Back</button>
            <button className="text-sm border px-3 py-1">Create</button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />
      </div>
      <div className="lg:w-1/2 h-full flex items-center justify-center">
        <div style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT, transform: "translateY(-30px) scale(0.95)" }}>
          <Stage
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            scale={{ x: DISPLAY_WIDTH / CANVAS_WIDTH, y: DISPLAY_HEIGHT / CANVAS_HEIGHT }}
            ref={stageRef}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
                  scaleX={img.scaleX || 1}
                  scaleY={img.scaleY || 1}
                  draggable
                  onClick={() => setSelectedImageIndex(index)}
                  onTap={() => setSelectedImageIndex(index)}
                />
              ))}
              {!isMobile && selectedImageIndex !== null && <Transformer ref={transformerRef} rotateEnabled={true} />}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
