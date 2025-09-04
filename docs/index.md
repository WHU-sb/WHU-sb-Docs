---
layout: home
hero:
  name: WHU.sb
  text: 武汉大学课程评价系统
  tagline: 现代化的课程评价平台，帮助学生找到适合的课程和分享学习体验
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 查看源码
      link: https://github.com/WHU-sb/WHU-sb
    - theme: alt
      text: 在线体验
      link: https://whu.sb

features:
  - icon: 📚
    title: 课程管理
    details: 浏览、搜索课程信息，支持拼音和首字母搜索，智能推荐系统
  - icon: ⭐
    title: 评价系统
    details: 提交和查看课程评价，支持多维度评分，真实用户反馈
  - icon: 🔍
    title: 智能搜索
    details: 支持中文、拼音、首字母搜索，可视化查询构建器，快速定位目标课程
  - icon: 🤖
    title: AI聊天
    details: 基于课程知识的智能问答，支持流式响应，个性化学习建议
  - icon: 📱
    title: PWA支持
    details: 离线缓存、推送通知、应用安装，提供原生应用体验
  - icon: 🔧
    title: 高级查询
    details: 可视化查询构建器，支持逻辑操作符和字段过滤，精确匹配需求

---

## 🚀 项目简介

WHU.sb 是一个现代化的课程评价平台，采用微服务架构设计，包含前端应用、后端API服务和边缘计算服务三个核心组件。项目致力于为学生提供最佳的课程选择体验，通过智能推荐、用户评价和AI辅助决策，帮助学生做出明智的选课决定。

## 🛠️ 技术架构

<div class="tech-stack">

### 前端应用
- **框架**: Vue 3 + TypeScript + Composition API
- **UI库**: PrimeVue + Tailwind CSS
- **构建工具**: Vite + Rollup
- **状态管理**: Pinia
- **测试**: Vitest + Vue Test Utils
- **PWA**: Workbox + Service Worker

### 后端服务
- **语言**: Go 1.24.6+
- **框架**: Gin + GORM + JWT
- **数据库**: MySQL/PostgreSQL/SQLite + Redis
- **搜索引擎**: Meilisearch/Elasticsearch
- **向量数据库**: Qdrant/Cloudflare Vectorize
- **监控**: Prometheus + Grafana

### 边缘服务
- **平台**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2
- **AI服务**: Cloudflare AI + Vectorize
- **CDN**: Cloudflare全球加速

</div>

## 📖 文档导航

<div class="doc-sections">

### 使用教程
- 功能概览 - 系统功能详细介绍
- 快速开始 - 新用户入门指南

### 开发文档
- [项目架构](/dev/architecture) - 系统架构设计说明
- [技术栈](/dev/tech-stack) - 技术选型与决策
- [开发环境设置](/dev/development-setup) - 本地开发环境配置

### 前端开发
- [Vue 3 开发指南](/dev/frontend/) - 前端技术栈详解
- [组件开发](/dev/frontend/components) - 组件设计与开发规范
- [状态管理](/dev/frontend/state-management) - Pinia状态管理最佳实践

### 后端开发
- [Go API开发](/dev/backend/) - 后端服务架构与实现
- [数据库设计](/dev/backend/database) - 数据模型与关系设计
- [权限系统](/dev/backend/rbac) - RBAC权限控制实现

### 边缘服务
- [Cloudflare Worker](/dev/cloudflare/) - 边缘计算服务详解
- AI服务集成 - 人工智能服务接入
- 向量搜索 - 语义搜索实现

</div>

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

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是代码贡献、文档改进、问题报告还是功能建议，都是我们前进的动力。

- [代码规范](/dev/repo/code-standards) - 代码风格与质量标准
- [PR流程](/dev/repo/pr-workflow) - 提交代码的完整流程

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](https://github.com/WHU-sb/WHU-sb/blob/main/LICENSE) 文件了解详情。

---

<div class="footer-note">
<p>💡 如果您在使用过程中遇到任何问题，欢迎在 <a href="https://github.com/WHU-sb/WHU-sb/issues">GitHub Issues</a> 中反馈。</p>
</div>
