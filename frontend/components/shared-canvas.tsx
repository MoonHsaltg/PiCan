"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Grid3X3,
  Heart,
  MessageCircle,
  MousePointer2,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { CreateArtworkDialog } from "@/components/create-artwork-dialog";
import { communityArtworks } from "@/lib/mock-data";

const days = ["Hôm nay", "Hôm qua", "10 tháng 8"] as const;

export function SharedCanvas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const filteredArtworks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");

    if (!normalizedQuery) {
      return communityArtworks;
    }

    return communityArtworks.filter((artwork) =>
      [artwork.title, artwork.artist, artwork.medium]
        .join(" ")
        .toLocaleLowerCase("vi")
        .includes(normalizedQuery),
    );
  }, [query]);

  function toggleLike(id: string) {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function showPublishedToast() {
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2600);
  }

  return (
    <>
      <main className="shared-canvas-page">
        <header className="canvas-page-header">
          <div>
            <p className="section-kicker">Canvas cộng đồng</p>
            <h1>Mọi ý tưởng đều có một chỗ để bắt đầu.</h1>
            <p className="page-description">Tranh mới xuất hiện ở góc trái; mỗi ngày cũ dần trôi sang phải như một cuốn nhật ký chung.</p>
          </div>

          <button className="button button-primary create-button" onClick={() => setDialogOpen(true)} type="button">
            <Plus aria-hidden="true" size={19} />
            Tạo mới
          </button>
        </header>

        <div className="canvas-command-bar">
          <label className="search-field">
            <Search aria-hidden="true" size={18} />
            <input onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tranh, người vẽ, chất liệu..." value={query} />
          </label>

          <div className="canvas-quiet-stats">
            <span><Users size={17} /> 128 người đang xem</span>
            <span><Sparkles size={17} /> 24 ý tưởng hôm nay</span>
          </div>
        </div>

        <section className="timeline-canvas" aria-label="Dòng thời gian tác phẩm cộng đồng">
          <div className="canvas-grid-hint" aria-hidden="true">
            <MousePointer2 size={16} /> Kéo để khám phá
          </div>

          <div className="timeline-columns">
            {days.map((day, dayIndex) => {
              const artworks = filteredArtworks.filter((artwork) => artwork.day === day);

              return (
                <section className="day-column" key={day}>
                  <header className="day-marker">
                    <span>{String(dayIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{day}</strong>
                      <small>{artworks.length} tác phẩm</small>
                    </div>
                  </header>

                  <div className="day-artworks">
                    {artworks.map((artwork, artworkIndex) => {
                      const liked = likedIds.has(artwork.id);

                      return (
                        <article
                          className={`canvas-artwork canvas-artwork-${artwork.aspect}`}
                          key={artwork.id}
                          style={{ transform: `rotate(${artworkIndex % 2 === 0 ? -0.45 : 0.65}deg)` }}
                        >
                          <div className="canvas-artwork-image">
                            <Image alt={artwork.title} fill priority={dayIndex === 0 && artworkIndex === 0} sizes="(max-width: 760px) 88vw, 360px" src={artwork.image} />

                            <div className="artwork-hover-panel">
                              <div className="hover-author">
                                <span className="avatar avatar-ink">{artwork.initials}</span>
                                <div>
                                  <strong>{artwork.artist}</strong>
                                  <small>@{artwork.username}</small>
                                </div>
                              </div>
                              <p>{artwork.note ?? artwork.medium}</p>
                              <Link href={`/artworks/${artwork.id}`}>
                                Xem tác phẩm <ArrowUpRight size={16} />
                              </Link>
                            </div>
                          </div>

                          <div className="canvas-artwork-caption">
                            <div>
                              <h2>{artwork.title}</h2>
                              <p>{artwork.artist} · {artwork.postedAt}</p>
                            </div>
                            <div className="artwork-social-actions">
                              <button className={liked ? "is-liked" : ""} onClick={() => toggleLike(artwork.id)} type="button" aria-label={liked ? "Bỏ yêu thích" : "Yêu thích"}>
                                <Heart fill={liked ? "currentColor" : "none"} size={17} />
                                <span>{artwork.reactions + (liked ? 1 : 0)}</span>
                              </button>
                              <button type="button" aria-label="Bình luận">
                                <MessageCircle size={17} />
                                <span>{artwork.comments}</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}

                    {artworks.length === 0 ? (
                      <div className="empty-day">
                        <Grid3X3 size={23} />
                        <p>Chưa tìm thấy tác phẩm phù hợp.</p>
                      </div>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>

      <button className="floating-create-button" onClick={() => setDialogOpen(true)} type="button" aria-label="Tạo tác phẩm mới">
        <Plus size={23} />
      </button>

      <CreateArtworkDialog onClose={() => setDialogOpen(false)} onCreated={showPublishedToast} open={dialogOpen} />

      {toastVisible ? <div className="success-toast"><Sparkles size={18} /> Ý tưởng đã được ghim lên Canvas.</div> : null}
    </>
  );
}
