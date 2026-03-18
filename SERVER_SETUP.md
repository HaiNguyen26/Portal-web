# Portal Web RMG - Server Setup

## Thông tin triển khai
- URL public: `http://27.71.16.15/portal-web-rmg/`
- Repo: `https://github.com/HaiNguyen26/Portal-web.git`
- Base path Vite: `/portal-web-rmg/`
- Webroot mới: `/var/www/web_portal/`
- Nginx config: `/etc/nginx/sites-enabled/web_portal`

---

## MIGRATION: Chuyển từ it-request-tracking → web_portal

### Bước 1 – Tạo thư mục webroot mới
```bash
sudo mkdir -p /var/www/web_portal/portal-web-rmg
sudo mkdir -p /var/www/web_portal/meals-rmg
sudo mkdir -p /var/www/web_portal/asset_rmg
```

### Bước 2 – Copy toàn bộ file hiện tại sang webroot mới
```bash
sudo cp -r /var/www/it-request-tracking/webapp/dist/portal-web-rmg/. /var/www/web_portal/portal-web-rmg/
sudo cp -r /var/www/it-request-tracking/webapp/dist/meals-rmg/.         /var/www/web_portal/meals-rmg/
```
> Thêm lệnh copy tương tự cho các app khác nếu có.

### Bước 3 – Tạo file nginx config mới
```bash
sudo nano /etc/nginx/sites-enabled/web_portal
```

Nội dung file `/etc/nginx/sites-enabled/web_portal`:
```nginx
# ── Portal Web RMG ───────────────────────────────────────────
location /portal-web-rmg/ {
    alias /var/www/web_portal/portal-web-rmg/;
    try_files $uri $uri/ /portal-web-rmg/index.html;
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
}

# ── Đăng ký suất ăn ──────────────────────────────────────────
location /meals-rmg/ {
    alias /var/www/web_portal/meals-rmg/;
    try_files $uri $uri/ /meals-rmg/index.html;
}

# ── Quản lý tài sản ──────────────────────────────────────────
location /asset_rmg/ {
    alias /var/www/web_portal/asset_rmg/;
    try_files $uri $uri/ /asset_rmg/index.html;
}
```
> Thêm block `location` cho các app khác tương tự.

### Bước 4 – Gỡ bỏ các block liên quan ra khỏi config cũ
Mở file cũ và xoá (hoặc comment) các `location` đã chuyển sang:
```bash
sudo nano /etc/nginx/sites-enabled/it-request-tracking
```

### Bước 5 – Kiểm tra và reload nginx
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Bước 6 – Kiểm tra nhanh
```bash
curl -I http://27.71.16.15/portal-web-rmg/
curl -I http://27.71.16.15/meals-rmg/
```

---

## Cài đặt lần đầu trên server
```bash
git clone https://github.com/HaiNguyen26/Portal-web.git /root/Portal-web
cd /root/Portal-web
npm install
```

## Build và deploy (webroot mới)
```bash
VITE_OUT_DIR=/var/www/web_portal/portal-web-rmg npm run build
```

## Cập nhật code (sau khi migration xong)
```bash
cd /root/Portal-web
git pull
npm install
VITE_OUT_DIR=/var/www/web_portal/portal-web-rmg npm run build
```

## Build kiểu cũ + copy (dự phòng)
```bash
npm run build
rm -rf /var/www/web_portal/portal-web-rmg/*
cp -r dist/* /var/www/web_portal/portal-web-rmg/
```

