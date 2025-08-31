# PWA 支持

## 概述

WHU.sb 前端实现了完整的 Progressive Web App (PWA) 功能，包括离线缓存、推送通知、应用安装等功能。

## PWA 配置

### Vite PWA 插件配置

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      srcDir: 'public',
      filename: 'sw.js',
      strategies: 'injectManifest',
      manifest: {
        name: 'WHU 课程评价平台',
        short_name: 'WHU课程',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b983',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## Service Worker

### 基础配置

```javascript
// public/sw.js
const CACHE_NAME = 'whu-courses-v0.0.0-1756389819036'
const API_CACHE_NAME = 'whu-api-cache'
const STATIC_CACHE_NAME = 'whu-static-cache'

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/error-test.html',
  '/css/error-pages.css',
  '/css/primeicons.min.css',
  '/fonts/primeicons.woff2',
  '/fonts/primeicons.woff',
  '/fonts/primeicons.ttf',
  '/img/status-codes/404.png',
  '/img/status-codes/403.png',
  '/img/status-codes/418.png',
  '/img/status-codes/500.png',
  '/img/status-codes/503.png'
]

// 需要缓存的API路径模式
const API_PATTERNS = [
  /^https:\/\/api\./,
  /^https:\/\/.*\.whu\.sb\/api\//,
  /^https:\/\/.*\.workers\.dev\/api\//,
  /^http:\/\/localhost:\d+\/api\//,
  /^https?:\/\/.*\/api\/v1\//
]
```

### 安装事件

```javascript
// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        // 跳过等待，立即激活新的 Service Worker
        return self.skipWaiting()
      })
  )
})
```

### 激活事件

```javascript
// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 删除旧版本的缓存
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        // 立即控制所有客户端
        return self.clients.claim()
      })
  )
})
```

### 请求拦截

```javascript
// 请求拦截 - 实现缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 处理特殊状态码路由
  if (isSpecialStatusRoute(url.pathname)) {
    event.respondWith(handleSpecialStatusRoute(request, url))
    return
  }

  // 处理 API 请求
  if (isApiRequest(url)) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // 处理静态资源请求
  if (isStaticRequest(url)) {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // 处理导航请求
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }
})
```

### 缓存策略

#### 静态资源缓存

```javascript
async function handleStaticRequest(request) {
  try {
    // 优先从网络获取
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 缓存成功的响应
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.log('Network failed for static asset:', request.url)
  }

  // 网络失败时从缓存获取
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  // 缓存也没有时返回错误页面
  return caches.match('/error-test.html')
}
```

#### API 缓存

```javascript
async function handleApiRequest(request) {
  try {
    // 优先从网络获取
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 缓存成功的 API 响应
      const cache = await caches.open(API_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.log('Network failed for API:', request.url)
  }

  // 网络失败时从缓存获取
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  // 返回离线响应
  return new Response(
    JSON.stringify({ error: 'Offline', message: '网络不可用' }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
```

#### 导航请求处理

```javascript
async function handleNavigationRequest(request) {
  try {
    // 优先从网络获取
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      return networkResponse
    }
  } catch (error) {
    console.log('Network failed for navigation:', request.url)
  }

  // 网络失败时返回离线页面
  return caches.match('/index.html')
}
```

### 特殊状态码处理

```javascript
// 路由状态码映射
const ROUTE_STATUS_MAP = {
  '/teapot': 418,
  '/error/403': 403,
  '/error/404': 404,
  '/error/418': 418,
  '/error/500': 500,
  '/error/503': 503,
  '/forbidden': 403,
  '/not-found': 404,
  '/server-error': 500,
  '/service-unavailable': 503,
}

// 检查是否为特殊状态码路由
function isSpecialStatusRoute(pathname) {
  return ROUTE_STATUS_MAP.hasOwnProperty(pathname)
}

// 获取路由对应的状态码
function getRouteStatus(pathname) {
  return ROUTE_STATUS_MAP[pathname] || null
}

// 处理特殊状态码路由
async function handleSpecialStatusRoute(request, url) {
  const statusCode = getRouteStatus(url.pathname)
  
  if (statusCode) {
    // 返回对应的错误页面
    const errorPage = await caches.match(`/img/status-codes/${statusCode}.png`)
    if (errorPage) {
      return errorPage
    }
  }

  // 如果没有对应的错误页面，返回默认错误页面
  return caches.match('/error-test.html')
}
```

## 应用清单

### Web App Manifest

```json
{
  "name": "WHU 课程评价平台",
  "short_name": "WHU课程",
  "description": "武汉大学课程评价系统",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#42b983",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "zh-CN",
  "icons": [
    {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education", "productivity"],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

## PWA 功能实现

### 安装提示

```vue
<template>
  <div v-if="showInstallPrompt" class="install-prompt">
    <div class="install-content">
      <h3>安装应用</h3>
      <p>将 WHU.sb 添加到主屏幕，获得更好的使用体验</p>
      <div class="install-buttons">
        <button @click="installApp" class="install-btn">
          安装
        </button>
        <button @click="dismissPrompt" class="dismiss-btn">
          稍后
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  // 监听 beforeinstallprompt 事件
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallPrompt.value = true
  })

  // 监听 appinstalled 事件
  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    deferredPrompt = null
  })
})

