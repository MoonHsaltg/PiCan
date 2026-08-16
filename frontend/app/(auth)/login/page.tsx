"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Palette, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    setMessage(""); setIsLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) { setMessage("Email hoặc mật khẩu chưa đúng."); setIsLoading(false); return; }
    router.push("/"); router.refresh();
  }

  return (
    <main className="auth-page">
      <section className="auth-art-panel">
        <Link className="brand brand-on-dark" href="/"><span className="brand-mark">P</span><span>PiCan</span></Link>
        <div className="auth-art-copy"><span><Palette size={19} /> Một canvas luôn còn chỗ trống</span><h1>Ghim lại điều bạn vừa nghĩ tới.</h1><p>Không cần phải hoàn hảo. Một nét vẽ nhỏ cũng đủ để bắt đầu cuộc trò chuyện.</p></div>
        <div className="auth-paper-stack" aria-hidden="true"><span /><span /><span><Sparkles size={32} /></span></div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap"><p className="section-kicker">Chào bạn trở lại</p><h2>Đăng nhập vào PiCan</h2><p>Tiếp tục góc sáng tạo còn đang dang dở.</p>
          <form onSubmit={handleSubmit}>
            <label><span>Email</span><input autoComplete="email" name="email" placeholder="ban@example.com" required type="email" /></label>
            <label><span>Mật khẩu <Link href="#">Quên mật khẩu?</Link></span><div className="password-field"><input autoComplete="current-password" name="password" required type={showPassword ? "text" : "password"} /><button aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            <button className="button button-primary button-wide" disabled={isLoading} type="submit">{isLoading ? "Đang mở Canvas..." : "Đăng nhập"}<ArrowRight size={18} /></button>
            {message ? <p className="form-error">{message}</p> : null}
          </form>
          <p className="auth-switch">Chưa có tài khoản? <Link href="/register">Tạo tài khoản</Link></p>
        </div>
      </section>
    </main>
  );
}
