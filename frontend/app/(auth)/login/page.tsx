"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setMessage("");
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Email hoặc mật khẩu không đúng.");
      setIsLoading(false);
      return;
    }

    router.push("/gallery");
    router.refresh();
  }

  return (
    <main className="form-page">
      <p className="eyebrow">PiCan</p>
      <h1>Đăng nhập</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input autoComplete="email" name="email" required type="email" />
        </label>

        <label>
          Mật khẩu
          <input
            autoComplete="current-password"
            name="password"
            required
            type="password"
          />
        </label>

        <button disabled={isLoading} type="submit">
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        {message && <p>{message}</p>}

        <p>
          Chưa có tài khoản? <Link href="/register">Đăng ký</Link>
        </p>
      </form>
    </main>
  );
}
