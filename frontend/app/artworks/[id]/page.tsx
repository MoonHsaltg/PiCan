import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { DeleteArtworkButton } from "@/components/delete-artwork-button";
import { FollowButton } from "@/components/follow-button";
import { communityArtworks } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase-server";

type ArtworkDetailPageProps = {
  params: Promise<{ id: string }>;
};

type ArtworkViewModel = {
  id: string;
  title: string;
  image: string;
  artist: string;
  username: string;
  initials: string;
  medium: string;
  postedAt: string;
  note: string;
  reactions: number;
  comments: number;
  dimensions?: string;
  storagePath?: string;
  isOwnedByCurrentUser: boolean;
};

function getStoragePath(imageUrl: string) {
  // Database lưu cả tên bucket, còn Storage chỉ cần phần đường dẫn bên trong bucket.
  return imageUrl.replace(/^artworks[\\/]/, "");
}

function ArtworkView({ artwork }: { artwork: ArtworkViewModel }) {
  return (
    <AppShell currentUser={artwork.isOwnedByCurrentUser ? artwork.artist : undefined}>
      <main className="artwork-view-page">
        <header className="artwork-view-topbar">
          <Link className="back-link" href={artwork.isOwnedByCurrentUser ? "/gallery" : "/"}>
            <ArrowLeft size={17} />
            {artwork.isOwnedByCurrentUser ? "Quay lại Gallery" : "Quay lại Canvas"}
          </Link>
          <div>
            <button className="icon-button" title="Lưu tác phẩm" type="button" aria-label="Lưu tác phẩm">
              <Bookmark size={19} />
            </button>
            <button className="icon-button" title="Thêm tùy chọn" type="button" aria-label="Thêm tùy chọn">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        <section className="artwork-view-layout">
          <div className="artwork-view-image">
            <Image
              alt={artwork.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 65vw"
              src={artwork.image}
              unoptimized={artwork.image.startsWith("http")}
            />
          </div>

          <aside className="artwork-view-details">
            <div className="artwork-author-row">
              <Link href={`/profile/${artwork.username}`}>
                <span className="avatar avatar-blue">{artwork.initials}</span>
                <span>
                  <strong>{artwork.artist}</strong>
                  <small>@{artwork.username}</small>
                </span>
              </Link>
              {artwork.isOwnedByCurrentUser ? null : <FollowButton compact />}
            </div>

            <p className="section-kicker">{artwork.medium}</p>
            <h1>{artwork.title}</h1>
            <p className="artwork-story">{artwork.note}</p>

            <div className="artwork-engagement">
              <button type="button"><Heart size={20} /> {artwork.reactions}</button>
              <button type="button"><MessageCircle size={20} /> {artwork.comments} lời nhắn</button>
            </div>

            <div className="artwork-info-list">
              <div><span>Đăng lúc</span><strong>{artwork.postedAt}</strong></div>
              <div><span>Quyền xem</span><strong>Công khai</strong></div>
              <div><span>Phương thức</span><strong>Vẽ bởi người dùng</strong></div>
              {artwork.dimensions ? <div><span>Kích thước</span><strong>{artwork.dimensions}</strong></div> : null}
            </div>

            <Link className="ai-check-link" href="/moderation">
              <ShieldCheck size={20} />
              <span><strong>Trạng thái minh bạch</strong><small>Chưa có báo cáo tương đồng</small></span>
            </Link>

            {artwork.isOwnedByCurrentUser && artwork.storagePath ? (
              <DeleteArtworkButton artworkId={artwork.id} storagePath={artwork.storagePath} />
            ) : (
              <button className="quiet-report-button" type="button"><Flag size={16} /> Báo cáo tác phẩm</button>
            )}
          </aside>
        </section>
      </main>
    </AppShell>
  );
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { id } = await params;

  // Các ID mẫu dùng để xem giao diện ngay cả khi chưa đăng nhập hoặc chưa có dữ liệu thật.
  const sampleArtwork = communityArtworks.find((item) => item.id === id);
  if (sampleArtwork) {
    return (
      <ArtworkView
        artwork={{
          ...sampleArtwork,
          note: sampleArtwork.note ?? "Một ghi chép nhỏ về màu, hình và khoảnh khắc mình muốn giữ lại.",
          isOwnedByCurrentUser: false,
        }}
      />
    );
  }

  // Với ID thật, vẫn giữ nguyên luồng bảo mật Supabase và chỉ đọc dữ liệu của người đã đăng nhập.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: storedArtwork, error } = await supabase
    .from("artworks")
    .select("id, title, image_url, image_width, image_height, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!storedArtwork) notFound();

  const storagePath = getStoragePath(storedArtwork.image_url);
  const { data: signedImage } = await supabase.storage
    .from("artworks")
    .createSignedUrl(storagePath, 60 * 10);

  if (!signedImage?.signedUrl) notFound();

  const username = user.email?.split("@")[0] ?? "artist";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <ArtworkView
      artwork={{
        id: storedArtwork.id,
        title: storedArtwork.title,
        image: signedImage.signedUrl,
        artist: username,
        username,
        initials,
        medium: "Tác phẩm cá nhân",
        postedAt: new Date(storedArtwork.created_at).toLocaleString("vi-VN"),
        note: "Tác phẩm được lưu trong Gallery cá nhân của bạn.",
        reactions: 0,
        comments: 0,
        dimensions: `${storedArtwork.image_width} × ${storedArtwork.image_height}`,
        storagePath,
        isOwnedByCurrentUser: true,
      }}
    />
  );
}
