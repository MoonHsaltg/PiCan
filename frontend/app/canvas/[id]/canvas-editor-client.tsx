"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { CanvasItem } from "./canvas-stage";

const CanvasStage = dynamic(
  () => import("./canvas-stage").then((module) => module.CanvasStage),
  {
    ssr: false,
    loading: () => (
      <div className="canvas-stage-loading">Dang tai canvas...</div>
    ),
  },
);

type ArtworkForCanvas = {
  id: string;
  title: string;
  signedUrl: string;
};

type CanvasEditorClientProps = {
  canvasId: string;
  artworks: ArtworkForCanvas[];
};

export function CanvasEditorClient({
  canvasId,
  artworks,
}: CanvasEditorClientProps) {
  const [gridEnabled, setGridEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(24);

  // Items tam thoi dang nam trong state cua trinh duyet.
  const [items, setItems] = useState<CanvasItem[]>([]);

  function addArtwork(artwork: ArtworkForCanvas) {
    setItems((currentItems) => {
      // Moi artwork duoc them co id rieng va vi tri mac dinh.
      const offset = currentItems.length * 24;

      return [
        ...currentItems,
        {
          id: crypto.randomUUID(),
          artworkId: artwork.id,
          title: artwork.title,
          imageUrl: artwork.signedUrl,
          x: 80 + offset,
          y: 80 + offset,
          width: 240,
          height: 180,
        },
      ];
    });
  }

  return (
    <main className="canvas-editor-shell">
      <aside className="canvas-sidebar">
        <p className="eyebrow">Canvas</p>
        <h1>Canvas Editor</h1>

        <section className="canvas-panel">
          <h2>Artwork Library</h2>

          {artworks.length === 0 ? (
            <p>Chua co artwork nao.</p>
          ) : (
            <div className="canvas-artwork-list">
              {artworks.map((artwork) => (
                <button
                  className="canvas-artwork-button"
                  key={artwork.id}
                  onClick={() => addArtwork(artwork)}
                  type="button"
                >
                  <span>{artwork.title}</span>
                  <small>+ Them</small>
                </button>
              ))}
            </div>
          )}
        </section>
      </aside>

      <section className="canvas-main">
        <header className="canvas-toolbar">
          <div>
            <strong>{canvasId}</strong>
            <span className="canvas-status">{items.length} item</span>
          </div>

          <div className="canvas-toolbar-actions">
            <button
              type="button"
              onClick={() => setGridEnabled((current) => !current)}
            >
              {gridEnabled ? "Tat grid" : "Bat grid"}
            </button>

            <label className="grid-size-control">
              Grid size
              <select
                value={gridSize}
                onChange={(event) => setGridSize(Number(event.target.value))}
              >
                <option value={16}>16 px</option>
                <option value={24}>24 px</option>
                <option value={32}>32 px</option>
                <option value={48}>48 px</option>
              </select>
            </label>

            <button type="button">Luu</button>
          </div>
        </header>

        <div className="canvas-viewport">
          <CanvasStage
            gridEnabled={gridEnabled}
            gridSize={gridSize}
            items={items}
          />
        </div>
      </section>

      <aside className="canvas-properties">
        <p className="eyebrow">Properties</p>
        <h2>Item Properties</h2>
        <p>Chon artwork de xem thong tin.</p>
      </aside>
    </main>
  );
}
