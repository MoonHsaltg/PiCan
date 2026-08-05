import { redirect } from "next/navigation";

import { CanvasEditorClient } from "./canvas-editor-client";
import { createClient } from "@/lib/supabase-server";

type CanvasPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ArtworkRecord = {
  id: string;
  title: string;
  image_url: string;
};

function getStoragePath(imageUrl: string) {
  // Bo tien to bucket truoc khi goi Storage.
  return imageUrl.replace(/^artworks[\\/]/, "");
}

export default async function CanvasPage({ params }: CanvasPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Kiem tra dang nhap o server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("id, title, image_url")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  // Tao signed URL de client co the doc bucket private.
  const artworksForCanvas = await Promise.all(
    ((artworks ?? []) as ArtworkRecord[]).map(async (artwork) => {
      const { data } = await supabase.storage
        .from("artworks")
        .createSignedUrl(getStoragePath(artwork.image_url), 60 * 10);

      return {
        id: artwork.id,
        title: artwork.title,
        signedUrl: data?.signedUrl ?? null,
      };
    }),
  );

  // Chi truyen nhung artwork tao duoc URL hop le.
  const availableArtworks = artworksForCanvas.filter(
    (
      artwork,
    ): artwork is {
      id: string;
      title: string;
      signedUrl: string;
    } => artwork.signedUrl !== null,
  );

  return <CanvasEditorClient canvasId={id} artworks={availableArtworks} />;
}
