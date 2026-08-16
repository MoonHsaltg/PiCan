import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderHeart, Grid2X2, List, Plus, Settings2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { LogoutButton } from "@/components/logout-button";
import { communityArtworks } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase-server";

type Artwork = {
  id: string;
  title: string;
  image_url: string;
  image_width: number;
  image_height: number;
  created_at: string;
};

type ArtworkWithImage = Artwork & { signedUrl: string | null };

function getStoragePath(imageUrl: string) {
  return imageUrl.replace(/^artworks[\\/]/, "");
}

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: artworks, error }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
    supabase.from("artworks").select("id, title, image_url, image_width, image_height, created_at").order("created_at", { ascending: false }),
  ]);

  if (error) {
    throw error;
  }

  const artworksWithImages: ArtworkWithImage[] = await Promise.all(
    ((artworks ?? []) as Artwork[]).map(async (artwork) => {
      const { data } = await supabase.storage.from("artworks").createSignedUrl(getStoragePath(artwork.image_url), 60 * 10);
      return { ...artwork, signedUrl: data?.signedUrl ?? null };
    }),
  );

  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "bạn";

  return (
    <AppShell currentUser={displayName}>
      <main className="standard-page gallery-page">
        <header className="gallery-profile-header">
          <div className="gallery-profile-copy">
            <span className="gallery-avatar">PH</span>
            <div>
              <p className="section-kicker">Gallery cá nhân</p>
              <h1>Góc vẽ của {displayName}</h1>
              <p className="page-description">Nơi bạn giữ lại những tác phẩm đã hoàn thành và cả những ý tưởng còn đang lớn lên.</p>
            </div>
          </div>
          <div className="gallery-actions">
            <Link className="button button-primary" href="/upload"><Plus size={18} /> Thêm tác phẩm</Link>
            <button className="icon-button" title="Cài đặt Gallery" type="button" aria-label="Cài đặt Gallery"><Settings2 size={19} /></button>
            <LogoutButton />
          </div>
        </header>

        <section className="gallery-stats">
          <div><strong>{artworksWithImages.length || 4}</strong><span>Tác phẩm</span></div>
          <div><strong>248</strong><span>Người theo dõi</span></div>
          <div><strong>12</strong><span>Bộ sưu tập</span></div>
          <Link href="/profile/me">Xem hồ sơ công khai</Link>
        </section>

        <div className="gallery-toolbar">
          <div className="gallery-tabs"><button className="is-active" type="button">Tất cả</button><button type="button">Tranh</button><button type="button">Note</button><button type="button">Bản nháp</button></div>
          <div className="view-switcher"><button className="is-active" aria-label="Dạng lưới" title="Dạng lưới" type="button"><Grid2X2 size={18} /></button><button aria-label="Dạng danh sách" title="Dạng danh sách" type="button"><List size={19} /></button></div>
        </div>

        {artworksWithImages.length > 0 ? (
          <section className="personal-art-grid">
            {artworksWithImages.map((artwork, index) => (
              <Link className={`personal-art-card personal-art-${index % 3 === 1 ? "tall" : "standard"}`} href={`/artworks/${artwork.id}`} key={artwork.id}>
                <div className="personal-art-image">
                  {artwork.signedUrl ? <Image alt={artwork.title} fill sizes="(max-width: 760px) 48vw, 28vw" src={artwork.signedUrl} unoptimized /> : <div className="artwork-placeholder">Không tải được ảnh</div>}
                </div>
                <div><h2>{artwork.title}</h2><p>{new Date(artwork.created_at).toLocaleDateString("vi-VN")} · {artwork.image_width} × {artwork.image_height}</p></div>
              </Link>
            ))}
          </section>
        ) : (
          <section className="personal-art-grid" aria-label="Dữ liệu mẫu Gallery">
            {communityArtworks.slice(0, 4).map((artwork, index) => (
              <Link className={`personal-art-card personal-art-${index % 3 === 1 ? "tall" : "standard"}`} href={`/artworks/${artwork.id}`} key={artwork.id}>
                <div className="personal-art-image"><Image alt={artwork.title} fill sizes="(max-width: 760px) 48vw, 28vw" src={artwork.image} /></div>
                <div><h2>{artwork.title}</h2><p>{artwork.medium} · Bản giao diện mẫu</p></div>
              </Link>
            ))}
            <Link className="gallery-empty-prompt" href="/upload"><FolderHeart size={28} /><strong>Ghim tác phẩm đầu tiên</strong><span>Upload một bức tranh hoặc vẽ note ngay trên PiCan.</span></Link>
          </section>
        )}
      </main>
    </AppShell>
  );
}
