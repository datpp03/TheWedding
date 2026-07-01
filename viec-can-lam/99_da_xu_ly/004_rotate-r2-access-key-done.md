# [x] Rotate R2 Access Key Đã Bị Lộ Trước Khi Dùng Production

- Mức độ: Đã xử lý.
- Nguồn: `viec-can-lam/README.md` mục cấu hình cần người dùng.
- Owner: Người dùng.
- Trạng thái: `[x]` đã làm.

## Mục Tiêu

Thu hồi access key R2 từng bị lộ trong chat hoặc ảnh chụp, tạo key mới và cấu hình lại host để không dùng secret có rủi ro.

## Chuẩn Bị

- Quyền vào Cloudflare R2 API Tokens.
- Quyền sửa Render/VPS Environment.
- Tên bucket production, ví dụ `thewedding-media-prod`.
- Một tài khoản app có quyền upload media để smoke test sau deploy.

## Các Bước Thực Hiện

1. [x] Vào Cloudflare dashboard, mở khu vực R2 `API Tokens`.
2. [x] Xóa hoặc revoke token cũ nếu secret từng được gửi qua chat/chụp màn hình.
3. [x] Tạo lại `Account API Token` mới với quyền `Object Read & Write`.
4. [x] Scope token chỉ vào bucket production cần dùng.
5. [x] Copy `Access Key ID` và `Secret Access Key` mới.
6. [x] Dán trực tiếp vào Render/VPS env `S3_ACCESS_KEY` và `S3_SECRET_KEY`.
7. [x] Nếu cần test local, điền key mới vào `.env` local trên máy cá nhân và không commit.
8. [x] Redeploy/restart backend API.
9. [x] Upload thử một ảnh production/staging để xác nhận backend ghi được object mới lên R2.
10. [x] Kiểm tra git diff, chat và tài liệu không chứa secret mới.

## Nơi Cấu Hình / Kiểm Tra

- Cloudflare R2 API Tokens.
- Render backend API Environment hoặc `.env.production` trên VPS.
- File `.env` local nếu test local.
- Dashboard media/upload của app sau khi backend deploy xong.
- Cloudflare R2 bucket object list để xác nhận object mới được tạo.

## Xác Nhận Hoàn Tất

- [x] Token cũ đã được thay bằng key mới theo xác nhận của người dùng.
- [x] Backend đã redeploy theo xác nhận của người dùng.
- [x] Backend deploy với key mới upload được ảnh lên R2.
- [x] Không có secret mới trong git diff, chat hoặc tài liệu.

## Docs Liên Quan

- `docs/guides/CLOUDFLARE_R2_SETUP.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/STORAGE_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Việc rotate key R2 đã xong. Prompt sau chỉ cần tiếp tục kiểm tra R2 như một phần release QA thông thường.
