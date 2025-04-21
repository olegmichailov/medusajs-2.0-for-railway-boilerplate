import React, { useState, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

const mockupFrontUrl = "/mockups/MOCAP_FRONT.png";
const mockupBackUrl = "/mockups/MOCAP_BACK.png";

const EditorCanvas = () => {
  const [mockupUrl] = useState(mockupFrontUrl); // TODO: Add UI to switch
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageProps, setImageProps] = useState({
    x: 400,
    y: 100,
    width: 200,
    height: 200,
    rotation: 0,
  });

  const [mockup] = useImage(mockupUrl);
  const [printImage] = useImage(uploadedImage);

  const imageRef = useRef(null);
  const transformerRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransformEnd = () => {
    if (imageRef.current) {
      const node = imageRef.current;
      setImageProps({
        x: node.x(),
        y: node.y(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
        rotation: node.rotation(),
      });
    }
  };

  return (
    <div className="flex flex-row w-full h-[calc(100vh-100px)]">
      <div className="w-1/2 p-10">
        <h2 className="text-2xl font-bold mb-4">Upload Print</h2>
        <input type="file" onChange={handleFileChange} />
        <p className="text-sm text-gray-600 mt-2">Drag, scale, rotate print freely</p>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white">
        <Stage width={CANVAS_WIDTH / 2} height={CANVAS_HEIGHT}>
          <Layer>
            {mockup && <KonvaImage image={mockup} width={CANVAS_WIDTH / 2} height={(CANVAS_WIDTH / 2) * (mockup.height / mockup.width)} />}
            {printImage && (
              <>
                <KonvaImage
                  image={printImage}
                  {...imageProps}
                  draggable
                  onTransformEnd={handleTransformEnd}
                  onDragEnd={handleTransformEnd}
                  ref={imageRef}
                />
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                    return newBox;
                  }}
                  anchorSize={8}
                  anchorStrokeWidth={1}
                />
              </>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default EditorCanvas;
