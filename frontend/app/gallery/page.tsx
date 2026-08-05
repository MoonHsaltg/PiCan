import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase-server";

type Artwork = {
  id: string;
  title: string;
  image_url: string;
  image_width: number;
  image_height: number;
  created_at: string;
};

type ArtworkWithImage = Artwork & {
  signedUrl: string | null;
};

function getStoragePath(imageUrl: string) {
  return imageUrl.replace(/^artworks\//, "");
}

export default async function GalleryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("id, title, image_url, image_width, image_height, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const artworksWithImages: ArtworkWithImage[] = await Promise.all(
    ((artworks ?? []) as Artwork[]).map(async (artwork) => {
      const { data } = await supabase.storage
        .from("artworks")
        .createSignedUrl(getStoragePath(artwork.image_url), 60 * 10);

      return {
        ...artwork,
        signedUrl: data?.signedUrl ?? null,
      };
    }),
  );

  const displayName = profile?.display_name ?? user.email ?? "bạn";

  return (
    <main className="content-page gallery-page">
      <header className="gallery-header">
        <div>
          <p className="eyebrow">Personal Gallery</p>
          <h1>Tranh của {displayName}</h1>
        </div>

        <div className="gallery-actions">
          <Link className="primary-action" href="/upload">
            Upload tranh
          </Link>
          <LogoutButton />
        </div>
      </header>

      {artworksWithImages.length > 0 ? (
        <section className="artwork-grid">
          {artworksWithImages.map((artwork) => (
            <Link
              className="artwork-card"
              href={`/artworks/${artwork.id}`}
              key={artwork.id}
            >
              {artwork.signedUrl ? (
                <img alt={artwork.title} src={artwork.signedUrl} />
              ) : (
                <div className="artwork-placeholder">Không tải được ảnh</div>
              )}

              <div className="artwork-card-body">
                <h2>{artwork.title}</h2>
                <p>
                  {artwork.image_width} x {artwork.image_height}
                </p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <p>Chưa có tranh nào. Hãy upload tranh đầu tiên của bạn.</p>
      )}
    </main>
  );
}
