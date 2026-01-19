# Portal Web RMG - Server Setup

## Thông tin triển khai
- URL public: `http://27.71.16.15/portal-web-rmg/`
- Repo: `https://github.com/HaiNguyen26/Portal-web.git`
- Base path Vite: `/portal-web-rmg/`

## Cấu hình Nginx (tham khảo)
File: `/etc/nginx/sites-enabled/it-request-tracking`

```nginx
location /portal-web-rmg/ {
  alias /var/www/it-request-tracking/webapp/dist/portal-web-rmg/;
  try_files $uri $uri/ /portal-web-rmg/index.html;
}
```

Kiểm tra và reload:
```
sudo nginx -t
sudo systemctl reload nginx
```

## Cài đặt lần đầu trên server
```
git clone https://github.com/HaiNguyen26/Portal-web.git
cd Portal-web
npm install
```

## Build và tự cập nhật webroot (không cần copy)
```
VITE_OUT_DIR=/var/www/it-request-tracking/webapp/dist/portal-web-rmg npm run build
```

## Build kiểu cũ + copy (dự phòng)
```
npm run build
rm -rf /var/www/it-request-tracking/webapp/dist/portal-web-rmg/*
cp -r dist/* /var/www/it-request-tracking/webapp/dist/portal-web-rmg/
```

## Cập nhật code
```
cd /root/Portal-web
git pull
npm install
VITE_OUT_DIR=/var/www/it-request-tracking/webapp/dist/portal-web-rmg npm run build
```

## Kiểm tra nhanh
```
curl -I http://27.71.16.15/portal-web-rmg/
```

