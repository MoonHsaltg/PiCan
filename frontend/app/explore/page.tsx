"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { FollowButton } from "@/components/follow-button";
import { communityArtworks, suggestedArtists } from "@/lib/mock-data";

const filters = ["Dành cho bạn", "Màu nước", "Ký họa", "Mixed media", "Gouache"];

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return communityArtworks.filter((artwork) => {
      const matchesQuery = !normalized || [artwork.title, artwork.artist, artwork.medium].join(" ").toLocaleLowerCase("vi").includes(normalized);
      const matchesFilter = activeFilter === "Dành cho bạn" || artwork.medium.toLocaleLowerCase("vi").includes(activeFilter.toLocaleLowerCase("vi"));
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query]);

  return (
    <AppShell>
      <main className="standard-page explore-page">
        <header className="standard-page-header">
          <div>
            <p className="section-kicker">Khám phá</p>
            <h1>Tìm một nét vẽ khiến bạn dừng lại.</h1>
          </div>
          <div className="header-symbol"><Sparkles size={28} /></div>
        </header>

        <label className="explore-search">
          <Search size={21} />
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tác phẩm, tác giả hoặc chất liệu" value={query} />
          <button aria-label="Bộ lọc tìm kiếm" title="Bộ lọc" type="button"><SlidersHorizontal size={19} /></button>
        </label>

        <div className="filter-tabs" role="tablist" aria-label="Lọc nội dung">
          {filters.map((filter) => (
            <button className={activeFilter === filter ? "is-active" : ""} key={filter} onClick={() => setActiveFilter(filter)} role="tab" type="button">
              {filter}
            </button>
          ))}
        </div>

        <section className="explore-layout">
          <div>
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">Đang được chú ý</span>
                <h2>Tác phẩm nổi bật</h2>
              </div>
              <TrendingUp aria-hidden="true" size={22} />
            </div>

            <div className="masonry-grid">
              {filtered.map((artwork) => (
                <Link className={`discovery-card discovery-${artwork.aspect}`} href={`/artworks/${artwork.id}`} key={artwork.id}>
                  <div className="discovery-image">
                    <Image alt={artwork.title} fill sizes="(max-width: 760px) 94vw, 33vw" src={artwork.image} />
                  </div>
                  <div className="discovery-caption">
                    <div>
                      <h3>{artwork.title}</h3>
                      <p>{artwork.artist}</p>
                    </div>
                    <span>{artwork.medium}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="artist-suggestions">
            <span className="section-kicker">Gợi ý kết nối</span>
            <h2>Người vẽ bạn có thể thích</h2>
            {suggestedArtists.map((artist, index) => (
              <article className="artist-suggestion" key={artist.username}>
                <Link href={`/profile/${artist.username}`} className="artist-identity">
                  <span className={`avatar avatar-${index === 0 ? "blue" : index === 1 ? "green" : "coral"}`}>{artist.initials}</span>
                  <span>
                    <strong>{artist.name}</strong>
                    <small>{artist.medium} · @{artist.username}</small>
                  </span>
                </Link>
                <FollowButton compact />
              </article>
            ))}
          </aside>
        </section>
      </main>
    </AppShell>
  );
}
