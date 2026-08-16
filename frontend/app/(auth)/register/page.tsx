"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Check, PencilLine, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const displayName = String(formData.get("displayName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    setMessage("");
    if (!displayName || !email || !password) { setMessage("Vui lòng nhập đầy đủ thông tin."); return; }
    if (password.length < 8) { setMessage("Mật khẩu phải có ít nhất 8 ký tự."); return; }
    if (password !== confirmPassword) { setMessage("Hai mật khẩu chưa giống nhau."); return; }
    setIsLoading(true);
    const { error } = await createClient().auth.signUp({ email, password, options: { data: { display_name: displayName } } });
    if (error) setMessage(error.message);
    else { form.reset(); setMessage("Tạo tài khoản thành công. Hãy kiểm tra email xác nhận."); }
    setIsLoading(false);
  }

  return (
    <main className="auth-page auth-register-page">
      <section className="auth-art-panel auth-register-art">
        <Link className="brand brand-on-dark" href="/"><span className="brand-mark">P</span><span>PiCan</span></Link>
        <div className="auth-art-copy"><span><Sparkles size={19} /> Không gian cho người thích tạo</span><h1>Mang theo sự tò mò. Phần còn lại để Canvas lo.</h1><div className="auth-benefits"><p><Check size={18} /> Vẽ note ngay trên web</p><p><Check size={18} /> Gặp những người cùng chất liệu</p><p><Check size={18} /> Giữ Gallery của riêng bạn</p></div></div>
        <PencilLine className="auth-large-icon" size={128} strokeWidth={1} aria-hidden="true" />
      </section>
      <section className="auth-form-panel"><div className="auth-form-wrap register-form-wrap"><p className="section-kicker">Bắt đầu một góc mới</p><h2>Tạo tài khoản</h2><p>Chỉ mất một phút để đặt chiếc ghim đầu tiên.</p>
        <form onSubmit={handleSubmit}>
          <label><span>Tên hiển thị</span><input autoComplete="name" name="displayName" placeholder="Bạn muốn được gọi là gì?" required /></label>
          <label><span>Email</span><input autoComplete="email" name="email" placeholder="ban@example.com" required type="email" /></label>
          <div className="form-two-columns"><label><span>Mật khẩu</span><input autoComplete="new-password" minLength={8} name="password" required type="password" /></label><label><span>Nhập lại</span><input autoComplete="new-password" minLength={8} name="confirmPassword" required type="password" /></label></div>
          <small className="field-hint">Tối thiểu 8 ký tự.</small>
          <label className="terms-check"><input required type="checkbox" /><span>Mình đồng ý với nguyên tắc cộng đồng và chính sách quyền riêng tư.</span></label>
          <button className="button button-primary button-wide" disabled={isLoading} type="submit">{isLoading ? "Đang tạo góc của bạn..." : "Tạo tài khoản"}<ArrowRight size={18} /></button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
        <p className="auth-switch">Đã có tài khoản? <Link href="/login">Đăng nhập</Link></p>
      </div></section>
    </main>
  );
}
