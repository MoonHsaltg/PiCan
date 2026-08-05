"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;
const minImageSize = 512;
const maxImageSize = 8000;

function readImageSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      URL.revokeObjectURL(imageUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Không đọc được kích thước ảnh."));
    };

    image.src = imageUrl;
  });
}

export default function UploadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
    }

    loadUser();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setMessage("Bạn cần đăng nhập trước khi upload.");
      return;
    }

    if (!title.trim()) {
      setMessage("Vui lòng nhập tên tranh.");
      return;
    }

    if (!file) {
      setMessage("Vui lòng chọn ảnh.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setMessage("Chỉ hỗ trợ JPG, PNG hoặc WebP.");
      return;
    }

    if (file.size > maxFileSize) {
      setMessage("Ảnh không được vượt quá 10MB.");
      return;
    }

    setIsUploading(true);
    setMessage("Đang upload...");

    const supabase = createClient();

    try {
      const { width, height } = await readImageSize(file);

      if (width < minImageSize || height < minImageSize) {
        setMessage("Ảnh phải có kích thước tối thiểu 512 x 512.");
        return;
      }

      if (width > maxImageSize || height > maxImageSize) {
        setMessage("Ảnh không được vượt quá 8000 x 8000.");
        return;
      }

      const safeFileName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const filePath = `${userId}/${crypto.randomUUID()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("artworks")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { error: insertError } = await supabase.from("artworks").insert({
        user_id: userId,
        title: title.trim(),
        image_url: `artworks/${filePath}`,
        image_width: width,
        image_height: height,
      });

      if (insertError) {
        throw insertError;
      }

      setTitle("");
      setFile(null);
      setMessage("Upload thành công.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload thất bại.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="form-page">
      <p className="eyebrow">Artwork Upload</p>
      <h1>Upload tranh</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Tên tranh
          <input
            onChange={(event) => setTitle(event.target.value)}
            type="text"
            value={title}
          />
        </label>

        <label>
          File ảnh
          <input
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>

        <button disabled={isUploading} type="submit">
          {isUploading ? "Đang upload..." : "Upload"}
        </button>
      </form>

      {message ? <p>{message}</p> : null}
    </main>
  );
}
