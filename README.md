# Cẩm nang nuôi dạy con · Parenting Handbook

Trang web đọc đa ngôn ngữ (Anh / Việt / 日本語 / 한국어 / 中文) từ hai bản PDF trong thư mục này.

## Đọc trên máy tính

Mở file `index.html` bằng trình duyệt (kéo thả vào Chrome/Safari).

Hoặc chạy server cục bộ:

```bash
cd /Users/luanph/Parenting_handbook
python3 -m http.server 8080
```

Rồi mở: http://localhost:8080

## Chia sẻ link cho mọi người

Cần đưa trang lên internet. Cách đơn giản nhất — **GitHub Pages** (miễn phí):

1. Tạo repository trên GitHub (ví dụ `parenting-handbook`).
2. Đẩy thư mục này lên (ít nhất file `index.html`).
3. Vào **Settings → Pages → Source**: chọn nhánh `main`, thư mục `/ (root)`.
4. Sau vài phút, link sẽ dạng: `https://<username>.github.io/parenting-handbook/`

**Netlify Drop**: kéo thả cả thư mục vào https://app.netlify.com/drop — nhận link ngay.

**Cloudflare Pages / Vercel**: tương tự, chỉ cần deploy thư mục tĩnh (không cần build).

## Tính năng

- Mặc định **Tiếng Việt**; nút **VI** / **EN** / **日本語** / **한국어** / **中文** ở đầu trang (ghi nhớ lựa chọn trên trình duyệt).
- Mục lục 10 điều, nhảy tới từng phần.
- Giao diện tối ưu điện thoại và in ấn.

## File gốc

- `Parenting_Handbook_English.pdf`
- `Parenting_Handbook_Vietnamese.pdf`
