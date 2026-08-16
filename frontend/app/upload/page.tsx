"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CloudUpload, ImageIcon, Info, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;
const minImageSize = 512;
const maxImageSize = 8000;

function readImageSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(imageUrl); };
    image.onerror = () => { URL.revokeObjectURL(imageUrl); reject(new Error("Không đọc được kích thước ảnh.")); };
    image.src = imageUrl;
  });
}

export default function UploadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
    }
    loadUser();
  }, [router]);

  function selectFile(nextFile: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(nextFile);
    setPreview(nextFile ? URL.createObjectURL(nextFile) : null);
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) { setMessage("Bạn cần đăng nhập trước khi upload."); return; }
    if (!title.trim()) { setMessage("Vui lòng nhập tên tranh."); return; }
    if (!file) { setMessage("Vui lòng chọn ảnh."); return; }
    if (!allowedTypes.includes(file.type)) { setMessage("Chỉ hỗ trợ JPG, PNG hoặc WebP."); return; }
    if (file.size > maxFileSize) { setMessage("Ảnh không được vượt quá 10 MB."); return; }

    setIsUploading(true);
    setMessage("Đang chuẩn bị góc trưng bày...");
    const supabase = createClient();

    try {
      const { width, height } = await readImageSize(file);
      if (width < minImageSize || height < minImageSize) throw new Error("Ảnh phải có kích thước tối thiểu 512 × 512.");
      if (width > maxImageSize || height > maxImageSize) throw new Error("Ảnh không được vượt quá 8000 × 8000.");

      const safeFileName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const filePath = `${userId}/${crypto.randomUUID()}-${safeFileName}`;
      const { error: uploadError } = await supabase.storage.from("artworks").upload(filePath, file, { cacheControl: "3600", contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { error: insertError } = await supabase.from("artworks").insert({ user_id: userId, title: title.trim(), image_url: `artworks/${filePath}`, image_width: width, image_height: height });
      if (insertError) throw insertError;

      setMessage("Tác phẩm đã được lưu vào Gallery.");
      window.setTimeout(() => router.push("/gallery"), 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload thất bại.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <AppShell>
      <main className="standard-page upload-page">
        <Link className="back-link" href="/gallery"><ArrowLeft size={17} /> Quay lại Gallery</Link>
        <header className="standard-page-header"><div><p className="section-kicker">Tác phẩm mới</p><h1>Đặt tranh vào góc của bạn.</h1><p className="page-description">Thêm một chút ngữ cảnh để người xem hiểu điều bạn muốn giữ lại.</p></div><div className="header-symbol"><ImageIcon size={28} /></div></header>

        <form className="upload-layout" onSubmit={handleSubmit}>
          <label className={`upload-preview ${preview ? "has-preview" : ""}`}>
            {preview ? <Image alt="Xem trước tác phẩm" fill sizes="(max-width: 760px) 94vw, 50vw" src={preview} unoptimized /> : <><span className="dropzone-icon"><CloudUpload size={30} /></span><strong>Thả ảnh vào đây</strong><span>hoặc bấm để chọn từ máy</span><small>JPG, PNG, WebP · 512–8000 px · tối đa 10 MB</small></>}
            <input accept="image/jpeg,image/png,image/webp" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} type="file" />
          </label>

          <div className="upload-fields">
            <label><span>Tên tác phẩm</span><input onChange={(event) => setTitle(event.target.value)} placeholder="Ví dụ: Cửa sổ lúc 18:42" value={title} /></label>
            <label><span>Mô tả</span><textarea onChange={(event) => setDescription(event.target.value)} placeholder="Ý tưởng, chất liệu hoặc câu chuyện phía sau..." rows={5} value={description} /></label>
            <label><span>Chất liệu</span><select defaultValue="watercolor"><option value="watercolor">Màu nước</option><option value="gouache">Gouache</option><option value="digital">Digital art</option><option value="sketch">Ký họa</option><option value="mixed">Mixed media</option></select></label>
            <label><span>Hiển thị</span><select defaultValue="public"><option value="public">Công khai trên Canvas</option><option value="followers">Chỉ người theo dõi</option><option value="private">Chỉ mình tôi</option></select></label>
            <div className="upload-notice"><Info size={18} /><p>Khi đăng công khai, tác phẩm có thể được báo cáo để kiểm tra tương đồng. AI không tự kết luận vi phạm.</p></div>
            <button className="button button-primary button-wide" disabled={isUploading} type="submit"><Sparkles size={18} />{isUploading ? "Đang tải lên..." : "Lưu vào Gallery"}</button>
            {message ? <p className="form-message"><CheckCircle2 size={17} /> {message}</p> : null}
          </div>
        </form>
      </main>
    </AppShell>
  );
}
