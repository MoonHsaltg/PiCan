import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DeleteArtworkButton } from "@/components/delete-artwork-button";
import { createClient } from "@/lib/supabase-server";

type ArtworkDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getStoragePath(imageUrl: string) {
  // Database luu dang artworks/user-id/file.jpg,
  // con Storage can phan sau artworks/.
  return imageUrl.replace(/^artworks[\\/]/, "");
}

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Chi user da dang nhap moi duoc xem artwork.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: artwork, error } = await supabase
    .from("artworks")
    .select("id, title, image_url, image_width, image_height, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!artwork) {
    notFound();
  }

  // Tao URL tam thoi de hien anh tu bucket private.
  const storagePath = getStoragePath(artwork.image_url);
  const { data: signedImage } = await supabase.storage
    .from("artworks")
    .createSignedUrl(storagePath, 60 * 10);

  return (
    <main className="content-page artwork-detail-page">
      <Link href="/gallery">Quay lai Gallery</Link>

      <p className="eyebrow">Artwork Detail</p>
      <h1>{artwork.title}</h1>

      {signedImage?.signedUrl ? (
        <img alt={artwork.title} src={signedImage.signedUrl} />
      ) : (
        <p>Khong tai duoc anh.</p>
      )}

      <dl className="artwork-meta">
        <div>
          <dt>Kich thuoc</dt>
          <dd>
            {artwork.image_width} x {artwork.image_height}
          </dd>
        </div>

        <div>
          <dt>Ngay tao</dt>
          <dd>{new Date(artwork.created_at).toLocaleString("vi-VN")}</dd>
        </div>
      </dl>

      <DeleteArtworkButton artworkId={artwork.id} storagePath={storagePath} />
    </main>
  );
}
