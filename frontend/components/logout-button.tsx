"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button className="primary-action" onClick={handleLogout} type="button">
      Đăng xuất
    </button>
  );
}
