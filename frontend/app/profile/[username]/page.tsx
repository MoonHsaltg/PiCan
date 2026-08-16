import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Link2, MapPin, MoreHorizontal } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { FollowButton } from "@/components/follow-button";
import { communityArtworks } from "@/lib/mock-data";

type ProfilePageProps = { params: Promise<{ username: string }> };

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const matchingArtwork = communityArtworks.find((artwork) => artwork.username === username);
  const artist = username === "me"
    ? { name: "Phạm Hằng", username: "phamhang.draws", initials: "PH", bio: "Mình gom những khoảnh khắc đời thường bằng màu nước, chì và đôi khi là vài nét còn dang dở.", location: "Hà Nội", followers: 248, following: 132 }
    : {
        name: matchingArtwork?.artist ?? "Minh An",
        username,
        initials: matchingArtwork?.initials ?? "MA",
        bio: "Ký họa những thứ nhỏ bé thường bị bỏ qua: bàn tay, chiếc ghế, một nhánh cây và khoảng lặng giữa chúng.",
        location: "Hà Nội",
        followers: 1240,
        following: 309,
      };

  // Ưu tiên tác phẩm thật của đúng tài khoản, sau đó bổ sung mẫu để bố cục luôn đủ đẹp.
  const ownWorks = communityArtworks.filter((artwork) => artwork.username === artist.username);
  const works = [...ownWorks, ...communityArtworks.filter((artwork) => artwork.username !== artist.username)].slice(0, 4);

  return (
    <AppShell currentUser="Phạm Hằng">
      <main className="standard-page profile-page">
        <Link className="back-link" href="/"><ArrowLeft size={17} /> Quay lại Canvas</Link>

        <section className="profile-hero">
          <div className="profile-banner" aria-hidden="true">
            <span className="profile-scribble profile-scribble-one" />
            <span className="profile-scribble profile-scribble-two" />
          </div>
          <div className="profile-summary">
            <span className="profile-avatar">{artist.initials}</span>
            <div className="profile-primary">
              <div>
                <h1>{artist.name}</h1>
                <p>@{artist.username}</p>
              </div>
              <div className="profile-actions">
                {username === "me" ? <button className="button button-secondary" type="button">Chỉnh sửa hồ sơ</button> : <FollowButton />}
                <button className="icon-button" type="button" aria-label="Thêm tùy chọn"><MoreHorizontal size={20} /></button>
              </div>
            </div>
            <p className="profile-bio">{artist.bio}</p>
            <div className="profile-details">
              <span><MapPin size={16} /> {artist.location}</span>
              <span><Link2 size={16} /> pican.art/{artist.username}</span>
            </div>
            <div className="profile-stats">
              <span><strong>{artist.followers.toLocaleString("vi-VN")}</strong> người theo dõi</span>
              <span><strong>{artist.following}</strong> đang theo dõi</span>
              <span><strong>{works.length}</strong> tác phẩm</span>
            </div>
          </div>
        </section>

        <div className="profile-tabs" role="tablist">
          <button className="is-active" role="tab" type="button">Tác phẩm</button>
          <button role="tab" type="button">Note</button>
          <button role="tab" type="button">Đã lưu</button>
        </div>

        <section className="profile-art-grid">
          {works.map((artwork) => (
            <Link className="profile-artwork" href={`/artworks/${artwork.id}`} key={artwork.id}>
              <Image alt={artwork.title} fill sizes="(max-width: 760px) 48vw, 25vw" src={artwork.image} />
              <span>{artwork.title}</span>
            </Link>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
