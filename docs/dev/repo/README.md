# 仓库维护和管理指南

## 概述

本文档旨在帮助开发团队有效管理 WHU.sb 项目的代码仓库，包括 Git 工作流程、子模块管理、分支策略和协作规范。通过规范化的仓库管理，确保代码质量、协作效率和项目可维护性。

### 文档目标
- **新开发者**: 快速理解项目结构和协作流程
- **维护开发者**: 掌握高级 Git 操作和仓库管理技巧
- **项目管理者**: 了解分支策略和发布流程

### 核心价值
- 提供完整的 Git 工作流程指导
- 详细说明子模块管理和依赖控制
- 包含大量实用的命令示例
- 涵盖团队协作的最佳实践

## 📚 文档结构

### 核心指南
- **[分支策略](./branch-strategy.md)** - Git Flow 工作流程和分支管理
- **[提交规范](./commit-conventions.md)** - Conventional Commits 和提交信息规范
- **[PR 流程](./pr-workflow.md)** - Pull Request 创建、审查和合并流程
- **[版本管理](./version-management.md)** - 语义化版本控制和发布流程

### 工具和配置
- **[CI/CD 配置](./ci-cd-config.md)** - GitHub Actions 和自动化流水线
- **[子模块管理](./submodule-management.md)** - Git 子模块的使用和维护
- **[代码规范](./code-standards.md)** - 代码风格和质量检查

### 最佳实践
- **[团队协作](./team-collaboration.md)** - 代码审查和冲突解决策略
- **[安全实践](./security-practices.md)** - 敏感信息管理和安全扫描

## 🏗️ 项目结构

### 仓库架构设计

WHU.sb 采用**单体仓库 (Monorepo)** 架构，将前端、后端、文档等所有相关代码集中管理，便于统一版本控制和协作开发。

#### 设计优势
- **统一版本控制**: 所有组件使用相同的版本标签
- **简化依赖管理**: 避免跨仓库的复杂依赖关系
- **便于重构**: 跨组件的重构可以原子性提交
- **统一工具链**: 共享构建、测试、部署工具

### 目录结构详解

```
whu.sb/
├── backend/                 # 后端服务 (Go)
│   ├── cmd/                # 应用程序入口点
│   ├── internal/           # 内部包
│   ├── config/             # 配置文件
│   ├── proto/              # Protocol Buffers 定义
│   └── scripts/            # 部署和维护脚本
├── frontend/               # 前端应用 (Vue.js)
│   ├── src/                # 源代码
│   ├── public/             # 静态资源
│   ├── dist/               # 构建输出
│   └── tests/              # 测试文件
├── cloudflare-worker/      # Cloudflare Worker (TypeScript)
│   ├── src/                # 源代码
│   ├── migrations/         # 数据库迁移
│   └── tests/              # 测试文件
├── docs/                   # 项目文档
│   ├── docs/               # 文档源文件
│   └── README.md           # 文档说明
├── scripts/                # 全局脚本和工具
├── .github/                # GitHub 配置
├── .gitignore              # Git 忽略文件
├── .gitmodules             # Git 子模块配置
└── README.md               # 项目总览
```

## 🚀 快速开始

### 环境准备

1. **安装 Git**: 确保 Git 版本 2.0+
2. **配置用户信息**: 设置用户名和邮箱
3. **SSH 密钥**: 配置 GitHub SSH 密钥（推荐）

### 克隆项目

```bash
# 克隆包含子模块的仓库
git clone --recursive https://github.com/WHU-sb/WHU-sb.git
cd whu.sb

# 或者克隆后初始化子模块
git clone https://github.com/WHU-sb/WHU-sb.git
cd whu.sb
git submodule init
git submodule update
```

### 初始设置

```bash
# 安装 Git Hooks
bash scripts/git-hooks/install.sh

# 安装项目依赖
bash scripts/init-repo.sh
```

## 📋 工作流程概览

### 开发流程

1. **创建功能分支**: 从 `develop` 分支创建功能分支
2. **开发功能**: 在功能分支上进行开发
3. **提交代码**: 遵循提交规范提交代码
4. **创建 PR**: 创建 Pull Request 进行代码审查
5. **合并代码**: 通过审查后合并到 `develop` 分支

### 发布流程

1. **创建发布分支**: 从 `develop` 创建 `release` 分支
2. **版本测试**: 在发布分支上进行最终测试
3. **合并到 main**: 测试通过后合并到 `main` 分支
4. **创建标签**: 创建版本标签
5. **部署发布**: 部署到生产环境

### 紧急修复

1. **创建热修复分支**: 从 `main` 创建 `hotfix` 分支
2. **快速修复**: 修复生产环境问题
3. **合并发布**: 合并到 `main` 和 `develop` 分支
4. **紧急部署**: 部署修复到生产环境

## 🛠️ 常用工具

### 自动化脚本

- **`scripts/init-repo.sh`**: 仓库初始化脚本
- **`scripts/branch-manager.sh`**: 分支管理工具
- **`scripts/repo-health-check.sh`**: 仓库健康检查
- **`scripts/optimize-repo.sh`**: 仓库优化工具

### Git Hooks

- **pre-commit**: 提交前代码质量检查
- **commit-msg**: 提交信息格式验证
- **post-commit**: 提交后自动化任务

### CI/CD 工具

- **GitHub Actions**: 自动化测试和部署
- **CodeQL**: 代码安全分析
- **Dependabot**: 依赖更新管理

## 📊 监控和维护

### 定期任务

- **每周**: 清理已合并分支
- **每月**: 更新依赖和子模块
- **每季度**: 仓库健康检查和优化

### 性能指标

- **代码质量**: 测试覆盖率、代码规范检查
- **协作效率**: PR 合并时间、冲突频率
- **发布稳定性**: 发布成功率、回滚频率

## 🎯 最佳实践总结

### 核心原则

1. **规范化**: 建立统一的 Git 工作流程和提交规范
2. **自动化**: 利用工具和脚本自动化重复性任务
3. **安全性**: 严格控制敏感信息和访问权限
4. **可维护性**: 定期维护和优化仓库状态

### 成功指标

1. **代码质量**: 通过自动化检查确保代码质量
2. **协作效率**: 减少冲突和合并问题
3. **发布稳定性**: 确保版本发布的稳定性
4. **安全性**: 避免敏感信息泄露

## 📚 参考资源

### 官方文档
- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 文档](https://docs.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### 最佳实践
- [Git Flow 工作流程](https://nvie.com/posts/a-successful-git-branching-model/)
- [语义化版本控制](https://semver.org/)
- [Git 子模块](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

### 工具推荐
- **IDE 集成**: VS Code Git 插件、GitLens
- **命令行工具**: Git Flow、Hub
- **可视化工具**: GitKraken、SourceTree

---

通过遵循本文档和相关子文档中的指南，可以建立高效、安全、可维护的代码仓库管理体系。记住，优秀的仓库管理不仅要满足当前需求，更要为未来的发展奠定坚实基础。
