# AC-003 - Kiến trúc hệ thống

## Thành phần

```mermaid
flowchart LR
    User[Người dùng] --> Web[Next.js]
    Web --> Auth[Supabase Auth]
    Web --> DB[(Supabase PostgreSQL)]
    Web --> Storage[Supabase Storage]
    Web --> API[FastAPI]
    API --> Storage
    API --> DB
    API --> AI[Image checker]
```

### Next.js

- Đăng ký và đăng nhập.
- Gallery cá nhân.
- Canvas.
- Upload ảnh.
- Gọi FastAPI.

### Supabase

- Auth: email, password, JWT và session.
- Database: profiles, artworks, canvases, canvas_items, image_features và
  image_check_results.
- Storage: lưu file ảnh.

### FastAPI

- Nhận yêu cầu kiểm tra ảnh.
- Đọc ảnh từ Storage.
- Trích xuất đặc trưng và chạy kiểm tra.
- Ghi kết quả về PostgreSQL.

## Luồng upload

```mermaid
sequenceDiagram
    actor User
    participant Web as Next.js
    participant Storage as Supabase Storage
    participant DB as PostgreSQL
    participant API as FastAPI

    User->>Web: Chọn ảnh và bấm Upload
    Web->>Storage: Upload file
    Storage-->>Web: image_url
    Web->>DB: Lưu metadata artwork
    DB-->>Web: Artwork đã tạo
    Web-->>User: Hiển thị trong Gallery
    Web->>API: Yêu cầu AI Check
    API->>Storage: Đọc ảnh
    API->>DB: Lưu kết quả kiểm tra
```
