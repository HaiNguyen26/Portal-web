# WEB APP DEPLOY (Nginx + Vite/React) – Template

> Tài liệu này dùng để triển khai **một web app bất kỳ** (không phụ thuộc portal-web).
> Mỗi web app cần:
> 1) build output đúng thư mục trên server
> 2) cấu hình Nginx `location` trỏ tới đúng thư mục đó

---

## A. Có cần “chỉ cấu hình webroot trong portal-web” để web app chạy không?

Không. `webroot` và `location` của Nginx chỉ ảnh hưởng đến **những đường dẫn (URL path) mà bạn cấu hình trong Nginx**.

Muốn app A chạy ở URL `/app-a/` thì trong Nginx phải có `location /app-a/ { ... }` (hoặc một `server` riêng) trỏ tới thư mục chứa `index.html` của app A.

Portal-web chỉ là một app; muốn thêm app mới thì chỉ cần:
- build app mới ra thư mục trên server
- thêm/extend đoạn Nginx `location` cho URL path mới

---

## B. Giả định

- OS: Ubuntu + Nginx
- Các web app là SPA (React/Vite) thường cần fallback về `index.html`
- URL path (ví dụ): `/myapp/`
- Thư mục build trên server (ví dụ): `/var/www/myapp/frontend/dist/`

---

## C. Checklist triển khai (1 phương án duy nhất)

### Bước 1: Tạo thư mục chứa build
Ví dụ:

```bash
sudo mkdir -p /var/www/myapp
```

### Bước 2: Clone repo app lên server (nếu cần) + install + build
Ví dụ app có Vite:

```bash
git clone <repo-url> /root/myapp
cd /root/myapp
npm install
npm run build
```

### Bước 3: Copy/symlink build output vào webroot

**Trường hợp bạn muốn copy:**

```bash
sudo cp -r dist/. /var/www/myapp/
```

**Trường hợp bạn muốn symlink (khuyến nghị khi build nhiều ứng dụng):**

```bash
sudo ln -sfn /root/myapp/dist /var/www/myapp
```

> Bạn có thể dùng symlink kiểu tương tự như trong hệ thống `web_portal` nếu muốn fallback SPA.

### Bước 4: Cấu hình Nginx

Thêm vào file config `server { ... }` hiện có (đang phục vụ Portal Web)

**Chèn đoạn `location /myapp/ { ... }` vào đúng `server { ... }` đang phục vụ Portal Web**.

Trong hệ thống của bạn, config thường nằm ở:
- `/etc/nginx/sites-enabled/web_portal`
- hoặc bất kỳ file nào đang chứa `server { listen 80; server_name ...; }` dùng cho Portal

Ví dụ (SPA):

```nginx
location /myapp/ {
    alias /var/www/myapp/;
    try_files $uri $uri/ /myapp/index.html;
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
}
```

> Lưu ý:
> - Với SPA, `try_files ... /myapp/index.html` giúp client-side routing hoạt động.
> - Nếu bạn dùng `alias`, đường dẫn fallback phải đúng logic của server (một số setup cần symlink để không bị 404).

### Bước 5: Reload nginx

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Bước 6: Kiểm tra

```bash
curl -I http://27.71.16.15/myapp/
```

Nếu app có API riêng thì bạn sẽ **chèn thêm `location /myapp/api/` cùng trong `server {}`** (cùng file cấu hình với Portal):

```nginx
location /myapp/api/ {
    proxy_pass http://127.0.0.1:PORT/;
}
```

## E. Chẩn đoán nhanh khi 404 (SPA)

Nếu `curl /myapp/` ra `404 Not Found`:
- Kiểm tra tồn tại `index.html` thực tế ở thư mục alias trỏ tới
- Kiểm tra fallback path trong `try_files` có trỏ đúng đường dẫn nơi `index.html` nằm không
- Nếu bị lệch, tạo symlink hoặc điều chỉnh fallback cho đúng:
  - `try_files ... /myapp/index.html` thường yêu cầu đường dẫn fallback khớp với cấu trúc `root/alias`

