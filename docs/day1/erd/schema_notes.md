# ArtCanvas ERD - Ghi chú lược đồ

## 1. Phân biệt hai mức thiết kế

- Trang 1 trong file draw.io là **conceptual ERD** theo ký pháp Chen: thực thể, quan hệ, khóa, cardinality và participation. Trang này không ghi foreign key.
- Trang 2 là **logical relational schema**: gồm đúng 6 bảng, có PK và FK để có thể triển khai trên PostgreSQL/Supabase.

## 2. Cardinality và participation

| Relationship | Phía cha | Phía con | Ý nghĩa |
|---|---:|---:|---|
| profiles owns artworks | profiles 0..N | artworks 1..1 | Mỗi artwork bắt buộc thuộc đúng một profile |
| profiles owns canvases | profiles 0..N | canvases 1..1 | Mỗi canvas bắt buộc thuộc đúng một profile |
| artworks uses canvas_items | artworks 0..N | canvas_items 1..1 | Mỗi item bắt buộc tham chiếu đúng một artwork |
| canvases contains canvas_items | canvases 0..N | canvas_items 1..1 | Mỗi item bắt buộc nằm trong đúng một canvas |
| artworks extracts image_features | artworks 0..N | image_features 1..1 | Mỗi bộ đặc trưng bắt buộc thuộc đúng một artwork |
| artworks checks image_check_results | artworks 0..N | image_check_results 1..1 | Mỗi kết quả kiểm tra bắt buộc thuộc đúng một artwork |

Phía con tham gia toàn phần, nên được vẽ bằng đường đôi và FK phải là NOT NULL. Mũi tên trong ERD trỏ về phía "one".

## 3. Khóa và ràng buộc chính

- profiles.id là PK; khi dùng Supabase, đồng thời có thể là FK đến auth.users.id.
- artworks.user_id và canvases.user_id tham chiếu profiles.id.
- canvas_items.canvas_id tham chiếu canvases.id.
- canvas_items.artwork_id, image_features.artwork_id và image_check_results.artwork_id tham chiếu artworks.id.
- image_features đặt UNIQUE(artwork_id, model_version) để một phiên bản model chỉ tạo một bộ đặc trưng cho mỗi artwork.
- image_width, image_height, item_width và item_height phải lớn hơn 0.
- score, brightness_score và contrast_score nằm trong khoảng 0 đến 1.
- status nên dùng CHECK, ví dụ: pending, passed, failed, error.

## 4. Kiểm tra chuẩn hóa

- Mỗi bảng có một khóa xác định toàn bộ thuộc tính còn lại.
- Không lặp user_id trong canvas_items, image_features hoặc image_check_results. Ownership được suy ra qua FK, tránh phụ thuộc bắc cầu và dữ liệu mâu thuẫn.
- Không lưu nhiều màu trong một chuỗi/JSON. MVP chỉ lưu dominant_color_hex là một giá trị atomic.
- embedding được xem là một giá trị atomic của kiểu vector trong PostgreSQL.
- Với các functional dependency đã nêu, 6 bảng đạt BCNF: mọi FD không tầm thường đều có vế trái là một superkey.
