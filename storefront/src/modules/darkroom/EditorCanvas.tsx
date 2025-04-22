// STEP 1: Layers refactor

"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Text as KonvaText, Transformer } from "react-konva";
import useImage from "use-image";
import { isMobile } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";

const CANVAS_WIDTH = 985;
const CANVAS_HEIGHT = 1271;
const DISPLAY_HEIGHT = isMobile ? 680 : 750;
const DISPLAY_WIDTH = (DISPLAY_HEIGHT * CANVAS_WIDTH) / CANVAS_HEIGHT;

const EditorCanvas = () => {
  const [mockupType, setMockupType] = useState<"front" | "back">("front");
  const [layers, setLayers] = useState<any[]>([]); // holds drawings, images, text
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState<"move" | "brush">("brush");

  const [mockupImage] = useImage(mockupType === "front" ? "/mockups/MOCAP_FRONT.png" : "/mockups/MOCAP_BACK.png");

  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (transformerRef.current && selectedId !== null) {
      const stage = transformerRef.current.getStage();
      const node = stage.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const scalePos = (pos: { x: number; y: number }) => ({
    x: (pos.x * CANVAS_WIDTH) / DISPLAY_WIDTH,
    y: (pos.y * CANVAS_HEIGHT) / DISPLAY_HEIGHT,
  });

  const handlePointerDown = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }

    if (mode === "brush") {
      const pos = stageRef.current.getPointerPosition();
      if (!pos) return;
      const scaled = scalePos(pos);
      const id = uuidv4();
      const newLine = {
        id,
        type: "drawing",
        points: [scaled.x, scaled.y],
        color: brushColor,
        size: brushSize,
      };
      setLayers((prev) => [...prev, newLine]);
      setIsDrawing(true);
    }
  };

  const handlePointerMove = () => {
    if (!isDrawing || mode !== "brush") return;
    const pos = stageRef.current.getPointerPosition();
    if (!pos) return;
    const scaled = scalePos(pos);
    const last = layers[layers.length - 1];
    if (last?.type !== "drawing") return;
    last.points = [...last.points, scaled.x, scaled.y];
    setLayers([...layers.slice(0, -1), last]);
  };

  const handlePointerUp = () => setIsDrawing(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          const id = uuidv4();
          const newImg = {
            id,
            type: "image",
            image: img,
            x: 100,
            y: 100,
            width: img.width / 4,
            height: img.height / 4,
            rotation: 0,
            opacity: 1,
          };
          setLayers((prev) => [...prev, newImg]);
          setSelectedId(id);
          setMode("move");
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <div className="w-1/2 p-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={() => setMode("brush")}>Brush</button>
        <button onClick={() => setMode("move")}>Move</button>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}>
          <Stage
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            scale={{ x: DISPLAY_WIDTH / CANVAS_WIDTH, y: DISPLAY_HEIGHT / CANVAS_HEIGHT }}
            ref={stageRef}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            onMousemove={handlePointerMove}
            onTouchMove={handlePointerMove}
            onMouseup={handlePointerUp}
            onTouchEnd={handlePointerUp}
          >
            <Layer>
              {mockupImage && <KonvaImage image={mockupImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />}

              {layers.map((layer) => {
                if (layer.type === "image") {
                  return (
                    <KonvaImage
                      key={layer.id}
                      id={layer.id}
                      image={layer.image}
                      x={layer.x}
                      y={layer.y}
                      width={layer.width}
                      height={layer.height}
                      rotation={layer.rotation}
                      opacity={layer.opacity}
                      draggable={mode === "move"}
                      onClick={() => setSelectedId(layer.id)}
                      onTap={() => setSelectedId(layer.id)}
                    />
                  );
                }
                if (layer.type === "drawing") {
                  return (
                    <Line
                      key={layer.id}
                      id={layer.id}
                      points={layer.points}
                      stroke={layer.color}
                      strokeWidth={layer.size}
                      tension={0.5}
                      lineCap="round"
                      globalCompositeOperation="source-over"
                    />
                  );
                }
                return null;
              })}

              {selectedId && <Transformer ref={transformerRef} />}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
