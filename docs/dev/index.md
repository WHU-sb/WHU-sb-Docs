# 开发文档

欢迎开发者！这里是 WHU.sb 项目的开发文档中心。

## 🏗️ 项目架构

WHU.sb 采用微服务架构，包含三个核心组件：

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用      │    │   后端API服务   │    │  Cloudflare     │
│   (Vue 3)       │◄──►│   (Go/Gin)      │◄──►│   Worker        │
│                 │    │                 │    │                 │
│ - 用户界面      │    │ - 业务逻辑      │    │ - 边缘计算      │
│ - 状态管理      │    │ - 数据访问      │    │ - AI服务        │
│ - PWA功能       │    │ - 权限控制      │    │ - 缓存优化      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术选型

| 组件 | 技术栈 | 主要功能 |
|------|--------|----------|
| **前端** | Vue 3 + TypeScript + PrimeVue | 用户界面、PWA、国际化 |
| **后端** | Go + Gin + GORM | API服务、业务逻辑、数据访问 |
| **边缘** | Cloudflare Workers | AI服务、缓存、边缘计算 |
| **数据库** | MySQL/PostgreSQL + Redis | 数据存储、缓存 |
| **搜索** | Meilisearch/Elasticsearch | 全文搜索 |
| **向量** | Qdrant/Cloudflare Vectorize | 向量搜索、AI |

## 🚀 快速开始

### 环境准备

详细的开发环境设置指南，请参考：[开发环境设置指南](./development-setup.md)

**快速检查清单**：
1. **Go 1.24.6+** - `go version`
2. **Node.js 18+** - `node --version`
3. **MySQL 8.0+** - `mysql --version`
4. **Redis 6.0+** - `redis-cli ping`

### 项目启动

```bash
# 克隆项目
git clone https://github.com/WHU-sb/WHU-sb.git
cd whu.sb
git submodule update --init --recursive

# 后端服务
cd backend
go mod download
go run cmd/main.go serve

# 前端应用
cd frontend
npm install
npm run dev

# Cloudflare Worker (可选)
cd cloudflare-worker
npm install
npm run dev
```

### 验证安装

- **后端**: 本地API服务健康检查端点
- **前端**: 本地开发服务器
- **API文档**: 本地API文档端点

## 📚 开发指南

### 前端开发
- [项目结构](/dev/frontend/structure) - 目录结构和文件组织
- [技术栈](/dev/frontend/tech-stack) - Vue 3 + TypeScript + PrimeVue
- [开发环境](/dev/frontend/development) - 环境配置和开发工具
- [组件开发](/dev/frontend/components) - 组件设计和开发规范
- [状态管理](/dev/frontend/state-management) - Pinia 状态管理
- [路由配置](/dev/frontend/routing) - Vue Router 配置
- [国际化](/dev/frontend/internationalization) - 多语言支持
- [PWA配置](/dev/frontend/pwa) - Progressive Web App
- [测试指南](/dev/frontend/testing) - Vitest 测试
- [构建部署](/dev/frontend/build-deploy) - 构建和部署流程

### 后端开发
- [API设计](/dev/backend/api-design) - RESTful API 设计
- [数据库设计](/dev/backend/database) - 数据库模型和迁移
- [权限系统](/dev/backend/rbac) - RBAC 权限控制
- [缓存策略](/dev/backend/cache-strategy) - Redis 缓存
- [部署配置](/dev/backend/deployment) - 生产环境部署

### Cloudflare Worker
- [项目结构](/dev/cloudflare/structure) - Worker 项目结构
- [开发环境](/dev/cloudflare/development) - Wrangler 开发环境
- [D1数据库](/dev/cloudflare/d1-database) - Cloudflare D1
- [测试指南](/dev/cloudflare/testing) - Vitest 测试

## 📖 文档维护

- [写作规范](/dev/docs/writing-guide) - 文档写作标准

## 🔧 仓库管理

- [分支策略](/dev/repo/branch-strategy) - Git 分支管理
- [提交规范](/dev/repo/commit-conventions) - 提交信息规范
- [PR流程](/dev/repo/pr-workflow) - 代码审查流程
- [版本管理](/dev/repo/version-management) - 版本发布流程
- [CI/CD配置](/dev/repo/ci-cd-config) - 持续集成部署
- [子模块管理](/dev/repo/submodule-management) - Git 子模块
- [代码规范](/dev/repo/code-standards) - 代码风格指南

## 🧪 测试

### 测试覆盖情况

- **后端**: 33% 覆盖率，重点测试权限系统
- **前端**: Vitest + Vue Test Utils
- **Worker**: Vitest (计划中)

### 运行测试

```bash
# 后端测试
cd backend
go test ./...

# 前端测试
cd frontend
npm run test

# Worker测试
cd cloudflare-worker
npm run test
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看：

- [代码规范](/dev/repo/code-standards)
- [PR流程](/dev/repo/pr-workflow)

## 📞 联系方式

- **GitHub**: [WHU-sb/WHU-sb](https://github.com/WHU-sb/WHU-sb)
- **Issues**: [问题反馈](https://github.com/WHU-sb/WHU-sb/issues)
- **Discussions**: [技术讨论](https://github.com/WHU-sb/WHU-sb/discussions)

---

> 💡 **提示**: 开发文档会随着项目发展持续更新，建议定期查看最新版本。
