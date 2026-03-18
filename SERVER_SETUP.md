# Portal Web RMG - Server Setup

## Thông tin triển khai
| App | URL | Webroot | API Backend |
|---|---|---|---|
| Portal Web | `/portal-web-rmg/` | `/var/www/web_portal/portal-web-rmg/` | — |
| Asset RMG | `/asset_rmg/` | `/var/www/asset-rmg/frontend/dist/` | `localhost:4001` |
| Meals RMG | `/meals-rmg/` | `/var/www/meals-rmg/frontend/dist/` | `localhost:3002` |
| HRM | `/hr/` | `/var/www/hr-management/frontend/build/` | `localhost:3000` |
| IT Tracking API | `/api/` | — | `localhost:4000` |

---

## MIGRATION: Chuyển config từ it-request-tracking → web_portal

### Bước 1 – Copy portal-web-rmg sang webroot mới
```bash
sudo cp -r /var/www/it-request-tracking/webapp/dist/portal-web-rmg/. /var/www/web_portal/portal-web-rmg/
```
> `meals-rmg`, `asset_rmg`, `hr` giữ nguyên đường dẫn hiện tại, không cần copy.

### Bước 2 – Tạo file nginx config mới
```bash
sudo nano /etc/nginx/sites-enabled/web_portal
```

Dán toàn bộ nội dung sau vào file:

```nginx
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

    # ── Prevent caching HTML ──────────────────────────────────
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
```

### Bước 3 – Xóa (hoặc disable) config cũ
```bash
sudo rm /etc/nginx/sites-enabled/it-request-tracking
```

### Bước 4 – Test và reload nginx
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Bước 5 – Kiểm tra nhanh
```bash
curl -I http://27.71.16.15/portal-web-rmg/
curl -I http://27.71.16.15/meals-rmg/
curl -I http://27.71.16.15/asset_rmg/
curl -I http://27.71.16.15/hr/
```

---

## Cập nhật code Portal sau khi migration
```bash
cd /root/Portal-web
git pull
npm install
VITE_OUT_DIR=/var/www/web_portal/portal-web-rmg npm run build
```

## Build lần đầu / build thủ công
```bash
cd /root/Portal-web
git clone https://github.com/HaiNguyen26/Portal-web.git .
npm install
VITE_OUT_DIR=/var/www/web_portal/portal-web-rmg npm run build
```

