# WHU.sb 文档中心

欢迎来到武汉大学课程评价系统的文档中心！

## 🚀 项目简介

WHU.sb 是一个现代化的课程评价平台，帮助学生找到适合的课程和分享学习体验。项目采用微服务架构，包含前端应用、后端API服务和边缘计算服务三个核心组件。

### 核心功能

- 📚 **课程管理** - 浏览、搜索课程信息，支持拼音和首字母搜索
- ⭐ **评价系统** - 提交和查看课程评价，支持多维度评分
- 🔍 **智能搜索** - 支持中文、拼音、首字母搜索，可视化查询构建器
- 🤖 **AI聊天** - 基于课程知识的智能问答，支持流式响应
- 📱 **PWA支持** - 离线缓存、推送通知、应用安装
- 🔧 **高级查询** - 可视化查询构建器，支持逻辑操作符和字段过滤
- 👥 **权限管理** - 基于RBAC的细粒度权限控制系统
- 🌐 **国际化** - 完整的中英文双语支持

## 📖 文档结构

### 使用教程
- 功能概览和使用指南
- 快速开始教程
- 常见问题解答

### 开发文档
- **前端开发** - Vue 3 + TypeScript + PrimeVue
- **后端开发** - Go + Gin + GORM
- **Cloudflare Worker** - 边缘计算服务
- **文档维护** - VitePress 文档系统
- **仓库管理** - Git 工作流程和规范

## 🛠️ 技术栈

### 前端应用
- **框架**: Vue 3 + TypeScript
- **UI库**: PrimeVue
- **构建工具**: Vite
- **状态管理**: Pinia
- **测试**: Vitest + Vue Test Utils

### 后端服务
- **语言**: Go 1.24.6+
- **框架**: Gin + GORM
- **数据库**: MySQL/PostgreSQL/SQLite + Redis
- **搜索引擎**: Meilisearch/Elasticsearch
- **向量数据库**: Qdrant/Cloudflare Vectorize

### 边缘服务
- **平台**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2
- **AI服务**: Cloudflare AI + Vectorize

## 🚀 快速开始

### 环境要求
- **Go**: 1.24.6+
- **Node.js**: 18+
- **MySQL**: 8.0+ 或 SQLite 3
- **Redis**: 6.0+ (可选)

### 开发启动
```bash
# 克隆项目
git clone https://github.com/WHU-sb/WHU-sb.git
cd whu.sb

# 启动后端
cd backend
go mod download
go run cmd/main.go serve

# 启动前端
cd frontend
npm install
npm run dev

# 启动Worker (可选)
cd cloudflare-worker
npm install
npm run dev
```

## 📚 文档导航

- [使用教程](/guide/) - 用户使用指南
- [开发文档](/dev/) - 开发者文档
- [项目架构](/dev/architecture) - 系统架构设计
- [技术栈](/dev/tech-stack) - 技术选型说明

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看以下链接了解如何参与：

- [贡献指南](/dev/docs/contributing)
- [代码规范](/dev/repo/code-standards)
- [PR流程](/dev/repo/pull-requests)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](https://github.com/WHU-sb/WHU-sb/blob/main/LICENSE) 文件了解详情。
