# 开发环境

## 环境要求

### 基础环境

- **Node.js**: 18.0+
- **npm**: 8.0+ 或 **yarn**: 1.22+
- **Git**: 2.0+

### 推荐开发工具

- **VS Code**: 推荐的代码编辑器
- **Vue DevTools**: Vue 开发调试工具
- **Chrome DevTools**: 浏览器开发者工具

## 项目初始化

### 克隆项目

```bash
git clone https://github.com/WHU-sb/WHU-sb.git
cd whu.sb/frontend
```

### 安装依赖

```bash
npm install
```

### 环境变量配置

创建 `.env.local` 文件（如果不存在）：

```bash
# API 配置
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WORKER_API_URL=https://your-worker.your-subdomain.workers.dev/api/v1

# API 降级配置
VITE_API_FALLBACK_ENABLED=true
VITE_API_FALLBACK_STRATEGY=priority

# 开发模式配置
VITE_DEV_MODE=true
```

## 开发服务器

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 http://localhost:3000 启动。

### 开发服务器特性

- **热重载**: 文件修改后自动刷新
- **源码映射**: 支持浏览器调试
- **代理配置**: API 请求代理到后端
- **PWA 禁用**: 开发模式下禁用 PWA 避免热重载问题

### 构建日历数据

项目包含日历数据构建脚本：

```bash
npm run build:calendar
```

## 构建和部署

### 开发构建

```bash
npm run build:dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 代码质量工具

### ESLint 代码检查

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:eslint
```

### Prettier 代码格式化

```bash
# 格式化代码
npm run format

# 检查格式
npm run format:check
```

### TypeScript 类型检查

```bash
npm run type-check
```

## 测试

### 运行测试

```bash
# 运行所有测试
npm run test

# 运行单元测试
npm run test:unit
```

### 测试覆盖率

```bash
npm run test:unit
```

测试覆盖率报告将生成在 `coverage/` 目录。

## 国际化工具

### 检查未使用的翻译键

```bash
npm run check:i18n
```

### 清理未使用的翻译键

```bash
npm run clean:i18n
```

## 应用配置

### 主机检查配置

应用包含主机检查功能，防止在错误的域名下运行：

```typescript
hostCheck: {
  mainHost: 'www.whu.sb',
  blacklist: ['whu-course-review-pages.pages.dev'],
  whitelist: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    'whu.sb',
    '*.whu.sb',
    '*.pages.dev',
    '*.workers.dev',
  ],
}
```

### API 降级配置

支持多后端 API 降级策略：

```typescript
fallbackConfig: {
  enabled: true,
  endpoints: [
    {
      name: '主后端',
      baseURL: 'http://localhost:8080/api/v1',
      type: 'standard',
      weight: 10,
      timeout: 5000,
    },
    {
      name: 'Cloudflare Worker',
      baseURL: 'https://your-worker.your-subdomain.workers.dev/api/v1',
      type: 'cloudflare',
      weight: 5,
      timeout: 10000,
    },
  ],
  strategy: 'priority',
}
```

## 调试工具

### Vue DevTools

安装 Vue DevTools 浏览器扩展：

1. 打开浏览器扩展商店
2. 搜索 "Vue DevTools"
3. 安装扩展
4. 在开发者工具中查看 Vue 面板

### 浏览器开发者工具

- **Console**: 查看日志和错误
- **Network**: 监控网络请求
- **Performance**: 性能分析
- **Application**: 存储和缓存管理

### 热重载调试

如果热重载不工作：

1. 检查文件是否在 `src/` 目录下
2. 确认文件扩展名正确
3. 检查是否有语法错误
4. 重启开发服务器

## 常见问题

### 端口冲突

如果 3000 端口被占用：

```bash
# 使用其他端口
npm run dev -- --port 3001
```

### 依赖安装失败

```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### TypeScript 错误

```bash
# 检查类型错误
npm run type-check

# 重新生成类型文件
npm run build:types
```

### 构建失败

```bash
# 检查构建日志
npm run build 2>&1 | tee build.log

# 清理构建缓存
rm -rf dist
npm run build
```

## 开发工作流

### 日常开发流程

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **编写代码**
   - 在 `src/` 目录下修改文件
   - 使用 TypeScript 编写类型安全的代码
   - 遵循 ESLint 和 Prettier 规范

3. **运行测试**
   ```bash
   npm run test:unit
   ```

4. **代码检查**
   ```bash
   npm run lint
   npm run format:check
   ```

5. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   ```

### 调试流程

1. **使用 Vue DevTools**
   - 检查组件状态
   - 监控状态变化
   - 调试路由

2. **使用浏览器开发者工具**
   - 查看网络请求
   - 分析性能问题
   - 调试 JavaScript 错误

3. **使用控制台日志**
   ```typescript
   console.log('调试信息')
   console.error('错误信息')
   ```

## 性能优化

### 开发模式优化

- **源码映射**: 启用源码映射便于调试
- **热重载**: 快速反馈开发进度
- **懒加载**: 路由级别的代码分割

### 构建优化

- **代码分割**: 按模块分割代码
- **Tree Shaking**: 移除未使用的代码
- **压缩**: 压缩 JavaScript 和 CSS

---

**提示**: 开发环境配置注重开发效率和调试便利性，生产环境会进行额外的优化。
