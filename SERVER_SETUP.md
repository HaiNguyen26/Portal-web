# Portal Web RMG – Triển khai & Nginx

> Tài liệu này chỉ mô tả **Portal Web** (repo này). Các web app khác có URL và cấu hình Nginx riêng, không gộp trong tài liệu này.

---

## Thông tin cần nhớ

| Mục | Giá trị |
|---|---|
| **Repo** | `https://github.com/HaiNguyen26/Portal-web.git` |
| **URL công khai** (ví dụ) | `http://<IP>/portal-web-rmg/` |
| **Base path Vite** | `/portal-web-rmg/` (trong `vite.config.ts`) |
| **Thư mục build trên server** | `/var/www/web_portal/portal-web-rmg/` |
| **Thư mục source (ví dụ)** | `/root/Portal-web` |

---

## Cấu trúc thư mục (chỉ Portal)

```
/root/Portal-web/                    ← git clone, npm run build
/var/www/web_portal/
└── portal-web-rmg/                ← file tĩnh sau build (index.html, assets/, sw.js, …)
```

---

## Block Nginx cho Portal (chèn vào `server { ... }` của bạn)

Dùng khi máy chủ đã có site chung; chỉ cần thêm (hoặc giữ) đoạn dưới, **không** phải đặt chung build với app khác trong cùng thư mục nếu app kia có server block riêng.

```nginx
# ── Portal Web RMG (SPA) ─────────────────────────────────────
location /portal-web-rmg/ {
    alias /var/www/web_portal/portal-web-rmg/;
    try_files $uri $uri/ /portal-web-rmg/index.html;
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
}
```

- `alias` trỏ đúng thư mục chứa `index.html` sau `npm run build`.
- `try_files` ... `/portal-web-rmg/index.html` phục vụ routing SPA (React Router nếu có).

**Lưu ý:** Nếu `try_files` fallback resolve qua `root` của `server` và gây 404, tạo bản sao vật lý hoặc symlink sao cho đường dẫn `[root]/portal-web-rmg/index.html` trùng với bản build (trên một số server đã dùng symlink từ webroot tới thư mục build).

Service Worker (nếu bật) nằm tại: `/portal-web-rmg/sw.js` — file phải có trong thư mục `public/` và được copy vào output build.

---

## Lệnh trên server

### Lần đầu

```bash
git clone https://github.com/HaiNguyen26/Portal-web.git /root/Portal-web
cd /root/Portal-web
npm install
sudo mkdir -p /var/www/web_portal/portal-web-rmg
```

### Build / cập nhật

```bash
cd /root/Portal-web
git pull
npm install
VITE_OUT_DIR=/var/www/web_portal/portal-web-rmg npm run build
```

### Kiểm tra Nginx

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -I http://27.71.16.15/portal-web-rmg/
```
(Thay IP/host cho đúng môi trường.)

---

## Log & debug (tuỳ file bạn cấu hình)

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo tail -50 /var/log/nginx/error.log
```

Nếu bạn ghi `access_log` / `error_log` riêng cho site Portal, mở đúng file đó trong `server { }`.

---

## Ghi file Nginx một lần (chỉ khi dùng **một** server block riêng chỉ cho Portal)

Chỉ dùng khi bạn muốn file `sites-enabled/portal-web` **chỉ** phục vụ Portal tại port 80 — các app khác nằm file/site khác.

```bash
sudo tee /etc/nginx/sites-enabled/portal-web-rmg.conf > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name 27.71.16.15;

    access_log /var/log/nginx/portal-web-rmg-access.log;
    error_log  /var/log/nginx/portal-web-rmg-error.log;

    root /var/www/web_portal;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/xml+rss application/json;

    location /portal-web-rmg/ {
        alias /var/www/web_portal/portal-web-rmg/;
        try_files $uri $uri/ /portal-web-rmg/index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    }
}
NGINX_EOF
sudo nginx -t && sudo systemctl reload nginx
```

Trên server thật thường **gộp** block `location /portal-web-rmg/` vào site hiện có thay vì tạo server mới trùng `listen 80`.
