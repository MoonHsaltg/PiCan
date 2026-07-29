# PiCan

> A social space for art and humanity, where everyone can express their human side.

PiCan là MVP giúp người dùng tải tranh lên thư viện cá nhân, đặt tranh lên
canvas để sắp xếp và ghi chú, sau đó gửi ảnh sang dịch vụ AI để kiểm tra.

## Tiến độ Day 1

- AC-001: Chốt 5 tính năng MVP và phạm vi không thực hiện.
- AC-002: Hoàn thành user flow chính và các nhánh lỗi.
- AC-003: Chọn kiến trúc Next.js + Supabase + FastAPI.
- AC-004: Hoàn thành conceptual ERD và logical schema gồm 6 bảng.
- AC-005: Khởi tạo monorepo và quy ước Git.
- AC-006: Tạo skeleton Next.js TypeScript.
- AC-007: Tạo skeleton FastAPI.

Tài liệu chính nằm trong [docs](docs/README.md); bản ghi theo đầu việc nằm trong
[docs/day1](docs/day1/README.md).

## Cấu trúc

```text
pican/
├── frontend/              # Next.js App Router + TypeScript
├── ai-service/            # FastAPI
├── supabase/              # PostgreSQL migration và RLS
├── docs/                  # MVP scope, user flow, architecture và ERD
├── .vscode/               # Cấu hình VS Code
└── PiCan.code-workspace
```

## Chạy frontend

```bash
pnpm install
pnpm lint:frontend
pnpm typecheck:frontend
pnpm build:frontend
pnpm dev:frontend
```

Frontend mặc định chạy tại `http://localhost:3000`.

## Chạy AI service

```bash
cd ai-service
python -m venv .venv
```

Trên PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API health check: `http://localhost:8000/health`.

Chạy kiểm thử backend:

```bash
cd ai-service
pytest
```

## Biến môi trường

1. Sao chép `.env.example` thành `.env`.
2. Sao chép `frontend/.env.local.example` thành `frontend/.env.local`.
3. Điền URL và khóa Supabase của dự án.

Không commit `.env`, `.env.local`, mật khẩu, JWT hoặc API key lên GitHub.

## Quy ước Git

- `main`: phiên bản ổn định.
- `develop`: nhánh tích hợp.
- `feature/<ten-tinh-nang>`: phát triển tính năng.
- Commit ngắn gọn, ví dụ: `docs: add Day 1 architecture`.
