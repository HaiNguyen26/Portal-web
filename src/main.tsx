import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Đăng ký Service Worker để tự động kiểm tra version mới
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/portal-web-rmg/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)

        // Kiểm tra update ngay sau khi đăng ký
        registration.update()

        // Kiểm tra update định kỳ (mỗi 5 phút)
        setInterval(() => {
          registration.update()
        }, 300000) // 5 phút

        // Lắng nghe message từ service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
            // Hiển thị thông báo và tự động reload sau 2 giây
            if (confirm('Đã có phiên bản mới. Bạn có muốn tải lại trang không?')) {
              window.location.reload()
            } else {
              // Nếu không reload ngay, sẽ tự động reload sau 10 giây
              setTimeout(() => {
                window.location.reload()
              }, 10000)
            }
          }
        })

        // Kiểm tra khi trang được focus lại
        window.addEventListener('focus', () => {
          registration.update()
        })

        // Kiểm tra khi online
        window.addEventListener('online', () => {
          registration.update()
        })
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
