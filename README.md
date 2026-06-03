# Cẩm nang nuôi dạy con · Parenting Handbook

Trang web đọc đa ngôn ngữ (Anh / Việt / 日本語 / 한국어 / 中文) từ hai bản PDF trong thư mục này.

## Cấu trúc dự án

| File | Vai trò |
|------|---------|
| `index.html` | Nội dung sách (đa ngôn ngữ), markup |
| `assets/css/handbook.css` | Giao diện (theme sáng/tối, layout) |
| `assets/js/i18n.js` | Chuỗi UI (tìm kiếm, tiếp tục đọc, toast, theme) |
| `assets/js/handbook.js` | Hành vi: đổi ngôn ngữ, tìm, lưu vị trí đọc, icon |
| `assets/sprites.svg` | Icon SVG dùng chung |
| `scripts/inject_i18n.py` | Gắn khối JA/KO/ZH từ `scripts/cjk-blocks*.html` |
| `Parenting_Handbook_*.pdf` | Bản gốc tham chiếu (không render trong trang web) |

Theme khởi tạo sớm vẫn nằm inline trong `<head>` của `index.html` (tránh nháy sáng/tối).

## Đọc trên máy tính

Mở file `index.html` bằng trình duyệt (kéo thả vào Chrome/Safari).

Hoặc chạy server cục bộ:

```bash
cd /Users/luanph/Parenting_handbook
python3 -m http.server 8080
```

Rồi mở: http://localhost:8080

## Chia sẻ link cho mọi người

**Trang hiện tại:** https://phamhuuluan.github.io/Parenting-handbook/

Link `github.io` + tên tài khoản GitHub **không thể ẩn** chỉ bằng đổi tên repo. Muốn URL không lộ `phamhuuluan` / `github`, dùng một trong hai cách sau.

### Cách 1 — Tên miền riêng (nên dùng, vẫn host GitHub Pages)

Ví dụ: `https://camnang.tenban.vn` thay cho `github.io`.

1. Mua hoặc dùng subdomain bạn đã có (vd. `camnang.pqq.org`).
2. Trong repo → **Settings → Pages → Custom domain** → nhập domain → bật **Enforce HTTPS**.
3. Tại nhà cung cấp DNS:
   - **Subdomain** (`camnang...`): bản ghi **CNAME** → `phamhuuluan.github.io`
   - **Apex** (`tenban.vn`): bản ghi **A** `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (theo hướng dẫn GitHub Pages).
4. Thêm file `CNAME` ở thư mục gốc repo (một dòng, đúng domain):

   ```
   camnang.tenban.vn
   ```

5. Commit + push; đợi DNS (vài phút đến 48 giờ).

### Cách 2 — Netlify / Cloudflare Pages (không cần tên miền riêng)

- **Netlify:** https://app.netlify.com → Import từ GitHub repo `Parenting-handbook` → đặt tên site (vd. `pqq-cam-nang`) → link dạng `https://pqq-cam-nang.netlify.app`
- **Cloudflare Pages:** tương tự → `https://<ten-site>.pages.dev`

Repo GitHub có thể giữ **private** (Netlify/Cloudflare kết nối quyền đọc repo).

### GitHub Pages (mặc định)

1. Repo **public** (gói Free) hoặc **Pro** nếu repo private.
2. **Settings → Pages** → nhánh `main`, folder `/ (root)`.

## Tính năng

- Mặc định **Tiếng Việt**; nút **VI** / **EN** / **日本語** / **한국어** / **中文** ở đầu trang (ghi nhớ lựa chọn trên trình duyệt).
- Mục lục 10 điều, nhảy tới từng phần.
- Giao diện tối ưu điện thoại và in ấn.
- Chế độ sáng/tối, tìm trong trang, tiếp tục đọc, sao chép nội dung từng điều.

## Đa ngôn ngữ (EN / JA / KO / ZH)

- **Tiếng Anh** (`en-only`) là bản gốc theo `Parenting_Handbook_English.pdf`.
- **日本語 / 한국어 / 中文** dịch sát từ tiếng Anh (không rút gọn ý). Thuật ngữ thống nhất: xem `scripts/I18N_GLOSSARY.md`.

## File gốc

- `Parenting_Handbook_English.pdf`
- `Parenting_Handbook_Vietnamese.pdf`
