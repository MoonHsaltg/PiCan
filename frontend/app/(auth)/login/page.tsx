export default function LoginPage() {
  return (
    <main className="form-page">
      <p className="eyebrow">PiCan</p>
      <h1>Đăng nhập</h1>
      <form>
        <label>
          Email
          <input autoComplete="email" name="email" type="email" />
        </label>
        <label>
          Mật khẩu
          <input autoComplete="current-password" name="password" type="password" />
        </label>
        <button type="submit">Đăng nhập</button>
      </form>
    </main>
  );
}
