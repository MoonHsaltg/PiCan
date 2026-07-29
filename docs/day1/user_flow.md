# AC-002 - User flow

## Luồng chính

```mermaid
flowchart LR
    Register[Đăng ký] --> Login[Đăng nhập]
    Login --> Gallery[Personal Gallery]
    Gallery --> Upload[Upload tranh]
    Upload --> Save[Thêm vào Gallery]
    Save --> Check[AI Check]
    Check --> Success[Thành công]
```

## Nhánh ngoại lệ

```mermaid
flowchart TD
    Upload[Upload tranh] -->|File không hợp lệ hoặc lỗi mạng| UploadFail[Upload fail]
    Upload --> Save[Lưu ảnh]
    Save --> Check[AI Check]
    Check -->|Dịch vụ không phản hồi| Unavailable[AI service unavailable]
    Check -->|Điểm nghi ngờ cao| Suspected[Nghi ngờ giả mạo]
    Check -->|Đạt yêu cầu| Success[Success]
```

## Tiêu chí hoàn thành

- Người chưa đăng nhập không truy cập được gallery cá nhân.
- Upload thành công phải tạo bản ghi artwork.
- Lỗi upload phải có thông báo rõ ràng và cho phép thử lại.
- AI lỗi không được làm mất ảnh đã upload.
- Kết quả nghi ngờ phải được lưu lại để người dùng xem.

