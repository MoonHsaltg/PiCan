export default function RegisterPage() {
  return (
    <main className="form-page">
      <p className="eyebrow">PiCan</p>
      <h1>Tạo tài khoản</h1>
      <form>
        <label>
          Email
          <input autoComplete="email" name="email" type="email" />
        </label>
        <label>
          Mật khẩu
          <input autoComplete="new-password" name="password" type="password" />
        </label>
        <button type="submit">Đăng ký</button>
      </form>
    </main>
  );
}
