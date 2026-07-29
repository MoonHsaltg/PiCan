import Link from "next/link";

const features = [
  "User Authentication",
  "Artwork Upload",
  "Personal Gallery",
  "Infinite Canvas",
  "AI Image Check",
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <strong>PiCan</strong>
        <nav aria-label="Điều hướng chính">
          <Link href="/login">Đăng nhập</Link>
          <Link href="/register">Đăng ký</Link>
        </nav>
      </header>

      <section className="intro">
        <p className="eyebrow">MVP</p>
        <h1>Không gian làm việc cho bộ sưu tập nghệ thuật cá nhân</h1>
        <p>
          Upload tranh, quản lý gallery, sắp xếp trên canvas và kiểm tra ảnh bằng
          dịch vụ AI.
        </p>
        <Link className="primary-action" href="/gallery">
          Mở Gallery
        </Link>
      </section>

      <section className="feature-list" aria-label="Tính năng MVP">
        {features.map((feature) => (
          <article key={feature}>
            <h2>{feature}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
