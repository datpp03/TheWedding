# Hướng Dẫn Sử Dụng App The Wedding

Tài liệu này dành cho người kiểm thử và người dùng nội bộ khi chạy app ở môi trường local. Mỗi khi hoàn thành một chức năng mới, hãy cập nhật file này để phản ánh đúng UI/API hiện tại.

## Địa Chỉ Local

- Web app: `http://localhost:3000`
- API: `http://localhost:4000/api/v1`
- Trang đăng nhập: `http://localhost:3000/login`
- Dashboard người dùng: `http://localhost:3000/dashboard`
- Dashboard album: `http://localhost:3000/dashboard/albums`
- Dashboard media: `http://localhost:3000/dashboard/media`
- Tuy bien giao dien: `http://localhost:3000/dashboard/themes`
- Cài đặt wedding site: `http://localhost:3000/dashboard/settings`
- Admin: `http://localhost:3000/admin`
- Public site: `http://localhost:3000/{siteSlug}`

## Tài Khoản Local Để Kiểm Thử

Các tài khoản dưới đây chỉ dùng cho môi trường local hiện tại.

| Loại tài khoản | Email               | Mật khẩu          | Ghi chú                                                                 |
| -------------- | ------------------- | ----------------- | ----------------------------------------------------------------------- |
| Super admin    | `admin@example.com` | `ChangeMe!123456` | Được tạo từ seed bằng `SUPER_ADMIN_EMAIL` và `SUPER_ADMIN_PASSWORD`.    |
| User thường    | `user@example.com`  | `ChangeMe!123456` | Tài khoản local đã được tạo và verify để kiểm thử dashboard người dùng. |

Nếu reset database local, hãy chạy lại seed để tạo super admin. Với user thường, có thể đăng ký lại từ màn Register hoặc dùng API register.

## Đăng Ký, Đăng Nhập Và Phiên Làm Việc

1. Vào `http://localhost:3000/login`.
2. Đăng nhập bằng tài khoản user thường hoặc admin ở bảng trên.
3. Sau khi đăng nhập, dashboard sẽ hiển thị trạng thái tài khoản.
4. Có thể đăng xuất từ khu vực auth status trong dashboard.
5. Nếu quên mật khẩu ở local, dùng màn Forgot Password. Vì SMTP chưa wired, API có thể trả dev reset token để mở link reset.

## Tạo Và Quản Lý Wedding Site

1. Đăng nhập bằng user thường.
2. Vào `http://localhost:3000/dashboard`.
3. Nhập tên site, slug, tên cô dâu/chú rể, ngày cưới và mô tả.
4. Bấm Create site.
5. Vào `http://localhost:3000/dashboard/settings` để chỉnh:
   - thông tin wedding site;
   - visibility: private, public, password protected;
   - SEO/share metadata;
   - welcome message và cover setting.
6. Public site có thể xem tại `http://localhost:3000/{slug}` nếu visibility cho phép.

## Quản Lý Album

1. Đăng nhập bằng user thường.
2. Vào `http://localhost:3000/dashboard/albums`.
3. Chọn wedding site cần quản lý.
4. Tạo album bằng ô Album title và nút New album.
5. Trên từng album có thể:
   - đổi title;
   - đổi description;
   - chuyển visibility private/public;
   - bật/tắt Allow downloads;
   - sắp xếp bằng Up/Down;
   - xóa album.
6. Cover album được chọn từ màn Media sau khi upload ảnh.

## Upload Và Quản Lý Media

1. Vào `http://localhost:3000/dashboard/media`.
2. Chọn wedding site và album.
3. Kéo thả file vào vùng upload hoặc chọn file từ input.
4. File hỗ trợ trong MVP:
   - ảnh: JPEG, PNG, WebP;
   - video: MP4, WebM, MOV.
5. Bấm Upload queue để upload.
6. Trên grid media có thể:
   - chọn nhiều item;
   - delete hàng loạt;
   - move sang album khác;
   - set cover cho album;
   - download media khi có quyền.

## Public Gallery Và Lightbox

1. Đặt tenant/site visibility là public.
2. Đặt album visibility là public.
3. Upload media vào album.
4. Mở `http://localhost:3000/{siteSlug}`.
5. Gallery hiển thị các album public và media bên trong.
6. Click ảnh/video để mở lightbox.
7. Trong lightbox:
   - bấm Close để đóng;
   - dùng phím Escape để đóng;
   - dùng Arrow Left/Arrow Right để chuyển media;
   - nút Download chỉ hiện khi album bật Allow downloads.

## Admin Hiện Có

Admin route đã có shell và guard cơ bản. Các màn quản trị sâu như user management, tenant management, media moderation, audit log explorer, system settings và feature flags sẽ được hoàn thiện ở Phase 6.

Đăng nhập bằng super admin:

- Email: `admin@example.com`
- Mật khẩu: `ChangeMe!123456`

Sau đó mở `http://localhost:3000/admin`.

## Lưu Ý Storage Local

- Upload local dùng `STORAGE_PROVIDER=local`.
- File được lưu dưới `apps/api/storage` khi API chạy từ `apps/api`.
- Storage key do backend sinh, không dùng filename người dùng làm path.
- Thư mục storage local không commit lên Git.

## Checklist Khi Hoàn Thành Chức Năng Mới

Mỗi phase/prompt sau khi thêm chức năng mới cần cập nhật file này:

- Thêm hoặc sửa mục hướng dẫn người dùng thao tác chức năng.
- Cập nhật URL nếu route thay đổi.
- Cập nhật quyền/tài khoản cần dùng để test.
- Cập nhật giới hạn hiện tại hoặc known limitation nếu có.
- Chạy format/lint/typecheck/test/build theo prompt trước khi commit.

## Tuy Bien Giao Dien Wedding Site

1. Dang nhap bang user co quyen vao wedding site.
2. Mo `http://localhost:3000/dashboard/themes`.
3. Chon wedding site trong o Wedding site neu tai khoan co nhieu site.
4. Chon preset trong Preset gallery de xem truoc nhanh. Cac preset hien co gom Neon Romance, Soft Editorial, City Pop, Midnight Film, Garden Glow.
5. Khu vuc Colors cho phep doi mau chinh, mau phu, nen, surface, mau chu va mau chu phu. Co the dung swatch mau hoac nhap ma hex.
6. Khu vuc Type and style cho phep doi font tieu de, font noi dung, do bo goc va lop phu anh.
7. Khu vuc Layout cho phep doi album layout, hero style, media density va animation.
8. Live preview ben phai cap nhat ngay khi doi preset, mau, layout hoac typography.
9. Khi thay doi chua luu, dashboard hien trang thai Unsaved changes. Bam Save de luu theme hien tai.
10. Bam Activate de kich hoat theme cho public site. Neu dang co thay doi chua luu, app se luu truoc khi activate.
11. Bam Clone de nhan ban theme hien tai thanh ban moi.
12. Bam Reset de xoa theme cua site va tao lai theme active tu preset hien tai.
13. De kiem tra public site sau khi activate, dat site visibility thanh public trong Settings roi mo `http://localhost:3000/{siteSlug}`. Public site se ap dung mau, font, bo goc, hero style va media density cua theme active.
