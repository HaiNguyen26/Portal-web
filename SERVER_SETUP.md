# RMG Web Portal – Server Setup & Deployment Guide

> Server: `27.71.16.15` · Nginx · Ubuntu  
> Repo Portal: https://github.com/HaiNguyen26/Portal-web.git  
> Webroot gốc: `/var/www/web_portal/`  
> Nginx config: `/etc/nginx/sites-enabled/web_portal`

---

## 1. Danh sách ứng dụng hiện tại

| App | URL Path | Webroot (Frontend) | API Backend | Port |
|---|---|---|---|---|
| **Portal Web** | `/portal-web-rmg/` | `/var/www/web_portal/portal-web-rmg/` | — | — |
| **Quản Lý Tài Sản** | `/asset_rmg/` | `/var/www/asset-rmg/frontend/dist/` | `localhost` | `4001` |
| **Đăng Ký Suất Ăn** | `/meals-rmg/` | `/var/www/meals-rmg/frontend/dist/` | `localhost` | `3002` |
| **HRM** | `/hr/` | `/var/www/hr-management/frontend/build/` | `localhost` | `3000` |
| **IT Tracking API** | `/api/` | — | `localhost` | `4000` |

---

## 2. Cấu trúc thư mục server

```
/var/www/
├── web_portal/                        ← webroot chính của nginx
│   ├── portal-web-rmg/                ← build output của repo này
│   ├── meals-rmg  → symlink           → /var/www/meals-rmg/frontend/dist/
│   ├── asset_rmg  → symlink           → /var/www/asset-rmg/frontend/dist/
│   └── hr         → symlink           → /var/www/hr-management/frontend/build/
│
├── meals-rmg/
│   ├── frontend/dist/                 ← React build
│   └── backend/                       ← Node.js API (port 3002)
│
├── asset-rmg/
│   ├── frontend/dist/                 ← React build
│   └── backend/                       ← Node.js API (port 4001)
│
├── hr-management/
│   ├── frontend/build/                ← React build
│   └── backend/                       ← Node.js API (port 3000)
│
└── it-request-tracking/               ← IT Tracking app cũ (API port 4000)
    └── webapp/dist/portal-web-rmg/    ← (cũ, không còn dùng)

/root/Portal-web/                      ← source code repo Portal
```

---

## 3. Nginx config đầy đủ

File: `/etc/nginx/sites-enabled/web_portal`

Để ghi lại file config (thay thế hoàn toàn), chạy lệnh sau trên server:

```bash
sudo tee /etc/nginx/sites-enabled/web_portal > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name 27.71.16.15;

    access_log /var/log/nginx/web-portal-access.log;
    error_log  /var/log/nginx/web-portal-error.log;

    root  /var/www/web_portal;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss application/json;

    # ── Không cache HTML (tự load version mới) ───────────────
    location ~* \.(html)$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # ── Portal Web RMG ────────────────────────────────────────
    location /portal-web-rmg/ {
        alias /var/www/web_portal/portal-web-rmg/;
        try_files $uri $uri/ /portal-web-rmg/index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    }

    # ── Asset RMG – Backend API ───────────────────────────────
    location /asset_rmg/api {
        rewrite ^/asset_rmg/api(.*)$ /api$1 break;
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host       $host;
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        add_header 'Access-Control-Allow-Origin'  '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }

    # ── Asset RMG – Frontend ──────────────────────────────────
    location /asset_rmg {
        alias /var/www/asset-rmg/frontend/dist;
        index index.html;
        try_files $uri $uri/ /asset_rmg/index.html;
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # ── Meals RMG – Frontend ──────────────────────────────────
    location /meals-rmg/ {
        alias /var/www/meals-rmg/frontend/dist/;
        try_files $uri $uri/ /meals-rmg/index.html;
    }

    # ── Meals RMG – API ───────────────────────────────────────
    location /meals-rmg/api/ {
        proxy_pass http://127.0.0.1:3002/;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # ── HR Management – Frontend ──────────────────────────────
    location /hr {
        alias /var/www/hr-management/frontend/build;
        try_files $uri $uri/ /hr/index.html;
        add_header X-Frame-Options        "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff"    always;
        add_header X-XSS-Protection       "1; mode=block" always;
    }

    # ── HR Management – API ───────────────────────────────────
    location /hr/api {
        client_max_body_size 100M;
        proxy_pass http://localhost:3000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host       $host;
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ── IT Request Tracking – API ─────────────────────────────
    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host       $host;
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }

    location /api/uploads {
        proxy_pass http://127.0.0.1:4000/api/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host       $host;
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ── Fallback ──────────────────────────────────────────────
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }
}
NGINX_EOF
```

Sau đó test và reload:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 4. Triển khai app mới (checklist)

Khi thêm một web app mới vào portal, thực hiện theo thứ tự:

### Bước 1 – Đăng ký app trong Portal (`src/App.tsx`)
Thêm entry vào `portalGroups` với `status: 'active'` và đúng `href`.

### Bước 2 – Clone source code lên server
```bash
git clone <repo-url> /var/www/<ten-app>/
cd /var/www/<ten-app>
```

### Bước 3 – Build frontend
```bash
# React / Vite
cd /var/www/<ten-app>/frontend
npm install
npm run build
# Output thường ở: dist/ hoặc build/
```

### Bước 4 – Tạo symlink vào web_portal (nếu cần fallback SPA)
```bash
sudo ln -sfn /var/www/<ten-app>/frontend/dist /var/www/web_portal/<url-path>
```
> Bắt buộc nếu dùng `try_files` với SPA routing. Không cần nếu chỉ serve file tĩnh đơn giản.

### Bước 5 – Thêm block nginx vào config
Mở file config và thêm vào đúng vị trí (API trước, Frontend sau):

```nginx
# ── <Tên App> – Backend API ──────────────────────────────────
location /<url-path>/api/ {
    proxy_pass http://127.0.0.1:<PORT>/;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
}

# ── <Tên App> – Frontend ─────────────────────────────────────
location /<url-path>/ {
    alias /var/www/<ten-app>/frontend/dist/;
    try_files $uri $uri/ /<url-path>/index.html;
}
```

### Bước 6 – Reload nginx
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Bước 7 – Kiểm tra
```bash
curl -I http://27.71.16.15/<url-path>/
```

---

## 5. Cập nhật Portal (thay đổi code)

```bash
cd /root/Portal-web
git pull
npm install
VITE_OUT_DIR=/var/www/web_portal/portal-web-rmg npm run build
```

---

## 6. Cài đặt Portal lần đầu trên server mới

```bash
git clone https://github.com/HaiNguyen26/Portal-web.git /root/Portal-web
cd /root/Portal-web
npm install
mkdir -p /var/www/web_portal/portal-web-rmg
VITE_OUT_DIR=/var/www/web_portal/portal-web-rmg npm run build
```

---

## 7. Xem logs & debug

```bash
# Nginx error log
sudo tail -50 /var/log/nginx/web-portal-error.log

# Nginx access log
sudo tail -50 /var/log/nginx/web-portal-access.log

# Test config nginx
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Xem trạng thái nginx
sudo systemctl status nginx
```

---

## 8. Quản lý symlink

```bash
# Xem toàn bộ symlink trong web_portal
ls -la /var/www/web_portal/

# Tạo/cập nhật symlink
sudo ln -sfn /var/www/<ten-app>/frontend/dist /var/www/web_portal/<url-path>

# Xóa symlink (không xóa file gốc)
sudo rm /var/www/web_portal/<url-path>
```
