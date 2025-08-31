# 前端构建部署指南

WHU.sb 前端项目使用 Vite 作为构建工具，支持多种部署方式。本文档介绍构建配置、优化策略和部署流程。

## 🛠️ 构建配置

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    // 构建分析插件
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 生产环境关闭 sourcemap
    
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库分离
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['primevue', 'primeicons'],
          utils: ['lodash-es', 'dayjs']
        }
      }
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true // 移除 debugger
      }
    },
    
    // 资源内联阈值
    assetsInlineLimit: 4096,
    
    // 构建报告
    reportCompressedSize: true
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  
  // 预览配置
  preview: {
    port: 4173,
    host: '0.0.0.0'
  }
})
```

### 环境配置

```typescript
// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_DEV_MODE: string
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

```html
# .env.production
VITE_API_BASE_URL=https://api.whu.sb/api/v1
VITE_APP_TITLE=WHU.sb
VITE_DEV_MODE=false
VITE_ENABLE_MOCK=false
VITE_GA_TRACKING_ID=your_ga_id
VITE_SENTRY_DSN=your_sentry_dsn
```

## 📦 构建优化

### 代码分割策略

```typescript
// 路由级别的代码分割
const routes = [
  {
    path: '/courses',
    component: () => import('@/views/CourseList.vue'),
    meta: { title: '课程列表' }
  },
  {
    path: '/courses/:id',
    component: () => import('@/views/CourseDetail.vue'),
    meta: { title: '课程详情' }
  }
]

// 组件级别的代码分割
const HeavyComponent = defineAsyncComponent(() => 
  import('@/components/HeavyComponent.vue')
)
```

### 资源优化

```typescript
// 图片优化配置
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    }
  }
})
```

### 缓存策略

```typescript
// 文件名包含哈希值，便于缓存
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
```

## 🚀 构建流程

### 本地构建

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 构建分析
npm run build:analyze
```

### 构建脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "build:analyze": "vite build --mode analyze",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "type-check": "vue-tsc --noEmit"
  }
}
```

### 构建检查清单

```bash
#!/bin/bash
# build-check.sh

echo "🔍 开始构建检查..."

# 1. 类型检查
echo "📝 运行类型检查..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ 类型检查失败"
  exit 1
fi

# 2. 代码检查
echo "🔍 运行代码检查..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ 代码检查失败"
  exit 1
fi

# 3. 单元测试
echo "🧪 运行单元测试..."
npm run test:run
if [ $? -ne 0 ]; then
  echo "❌ 单元测试失败"
  exit 1
fi

# 4. 构建
echo "🏗️ 开始构建..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi

# 5. 构建产物检查
echo "📦 检查构建产物..."
if [ ! -d "dist" ]; then
  echo "❌ dist 目录不存在"
  exit 1
fi

if [ ! -f "dist/index.html" ]; then
  echo "❌ index.html 不存在"
  exit 1
fi

echo "✅ 构建检查完成"
```

## 🌐 部署方式

### 静态文件部署

#### Nginx 配置

```nginx
# nginx.conf
server {
    listen 80;
    server_name whu.sb;
    root /var/www/whu-sb/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 缓存配置
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

#### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://backend:8080/api/v1

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: whu_sb
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
```

### CDN 部署

#### Cloudflare Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: whu-sb-frontend
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

#### Vercel 部署

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.whu.sb/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 自动化部署

#### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:run
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/whu-sb
            git pull origin main
            npm ci
            npm run build
            sudo systemctl reload nginx
```

## 📊 性能监控

### 构建分析

```typescript
// 使用 rollup-plugin-visualizer 分析构建产物
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ]
})
```

### 性能指标

```typescript
// 性能监控
export function reportWebVitals(metric: any) {
  // 发送到分析服务
  if (metric.name === 'FCP') {
    console.log('First Contentful Paint:', metric.value)
  }
  if (metric.name === 'LCP') {
    console.log('Largest Contentful Paint:', metric.value)
  }
  if (metric.name === 'CLS') {
    console.log('Cumulative Layout Shift:', metric.value)
  }
}
```

### 错误监控

```typescript
// Sentry 错误监控
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

## 🔧 部署检查清单

### 预部署检查

- [ ] 代码审查通过
- [ ] 单元测试通过
- [ ] 类型检查通过
- [ ] 代码规范检查通过
- [ ] 构建成功
- [ ] 构建产物检查

### 部署后检查

- [ ] 网站可正常访问
- [ ] API 接口正常
- [ ] 静态资源加载正常
- [ ] 路由跳转正常
- [ ] 性能指标正常
- [ ] 错误监控正常

### 回滚策略

```bash
#!/bin/bash
# rollback.sh

echo "🔄 开始回滚..."

# 获取上一个版本
PREVIOUS_VERSION=$(git log --oneline -2 | tail -1 | cut -d' ' -f1)

# 切换到上一个版本
git checkout $PREVIOUS_VERSION

# 重新构建
npm run build

# 重启服务
sudo systemctl reload nginx

echo "✅ 回滚完成"
```

## 📝 环境变量管理

### 环境变量模板

```html
# .env.example
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=WHU.sb
VITE_DEV_MODE=true
VITE_ENABLE_MOCK=false
VITE_GA_TRACKING_ID=
VITE_SENTRY_DSN=
```

### 环境变量验证

```typescript
// env.validation.ts
export function validateEnv() {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_APP_TITLE'
  ]
  
  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }
}
```

---

> 💡 **提示**: 部署前请确保所有测试通过，并备份当前版本以便回滚。
