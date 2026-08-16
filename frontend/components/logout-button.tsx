"use client";

import { LogOut } from "lucide-react";
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

  return <button className="icon-button" onClick={handleLogout} title="Đăng xuất" type="button" aria-label="Đăng xuất"><LogOut size={19} /></button>;
}
