import { createClient } from "@/lib/supabase-server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("connection_test")
    .select("message")
    .limit(1);

  return (
    <main style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <h1>Supabase connection test</h1>

      <p>Session: {user ? user.email : "Chua dang nhap"}</p>

      <pre>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
