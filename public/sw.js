// Service Worker để tự động kiểm tra và load version mới
const CACHE_NAME = 'portal-rmg-v1'
const VERSION_CHECK_INTERVAL = 30000 // Kiểm tra mỗi 30 giây
let currentVersion = null

// Lắng nghe khi service worker được cài đặt
self.addEventListener('install', (event) => {
  self.skipWaiting() // Kích hoạt ngay lập tức
})

// Lắng nghe khi service worker được kích hoạt
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  return self.clients.claim()
})

// Lấy version từ HTML hoặc main.js
async function getCurrentVersion() {
  try {
    // Kiểm tra main.js với timestamp để tránh cache
    const response = await fetch('/portal-web-rmg/src/main.tsx?t=' + Date.now(), {
      cache: 'no-store',
    })
    if (response.ok) {
      const text = await response.text()
      // Lấy hash từ response headers hoặc URL
      return response.headers.get('etag') || response.url
    }
  } catch (error) {
    // Fallback: kiểm tra index.html
    try {
      const response = await fetch('/portal-web-rmg/index.html?t=' + Date.now(), {
        cache: 'no-store',
      })
      if (response.ok) {
        return response.headers.get('etag') || response.url + '?t=' + Date.now()
      }
    } catch (e) {
      console.error('Error getting version:', e)
    }
  }
  return null
}

// Kiểm tra version mới định kỳ
async function checkForUpdate() {
  try {
    const newVersion = await getCurrentVersion()
    if (newVersion && currentVersion && newVersion !== currentVersion) {
      // Có version mới, thông báo cho clients
      const clients = await self.clients.matchAll()
      clients.forEach((client) => {
        client.postMessage({ type: 'NEW_VERSION_AVAILABLE' })
      })
    }
    currentVersion = newVersion || currentVersion
  } catch (error) {
    console.error('Error checking for update:', error)
  }
}

// Khởi tạo version ban đầu
getCurrentVersion().then((version) => {
  currentVersion = version
})

// Kiểm tra định kỳ
setInterval(checkForUpdate, VERSION_CHECK_INTERVAL)

// Lắng nghe message từ client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    checkForUpdate()
  }
})
