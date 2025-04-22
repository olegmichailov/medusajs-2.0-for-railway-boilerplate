"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Transformer } from "react-konva";
import useImage from "use-image";

const CANVAS_WIDTH = 985;
const CANVAS_HEIGHT = 1271;

const EditorCanvas = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const displayWidth = isMobile ? window.innerWidth - 32 : 500;
  const displayHeight = (displayWidth * CANVAS_HEIGHT) / CANVAS_WIDTH;

  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [mockupType, setMockupType] = useState<"front" | "back">("front");
  const [copiedImage, setCopiedImage] = useState<any | null>(null);
  const [drawings, setDrawings] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#d63384");
  const [brushSize, setBrushSize] = useState(4);

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

  const handleMouseDown = (e: any) => {
    const pos = stageRef.current.getPointerPosition();
    if (!pos) return;
    setIsDrawing(true);
    const scaled = scalePos(pos);
    setDrawings([...drawings, { tool: "pen", color: brushColor, size: brushSize, points: [scaled.x, scaled.y] }]);
    if (e.target === e.target.getStage()) {
      setSelectedImageIndex(null);
    }
  };

  const handleMouseMove = () => {
    if (!isDrawing) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    if (!point) return;
    const scaled = scalePos(point);
    let lastLine = drawings[drawings.length - 1];
    lastLine.points = lastLine.points.concat([scaled.x, scaled.y]);
    drawings.splice(drawings.length - 1, 1, lastLine);
    setDrawings(drawings.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const scalePos = (pos: { x: number; y: number }) => ({
    x: (pos.x * CANVAS_WIDTH) / displayWidth,
    y: (pos.y * CANVAS_HEIGHT) / displayHeight,
  });

  return (
    <div className="flex flex-col items-center justify-start w-screen min-h-screen bg-white p-4">
      <div className="w-full max-w-[600px] flex flex-col gap-4">
        <label className="text-sm font-semibold">Upload Print</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <label className="text-sm font-semibold">Opacity: {Math.round(opacity * 100)}%</label>
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
          className="w-full h-[2px] bg-black appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-none"
        />
        <div className="flex gap-2">
          <button className="border px-4 py-2" onClick={() => setMockupType("front")}>Front</button>
          <button className="border px-4 py-2" onClick={() => setMockupType("back")}>Back</button>
        </div>
      </div>

      <div className="mt-6 border border-dashed border-gray-400" style={{ width: displayWidth, height: displayHeight }}>
        <Stage
          width={displayWidth}
          height={displayHeight}
          scale={{ x: displayWidth / CANVAS_WIDTH, y: displayHeight / CANVAS_HEIGHT }}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            {mockupImage && (
              <KonvaImage image={mockupImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
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
            {drawings.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.size}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation="source-over"
              />
            ))}
            {!isMobile && selectedImageIndex !== null && (
              <Transformer ref={transformerRef} rotateEnabled={true} />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default EditorCanvas;