const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('用户接受了安装提示')
    }
    deferredPrompt = null
    showInstallPrompt.value = false
  }
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
}
</script>
```

### 离线检测

```vue
<template>
  <div v-if="!isOnline" class="offline-indicator">
    <div class="offline-content">
      <span class="offline-icon">📶</span>
      <span>当前处于离线状态</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>
```

### 更新提示

```vue
<template>
  <div v-if="showUpdatePrompt" class="update-prompt">
    <div class="update-content">
      <h3>发现新版本</h3>
      <p>应用已更新，请刷新页面以获取最新功能</p>
      <button @click="updateApp" class="update-btn">
        立即更新
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showUpdatePrompt = ref(false)

onMounted(() => {
  // 监听 Service Worker 更新
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      showUpdatePrompt.value = true
    })
  }
})

const updateApp = () => {
  window.location.reload()
}
</script>
```

## 缓存管理

### 缓存清理

```javascript
// 清理过期缓存
async function cleanExpiredCaches() {
  const cacheNames = await caches.keys()
  const currentTime = Date.now()
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7天

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const dateHeader = response.headers.get('date')
        if (dateHeader) {
          const responseTime = new Date(dateHeader).getTime()
          if (currentTime - responseTime > maxAge) {
            await cache.delete(request)
          }
        }
      }
    }
  }
}
```

### 缓存统计

```javascript
// 获取缓存统计信息
async function getCacheStats() {
  const cacheNames = await caches.keys()
  const stats = {
    totalCaches: cacheNames.length,
    totalSize: 0,
    cacheDetails: []
  }

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()
    let cacheSize = 0

    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const blob = await response.blob()
        cacheSize += blob.size
      }
    }

    stats.totalSize += cacheSize
    stats.cacheDetails.push({
      name: cacheName,
      size: cacheSize,
      items: requests.length
    })
  }

  return stats
}
```

## 推送通知

### 通知权限

```javascript
// 请求通知权限
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('此浏览器不支持通知')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    console.log('通知权限被拒绝')
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}
```

### 发送通知

```javascript
// 发送本地通知
function sendNotification(title, options = {}) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  }
}
```

## 性能优化

### 预缓存策略

```javascript
// 预缓存重要资源
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/img/logo.png'
]

// 在 Service Worker 安装时预缓存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
  )
})
```

### 动态缓存

```javascript
// 动态缓存用户访问的资源
async function cacheUserRequest(request, response) {
  if (response.ok) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    await cache.put(request, response.clone())
  }
}
```

## 测试

### PWA 测试工具

```bash
# 使用 Lighthouse 测试 PWA
npm run lighthouse

# 使用 PWA Builder 测试
# 访问 https://www.pwabuilder.com/
```

### 离线测试

```javascript
// 模拟离线状态
function simulateOffline() {
  // 在开发者工具中禁用网络
  // 或使用 Service Worker 的 offline 模式
}

// 测试缓存功能
async function testCache() {
  const cache = await caches.open(STATIC_CACHE_NAME)
  const requests = await cache.keys()
  console.log('缓存的请求数量:', requests.length)
}
```

## 最佳实践

### 缓存策略

- **静态资源**: 使用 Cache First 策略
- **API 请求**: 使用 Network First 策略
- **HTML 页面**: 使用 Network First 策略

### 性能考虑

- 合理设置缓存过期时间
- 定期清理过期缓存
- 避免缓存过大的文件
- 使用压缩和优化

### 用户体验

- 提供清晰的离线提示
- 实现平滑的更新流程
- 优化安装体验
- 提供有用的推送通知

---

**提示**: PWA 功能提供离线访问能力，提升用户体验，确保应用在各种网络条件下都能正常工作。
