# 项目结构

## 目录结构概览

WHU.sb 前端项目采用模块化的目录结构，按功能分类组织代码：

```
frontend/
├── src/
│   ├── components/         # Vue组件
│   │   ├── ui/            # 基础UI组件
│   │   ├── features/      # 功能组件
│   │   ├── navigation/    # 导航组件
│   │   ├── forms/         # 表单组件
│   │   └── layout/        # 布局组件
│   ├── views/             # 页面视图
│   ├── stores/            # Pinia状态管理
│   ├── services/          # API服务
│   ├── composables/       # Vue组合式函数
│   ├── config/            # 配置文件
│   ├── types/             # TypeScript类型定义
│   ├── utils/             # 工具函数
│   ├── assets/            # 静态资源
│   ├── i18n/              # 国际化配置
│   ├── router/            # 路由配置
│   ├── plugins/           # 插件配置
│   ├── data/              # 数据文件
│   ├── locales/           # 语言包
│   └── __tests__/         # 测试文件
├── public/                # 静态资源
├── scripts/               # 构建脚本
├── wasm/                  # WebAssembly模块
└── tests/                 # 测试目录
```

## 核心目录详解

### components/ - 组件目录

组件按功能分类组织，便于维护和复用：

#### ui/ - 基础UI组件
- **AppButton.vue** - 通用按钮组件
- **AppDataTable.vue** - 数据表格组件
- **AppForm.vue** - 表单组件
- **AppSkeleton.vue** - 骨架屏组件
- **AppVirtualList.vue** - 虚拟列表组件
- **AppErrorBoundary.vue** - 错误边界组件

#### features/ - 功能组件
包含特定业务功能的组件，如课程评价、搜索等。

#### navigation/ - 导航组件
包含导航栏、面包屑、分页等导航相关组件。

#### forms/ - 表单组件
包含各种表单控件和表单验证组件。

#### layout/ - 布局组件
包含页面布局、侧边栏、头部等布局组件。

### stores/ - 状态管理

使用 Pinia 进行状态管理，按功能模块组织：

- **courses.ts** - 课程相关状态
- **reviews.ts** - 评价相关状态
- **teachers.ts** - 教师相关状态
- **search.ts** - 搜索相关状态
- **admin.ts** - 管理员相关状态
- **ham.ts** - HAM相关状态
- **random.ts** - 随机功能状态
- **translation.ts** - 翻译相关状态

### services/ - API服务

封装与后端API的交互逻辑：

- **api.ts** - API基础配置
- **auth.ts** - 认证相关API
- **courses.ts** - 课程相关API
- **reviews.ts** - 评价相关API

### composables/ - 组合式函数

Vue 3 组合式API的自定义函数：

- **useAuth.ts** - 认证相关逻辑
- **useApi.ts** - API调用逻辑
- **useLocalStorage.ts** - 本地存储逻辑

### views/ - 页面视图

按路由组织的页面组件：

- **Home.vue** - 首页
- **Courses.vue** - 课程页面
- **CourseDetail.vue** - 课程详情页
- **Reviews.vue** - 评价页面
- **Admin.vue** - 管理页面

## 文件命名规范

### 组件文件
- 使用 PascalCase 命名
- 以 `.vue` 扩展名结尾
- 例如：`AppButton.vue`、`CourseCard.vue`

### 工具文件
- 使用 camelCase 命名
- 以 `.ts` 扩展名结尾
- 例如：`useAuth.ts`、`apiUtils.ts`

### 类型定义文件
- 使用 camelCase 命名
- 以 `.ts` 扩展名结尾
- 例如：`types.ts`、`apiTypes.ts`

## 导入路径别名

项目配置了路径别名，简化导入：

```typescript
// 使用 @ 别名指向 src 目录
import AppButton from '@/components/ui/AppButton.vue'
import { useAuth } from '@/composables/useAuth'
import { coursesStore } from '@/stores/courses'
```

## 模块化设计

### 组件模块化
- 每个组件职责单一
- 组件间通过 props 和 events 通信
- 使用 TypeScript 定义组件接口

### 状态模块化
- 按业务功能划分 store
- 每个 store 管理相关状态
- 使用 TypeScript 定义状态类型

### 服务模块化
- API 服务按功能分类
- 统一的错误处理
- 请求拦截和响应拦截

## 构建配置

### Vite 配置
- 支持 TypeScript
- 配置路径别名
- 代码分割优化
- PWA 支持

### 开发工具
- ESLint 代码检查
- Prettier 代码格式化
- Vitest 单元测试
- Vue DevTools 调试

## 测试结构

### 单元测试
- 测试文件与源码文件对应
- 使用 Vitest 测试框架
- 支持组件测试和工具函数测试

### 测试覆盖率
- 目标覆盖率：80%+
- 使用 Vitest 内置覆盖率工具
- 集成到 CI/CD 流程

## 国际化结构

### 语言包组织
```
locales/
├── zh-CN.json          # 中文简体
├── en-US.json          # 英文
└── index.ts            # 语言包配置
```

### 翻译键命名
- 使用点号分隔的层级结构
- 按功能模块组织
- 例如：`course.title`、`review.submit`

## 静态资源管理

### 资源分类
- **images/** - 图片资源
- **icons/** - 图标资源
- **fonts/** - 字体文件
- **styles/** - 样式文件

### 资源优化
- 图片压缩和格式优化
- 字体文件按需加载
- CSS 模块化和压缩

## 部署结构

### 构建产物
```
dist/
├── assets/              # 静态资源
├── index.html           # 入口HTML
└── sw.js               # Service Worker
```

### 部署配置
- 支持 Cloudflare Pages 部署
- 配置 CDN 缓存策略
- 启用 Gzip 压缩

---

**提示**: 项目结构遵循 Vue 3 最佳实践，注重模块化和可维护性。
