"use client";

import {
  Brush,
  CloudUpload,
  Droplets,
  Eraser,
  Highlighter,
  ImagePlus,
  PenTool,
  Pencil,
  Redo2,
  Sparkles,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from "react";

type CreateArtworkDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

type BrushId = "pencil" | "ink" | "marker" | "watercolor" | "pastel" | "spray" | "eraser";

const brushes = [
  { id: "pencil" as const, label: "Bút chì", icon: Pencil },
  { id: "ink" as const, label: "Bút mực", icon: PenTool },
  { id: "marker" as const, label: "Marker", icon: Highlighter },
  { id: "watercolor" as const, label: "Màu nước", icon: Droplets },
  { id: "pastel" as const, label: "Phấn dầu", icon: Brush },
  { id: "spray" as const, label: "Cọ hạt", icon: Sparkles },
  { id: "eraser" as const, label: "Tẩy", icon: Eraser },
];

const colors = ["#292722", "#ef5b3f", "#1f5da8", "#4c8061", "#e5ad2f", "#9a5b8f"];

export function CreateArtworkDialog({ open, onClose, onCreated }: CreateArtworkDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const historyRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const [tab, setTab] = useState<"draw" | "upload">("draw");
  const [brush, setBrush] = useState<BrushId>("pencil");
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState(7);
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!open || tab !== "draw") {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    // Canvas dùng kích thước thật lớn hơn CSS để nét vẽ vẫn sắc trên màn hình retina.
    const ratio = window.devicePixelRatio || 1;
    const bounds = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    context.scale(ratio, ratio);
    context.fillStyle = "#f6eddc";
    context.fillRect(0, 0, bounds.width, bounds.height);
    historyRef.current = [context.getImageData(0, 0, canvas.width, canvas.height)];
  }, [open, tab]);

  if (!open) {
    return null;
  }

  function getPoint(event: PointerEvent<HTMLCanvasElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  function configureBrush(context: CanvasRenderingContext2D) {
    context.globalCompositeOperation = brush === "eraser" ? "destination-out" : "source-over";
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalAlpha = 1;
    context.lineWidth = size;

    if (brush === "pencil") {
      context.globalAlpha = 0.72;
      context.lineWidth = Math.max(1, size * 0.45);
    } else if (brush === "ink") {
      context.lineWidth = Math.max(1, size * 0.65);
    } else if (brush === "marker") {
      context.globalAlpha = 0.35;
      context.lineWidth = size * 2.5;
    } else if (brush === "watercolor") {
      context.globalAlpha = 0.14;
      context.lineWidth = size * 3.2;
    } else if (brush === "pastel") {
      context.globalAlpha = 0.6;
      context.lineWidth = size * 1.6;
    } else if (brush === "eraser") {
      context.lineWidth = size * 2.8;
    }
  }

  function drawSegment(event: PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) {
      return;
    }

    const context = event.currentTarget.getContext("2d");
    const point = getPoint(event);

    if (!context) {
      return;
    }

    configureBrush(context);

    if (brush === "spray") {
      // Cọ hạt rải nhiều chấm nhỏ quanh đầu bút để tạo cảm giác pigment khô.
      for (let index = 0; index < Math.max(14, size * 3); index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * size * 1.6;
        context.globalAlpha = 0.2 + Math.random() * 0.45;
        context.beginPath();
        context.arc(point.x + Math.cos(angle) * radius, point.y + Math.sin(angle) * radius, 0.7 + Math.random(), 0, Math.PI * 2);
        context.fill();
      }
    } else if (brush === "pastel") {
      // Phấn dầu gồm vài nét lệch nhẹ, giúp cạnh không quá sạch như cọ số thông thường.
      for (let index = 0; index < 3; index += 1) {
        context.beginPath();
        context.moveTo(lastPointRef.current.x, lastPointRef.current.y + index - 1);
        context.lineTo(point.x, point.y + index - 1);
        context.stroke();
      }
    } else {
      context.beginPath();
      context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      context.lineTo(point.x, point.y);
      context.stroke();
    }

    lastPointRef.current = point;
  }

  function startDrawing(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = getPoint(event);
    drawSegment(event);
  }

  function stopDrawing(event: PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) {
      return;
    }

    isDrawingRef.current = false;
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");

    if (context) {
      historyRef.current.push(context.getImageData(0, 0, canvas.width, canvas.height));
      redoRef.current = [];
    }
  }

  function restoreHistory(direction: "undo" | "redo") {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    if (direction === "undo" && historyRef.current.length > 1) {
      redoRef.current.push(historyRef.current.pop() as ImageData);
    } else if (direction === "redo" && redoRef.current.length > 0) {
      historyRef.current.push(redoRef.current.pop() as ImageData);
    }

    const snapshot = historyRef.current.at(-1);
    if (snapshot) {
      context.putImageData(snapshot, 0, 0);
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#f6eddc";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
    historyRef.current.push(context.getImageData(0, 0, canvas.width, canvas.height));
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  function publishMock() {
    setIsPublished(true);
    window.setTimeout(() => {
      onCreated?.();
      onClose();
      setIsPublished(false);
      setTitle("");
    }, 650);
  }

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <section
        aria-labelledby="create-dialog-title"
        aria-modal="true"
        className="create-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="dialog-header">
          <div>
            <span className="section-kicker">Ghim ý tưởng mới</span>
            <h2 id="create-dialog-title">Bạn muốn tạo gì hôm nay?</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Đóng">
            <X aria-hidden="true" size={21} />
          </button>
        </header>

        <div className="segmented-control" aria-label="Chọn cách tạo">
          <button className={tab === "draw" ? "is-active" : ""} onClick={() => setTab("draw")} type="button">
            <PenTool size={17} /> Vẽ note
          </button>
          <button className={tab === "upload" ? "is-active" : ""} onClick={() => setTab("upload")} type="button">
            <ImagePlus size={17} /> Tải tranh
          </button>
        </div>

        {tab === "draw" ? (
          <div className="drawing-workspace">
            <div className="drawing-toolbar" aria-label="Dụng cụ vẽ">
              <div className="brush-list">
                {brushes.map(({ id, icon: Icon, label }) => (
                  <button
                    aria-label={label}
                    className={brush === id ? "is-active" : ""}
                    key={id}
                    onClick={() => setBrush(id)}
                    title={label}
                    type="button"
                  >
                    <Icon aria-hidden="true" size={19} />
                  </button>
                ))}
              </div>

              <div className="color-list" aria-label="Màu vẽ">
                {colors.map((swatch) => (
                  <button
                    aria-label={`Chọn màu ${swatch}`}
                    className={color === swatch ? "is-active" : ""}
                    key={swatch}
                    onClick={() => setColor(swatch)}
                    style={{ backgroundColor: swatch }}
                    type="button"
                  />
                ))}
              </div>

              <label className="brush-size">
                <span>Kích thước</span>
                <input min="2" max="28" onChange={(event) => setSize(Number(event.target.value))} type="range" value={size} />
              </label>

              <div className="drawing-history">
                <button aria-label="Hoàn tác" onClick={() => restoreHistory("undo")} title="Hoàn tác" type="button"><Undo2 size={18} /></button>
                <button aria-label="Làm lại" onClick={() => restoreHistory("redo")} title="Làm lại" type="button"><Redo2 size={18} /></button>
                <button aria-label="Xóa trang" onClick={clearCanvas} title="Xóa trang" type="button"><Trash2 size={18} /></button>
              </div>
            </div>

            <canvas
              className="note-canvas"
              onPointerDown={startDrawing}
              onPointerMove={drawSegment}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              ref={canvasRef}
            />
          </div>
        ) : (
          <label className="upload-dropzone">
            {preview ? (
              // Preview chỉ tồn tại trong trình duyệt, chưa upload lên Storage ở bước giao diện này.
              <Image alt="Xem trước tranh đã chọn" fill sizes="(max-width: 760px) 100vw, 900px" src={preview} unoptimized />
            ) : (
              <>
                <span className="dropzone-icon"><CloudUpload size={28} /></span>
                <strong>Chọn tranh từ máy</strong>
                <small>JPG, PNG hoặc WebP · tối đa 10 MB</small>
              </>
            )}
            <input accept="image/jpeg,image/png,image/webp" onChange={handleFile} type="file" />
          </label>
        )}

        <footer className="dialog-footer">
          <label className="dialog-title-field">
            <span>Tên tác phẩm</span>
            <input onChange={(event) => setTitle(event.target.value)} placeholder="Một cái tên thật vừa vặn..." value={title} />
          </label>
          <button className="button button-primary" disabled={isPublished} onClick={publishMock} type="button">
            {isPublished ? "Đang ghim..." : "Ghim lên Canvas"}
          </button>
        </footer>
      </section>
    </div>
  );
}
