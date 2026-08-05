"use client";

import { useEffect, useRef, useState } from "react";
import {
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
} from "react-konva";

export type CanvasItem = {
  id: string;
  artworkId: string;
  title: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type CanvasStageProps = {
  gridEnabled: boolean;
  gridSize: number;
  items: CanvasItem[];
};

type StageSize = {
  width: number;
  height: number;
};

const MIN_STAGE_WIDTH = 640;
const MIN_STAGE_HEIGHT = 480;

function ArtworkNode({ item }: { item: CanvasItem }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    // Tao mot HTML Image de Konva co the ve anh len canvas.
    const imageElement = new window.Image();
    imageElement.crossOrigin = "anonymous";

    imageElement.onload = () => {
      if (isActive) {
        setImage(imageElement);
      }
    };

    // Neu URL loi, hien placeholder thay vi lam hong ca canvas.
    imageElement.onerror = () => {
      if (isActive) {
        setHasError(true);
      }
    };

    imageElement.src = item.imageUrl;

    return () => {
      isActive = false;
      imageElement.onload = null;
      imageElement.onerror = null;
    };
  }, [item.imageUrl]);

  if (hasError) {
    return (
      <Group x={item.x} y={item.y}>
        <Rect
          width={item.width}
          height={item.height}
          fill="#eeeeea"
          stroke="#999999"
        />
        <Text
          width={item.width}
          height={item.height}
          text="Khong tai duoc anh"
          align="center"
          verticalAlign="middle"
          fill="#666666"
        />
      </Group>
    );
  }

  if (!image) {
    return null;
  }

  return (
    <KonvaImage
      image={image}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
    />
  );
}

export function CanvasStage({
  gridEnabled,
  gridSize,
  items,
}: CanvasStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [stageSize, setStageSize] = useState<StageSize>({
    width: 800,
    height: 600,
  });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    // Canvas tu thay doi theo kich thuoc viewport.
    const updateStageSize = () => {
      setStageSize({
        width: Math.max(container.clientWidth, MIN_STAGE_WIDTH),
        height: Math.max(container.clientHeight, MIN_STAGE_HEIGHT),
      });
    };

    updateStageSize();

    const observer = new ResizeObserver(updateStageSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const verticalLines = Array.from(
    { length: Math.ceil(stageSize.width / gridSize) + 1 },
    (_, index) => index * gridSize,
  );

  const horizontalLines = Array.from(
    { length: Math.ceil(stageSize.height / gridSize) + 1 },
    (_, index) => index * gridSize,
  );

  return (
    <div ref={containerRef} className="canvas-stage-container">
      <Stage width={stageSize.width} height={stageSize.height}>
        {/* Layer nay chua cac duong grid */}
        <Layer>
          {gridEnabled &&
            verticalLines.map((x) => (
              <Line
                key={`vertical-${x}`}
                points={[x, 0, x, stageSize.height]}
                stroke="#e3e3de"
                strokeWidth={1}
              />
            ))}

          {gridEnabled &&
            horizontalLines.map((y) => (
              <Line
                key={`horizontal-${y}`}
                points={[0, y, stageSize.width, y]}
                stroke="#e3e3de"
                strokeWidth={1}
              />
            ))}
        </Layer>

        {/* Layer nay chua cac artwork duoc them vao canvas */}
        <Layer>
          {items.map((item) => (
            <ArtworkNode item={item} key={item.id} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
