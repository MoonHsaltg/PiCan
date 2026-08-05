"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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

    if (!displayName || !email || !password) {
      setMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password.length < 8) {
      setMessage("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Hai mật khẩu không giống nhau.");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      form.reset();
      setMessage("Đăng ký thành công. Hãy kiểm tra email xác nhận.");
    }

    setIsLoading(false);
  }

  return (
    <main className="form-page">
      <p className="eyebrow">PiCan</p>
      <h1>Tạo tài khoản</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Tên hiển thị
          <input autoComplete="name" name="displayName" required type="text" />
        </label>

        <label>
          Email
          <input autoComplete="email" name="email" required type="email" />
        </label>

        <label>
          Mật khẩu
          <input
            autoComplete="new-password"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </label>

        <label>
          Nhập lại mật khẩu
          <input
            autoComplete="new-password"
            minLength={8}
            name="confirmPassword"
            required
            type="password"
          />
        </label>

        <button disabled={isLoading} type="submit">
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {message && <p>{message}</p>}

        <p>
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </p>
      </form>
    </main>
  );
}
