import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import useImage from 'use-image';

const URL_MOCKUP = '/mockups/MOCAP_FRONT.png';

export default function EditorCanvas({ image }) {
  const [mockup] = useImage(URL_MOCKUP);
  const [uploadedImage] = useImage(image);
  const [dimensions, setDimensions] = useState({ width: 600, height: 800 });
  const imageRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const canvasWidth = window.innerWidth * 0.5;
      const canvasHeight = window.innerHeight * 0.9;
      setDimensions({ width: canvasWidth, height: canvasHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [uploadedImage]);

  return (
    <div className="w-full h-full flex justify-center items-start">
      <Stage width={dimensions.width} height={dimensions.height} className="border">
        <Layer>
          {mockup && (
            <KonvaImage
              image={mockup}
              width={dimensions.width}
              height={dimensions.height}
              listening={false}
            />
          )}
          {uploadedImage && (
            <KonvaImage
              image={uploadedImage}
              x={dimensions.width / 2 - 100}
              y={dimensions.height / 2 - 150}
              width={200}
              height={200}
              draggable
              ref={imageRef}
            />
          )}
          <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 50 || newBox.height < 50) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
