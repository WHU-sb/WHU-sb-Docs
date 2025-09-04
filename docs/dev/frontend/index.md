# 前端开发

欢迎来到 WHU.sb 前端开发文档！

## 技术栈

WHU.sb 前端采用现代化的技术栈，注重开发效率和用户体验。

### 核心技术

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **PrimeVue** - 企业级 UI 组件库
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 状态管理库
- **Vue Router** - Vue 官方路由管理器

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Vitest** - 单元测试框架
- **Vue Test Utils** - Vue 组件测试工具

## 项目结构

```
frontend/
├── src/
│   ├── components/     # Vue组件
│   ├── views/         # 页面视图
│   ├── stores/        # Pinia状态管理
│   ├── services/      # API服务
│   ├── composables/   # Vue组合式函数
│   ├── config/        # 配置文件
│   ├── types/         # TypeScript类型定义
│   └── utils/         # 工具函数
├── public/            # 静态资源
├── scripts/           # 构建脚本
└── wasm/              # WebAssembly模块
```

## 快速开始

### 环境要求

- **Node.js**: 18.0+
- **npm**: 8.0+ 或 **yarn**: 1.22+

### 安装依赖

```bash
cd frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问本地开发服务器查看应用。

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm run test
```

## 开发指南

### 详细文档

- [技术栈](./tech-stack.md) - 完整的技术栈介绍
- [项目结构](./structure.md) - 项目目录结构详解
- [开发环境](./development.md) - 开发环境配置和工具
- [组件开发](./components.md) - 组件开发指南和最佳实践
- [状态管理](./state-management.md) - Pinia 状态管理详解
- [路由管理](./routing.md) - Vue Router 配置和使用
- [国际化](./internationalization.md) - 多语言支持实现
- [PWA 支持](./pwa.md) - Progressive Web App 功能

### 组件开发

- [组件设计原则](./components.md#组件设计原则)
- [组件通信方式](./components.md#组件通信)
- [组件测试](./components.md#组件测试)

### 状态管理

- [Pinia 使用指南](./state-management.md)
- [状态设计原则](./state-management.md#状态管理架构)
- [持久化状态](./state-management.md#状态持久化)

### 路由配置

- [路由设计](./routing.md#路由配置)
- [路由守卫](./routing.md#路由守卫)
- [懒加载路由](./routing.md#懒加载)

### 国际化

- [i18n 配置](./internationalization.md#配置)
- [语言包管理](./internationalization.md#语言包管理)
- [动态语言切换](./internationalization.md#在组件中使用)

### PWA 功能

- [PWA 配置](./pwa.md#pwa-配置)
- [Service Worker](./pwa.md#service-worker)
- [离线缓存](./pwa.md#缓存策略)

## 测试指南

### 单元测试

```bash
# 运行所有测试
npm run test

# 运行测试并监听文件变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

### 组件测试

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Hello')
  })
})
```

## 构建和部署

### 开发环境

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

构建产物位于 `dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

### 部署到 Cloudflare Pages

项目配置了自动部署到 Cloudflare Pages，每次推送到 `main` 分支都会触发自动构建和部署。

## 性能优化

### 代码分割

- 路由级别的代码分割
- 组件级别的懒加载
- 第三方库的按需加载

### 资源优化

- 图片压缩和格式优化
- CSS 和 JavaScript 压缩
- Gzip/Brotli 压缩

### 缓存策略

- 静态资源长期缓存
- API 响应缓存
- Service Worker 缓存

## 调试工具

### Vue DevTools

安装 Vue DevTools 浏览器扩展，可以：

- 查看组件树
- 监控状态变化
- 性能分析
- 路由调试

### 浏览器开发者工具

- **Console**: 日志输出和错误调试
- **Network**: 网络请求监控
- **Performance**: 性能分析
- **Application**: 存储和缓存管理

## 代码规范

### ESLint 配置

项目使用 ESLint 进行代码质量检查：

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:fix
```

### Prettier 配置

项目使用 Prettier 进行代码格式化：

```bash
# 格式化代码
npm run format

# 检查格式
npm run format:check
```

### TypeScript 配置

项目使用 TypeScript 进行类型检查：

```bash
# 类型检查
npm run type-check
```

### 代码提交规范

项目使用 Conventional Commits 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### Git Hooks

项目配置了 Git Hooks，在提交前会自动：

- 运行 ESLint 检查
- 运行 Prettier 格式化
- 运行单元测试

## 常见问题

### 开发环境问题

**Q: 开发服务器启动失败**
A: 检查端口是否被占用，尝试使用其他端口：
```bash
npm run dev -- --port 3001
```

**Q: 依赖安装失败**
A: 清除缓存并重新安装：
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Q: TypeScript 类型错误**
A: 检查类型定义，运行类型检查：
```bash
npm run type-check
```

### 构建问题

**Q: 构建失败**
A: 检查 TypeScript 错误和 ESLint 错误：
```bash
npm run type-check
npm run lint
```

**Q: 构建产物过大**
A: 检查是否有未使用的依赖，使用代码分割优化。

### PWA 问题

**Q: Service Worker 不更新**
A: 清除浏览器缓存，或使用开发者工具强制更新。

**Q: 离线功能不工作**
A: 检查 Service Worker 是否正确注册，查看浏览器控制台错误。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 编写代码和测试
4. 提交 Pull Request

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 更多资源

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [PrimeVue 官方文档](https://primevue.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue Router 官方文档](https://router.vuejs.org/)
- [Vue I18n 官方文档](https://vue-i18n.intlify.dev/)

---

**提示**: 前端开发文档会随着项目发展持续更新，建议定期查看最新版本。
