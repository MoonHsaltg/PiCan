"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase";

type DeleteArtworkButtonProps = {
  artworkId: string;
  storagePath: string;
};

export function DeleteArtworkButton({
  artworkId,
  storagePath,
}: DeleteArtworkButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm("Bạn có chắc muốn xóa tranh này không?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setMessage("Đang xóa...");

    const supabase = createClient();

    const { error: storageError } = await supabase.storage
      .from("artworks")
      .remove([storagePath]);

    if (storageError) {
      setMessage(storageError.message);
      setIsDeleting(false);
      return;
    }

    const { error: databaseError } = await supabase
      .from("artworks")
      .delete()
      .eq("id", artworkId);

    if (databaseError) {
      setMessage(databaseError.message);
      setIsDeleting(false);
      return;
    }

    router.push("/gallery");
    router.refresh();
  }

  return (
    <div className="delete-artwork-action">
      <button disabled={isDeleting} onClick={handleDelete} type="button">
        {isDeleting ? "Đang xóa..." : "Xóa tranh"}
      </button>

      {message ? <p>{message}</p> : null}
    </div>
  );
}
