# 子模块管理

## 概述

WHU.sb 使用 Git 子模块管理外部依赖和共享组件，确保依赖版本的一致性和可控性。本文档详细说明子模块的设计理念、配置方法和操作指南。

## 🏗️ 子模块设计理念

### 使用场景

- **共享组件库**: 跨项目使用的通用组件
- **第三方工具**: 定制化的第三方工具和脚本
- **文档模板**: 统一的文档模板和样式
- **配置模板**: 标准化的配置文件模板

### 设计优势

- **版本控制**: 精确控制依赖版本
- **代码复用**: 避免重复代码
- **独立维护**: 子模块可以独立开发和维护
- **一致性**: 确保所有项目使用相同版本

## 📋 子模块配置

### .gitmodules 文件

```bash
# .gitmodules 文件示例
[submodule "shared-components"]
    path = shared/components
    url = https://github.com/WHU-sb/shared-components.git
    branch = main

[submodule "docs-templates"]
    path = docs/templates
    url = https://github.com/WHU-sb/docs-templates.git
    branch = main

[submodule "deploy-scripts"]
    path = scripts/deploy
    url = https://github.com/WHU-sb/deploy-scripts.git
    branch = main
```

### 子模块结构

```
whu.sb/
├── shared/
│   └── components/          # 共享组件库
│       ├── ui/             # UI 组件
│       ├── utils/          # 工具函数
│       └── styles/         # 样式文件
├── docs/
│   └── templates/          # 文档模板
│       ├── api/            # API 文档模板
│       ├── guides/         # 指南模板
│       └── assets/         # 模板资源
└── scripts/
    └── deploy/             # 部署脚本
        ├── docker/         # Docker 配置
        ├── kubernetes/     # K8s 配置
        └── terraform/      # Terraform 配置
```

## 🔧 子模块操作

### 初始化子模块

#### 克隆包含子模块的仓库

```bash
# 方法 1: 递归克隆
git clone --recursive https://github.com/WHU-sb/WHU-sb.git
cd whu.sb

# 方法 2: 分步克隆
git clone https://github.com/WHU-sb/WHU-sb.git
cd whu.sb
git submodule init
git submodule update
```

#### 初始化现有仓库的子模块

```bash
# 初始化所有子模块
git submodule init

# 更新所有子模块
git submodule update

# 或者同时执行
git submodule update --init --recursive
```

### 添加新子模块

#### 添加子模块

```bash
# 添加新的子模块
git submodule add https://github.com/WHU-sb/new-component.git components/new

# 指定分支
git submodule add -b develop https://github.com/WHU-sb/new-component.git components/new

# 提交子模块添加
git add .gitmodules components/new
git commit -m "Add new-component submodule"
```

#### 添加现有仓库作为子模块

```bash
# 将现有目录转换为子模块
git submodule add https://github.com/WHU-sb/existing-repo.git path/to/submodule

# 如果目录已存在，先删除
rm -rf path/to/submodule
git submodule add https://github.com/WHU-sb/existing-repo.git path/to/submodule
```

### 更新子模块

#### 更新所有子模块

```bash
# 更新所有子模块到最新版本
git submodule update --remote

# 更新特定子模块
git submodule update --remote shared/components

# 更新并初始化
git submodule update --init --remote
```

#### 更新特定子模块

```bash
# 进入子模块目录
cd shared/components

# 切换到指定分支
git checkout main

# 拉取最新代码
git pull origin main

# 返回主项目
cd ../..

# 提交子模块更新
git add shared/components
git commit -m "Update shared-components to latest version"
```

### 移除子模块

#### 完全移除子模块

```bash
# 1. 取消初始化子模块
git submodule deinit -f shared/components

# 2. 从工作目录和索引中删除
git rm -f shared/components

# 3. 删除 .git/modules 中的子模块
rm -rf .git/modules/shared/components

# 4. 提交更改
git commit -m "Remove shared-components submodule"
```

#### 保留子模块文件

```bash
# 取消初始化但保留文件
git submodule deinit shared/components

# 删除 .gitmodules 中的条目
# 手动编辑 .gitmodules 文件

# 提交更改
git add .gitmodules
git commit -m "Remove shared-components from submodules"
```

## 🔄 子模块工作流程

### 日常开发流程

#### 1. 更新子模块

```bash
# 获取所有子模块的最新信息
git submodule update --remote

# 检查子模块状态
git submodule status
```

#### 2. 在子模块中开发

```bash
# 进入子模块目录
cd shared/components

# 创建功能分支
git checkout -b feature/new-component

# 开发功能
# ... 编写代码 ...

# 提交更改
git add .
git commit -m "feat: add new component"

# 推送到远程
git push origin feature/new-component

# 创建 PR 到子模块仓库
# 在 GitHub 上创建 PR

# 合并后更新主项目
cd ../..
git add shared/components
git commit -m "Update shared-components with new component"
```

#### 3. 更新主项目

```bash
# 更新子模块引用
git submodule update --remote

# 提交更新
git add .
git commit -m "Update submodules to latest versions"
```

### 发布流程

#### 1. 子模块发布

```bash
# 在子模块中创建发布标签
cd shared/components
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
cd ../..
```

#### 2. 主项目更新

```bash
# 更新到特定版本
cd shared/components
git checkout v1.2.0
cd ../..

# 提交版本更新
git add shared/components
git commit -m "Update shared-components to v1.2.0"
```

## 🛠️ 子模块管理工具

### 自动化脚本

#### 子模块初始化脚本

```bash
#!/bin/bash
# scripts/init-submodules.sh

set -e

echo "🔗 初始化子模块..."

# 检查 .gitmodules 文件是否存在
if [ ! -f ".gitmodules" ]; then
    echo "ℹ️  没有找到 .gitmodules 文件，跳过子模块初始化"
    exit 0
fi

# 初始化子模块
echo "📦 初始化子模块..."
git submodule init

# 更新子模块
echo "🔄 更新子模块..."
git submodule update --init --recursive

echo "✅ 子模块初始化完成"
```

#### 子模块更新脚本

```bash
#!/bin/bash
# scripts/update-submodules.sh

set -e

echo "🔄 更新子模块..."

# 更新所有子模块
git submodule update --remote

# 显示更新状态
echo "📊 子模块状态:"
git submodule status

# 检查是否有更新
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  发现子模块更新，请提交更改"
    git status --short
else
    echo "✅ 所有子模块都是最新的"
fi
```

#### 子模块清理脚本

```bash
#!/bin/bash
# scripts/clean-submodules.sh

set -e

echo "🧹 清理子模块..."

# 获取所有子模块路径
submodules=$(git submodule foreach --quiet 'echo $name')

for submodule in $submodules; do
    echo "清理子模块: $submodule"
    
    # 进入子模块目录
    cd "$submodule"
    
    # 清理未跟踪的文件
    git clean -fd
    
    # 重置到 HEAD
    git reset --hard HEAD
    
    # 返回主项目目录
    cd - > /dev/null
done

echo "✅ 子模块清理完成"
```

### 常用命令

#### 查看子模块状态

```bash
# 查看所有子模块状态
git submodule status

# 查看特定子模块状态
git submodule status shared/components

# 查看子模块详细信息
git submodule foreach 'echo "=== $name ===" && git status'
```

#### 子模块分支管理

```bash
# 查看子模块分支
git submodule foreach 'echo "=== $name ===" && git branch -a'

# 切换子模块分支
git submodule foreach 'git checkout main'

# 更新子模块分支
git submodule foreach 'git pull origin main'
```

## 🚨 常见问题和解决方案

### 子模块更新失败

#### 问题描述
子模块更新时出现错误

#### 解决方案

```bash
# 重置子模块
git submodule deinit -f shared/components
git submodule update --init shared/components

# 或者手动更新
cd shared/components
git fetch origin
git reset --hard origin/main
cd ../..
```

### 子模块冲突

#### 问题描述
子模块与主项目存在冲突

#### 解决方案

```bash
# 解决子模块冲突
cd shared/components
git status
# 手动解决冲突
git add .
git commit -m "Resolve conflicts"
cd ../..

# 更新主项目
git add shared/components
git commit -m "Update submodule after conflict resolution"
```

### 子模块分支问题

#### 问题描述
子模块处于分离头指针状态

#### 解决方案

```bash
# 切换到主分支
cd shared/components
git checkout main
git pull origin main
cd ../..

# 更新主项目
git add shared/components
git commit -m "Fix submodule branch"
```

## 📊 子模块最佳实践

### 版本管理

1. **固定版本**: 使用标签或特定提交
2. **定期更新**: 定期更新到最新版本
3. **测试验证**: 更新后进行全面测试
4. **文档记录**: 记录版本变更

### 开发流程

1. **独立开发**: 在子模块中独立开发
2. **版本控制**: 为子模块创建版本标签
3. **测试集成**: 在主项目中测试集成
4. **文档同步**: 同步相关文档

### 维护策略

1. **定期检查**: 定期检查子模块状态
2. **安全更新**: 及时应用安全更新
3. **性能优化**: 优化子模块性能
4. **清理维护**: 清理不需要的子模块

## 📈 子模块监控

### 关键指标

1. **更新频率**: 子模块更新频率
2. **版本一致性**: 版本一致性检查
3. **依赖关系**: 子模块依赖关系
4. **维护状态**: 子模块维护状态

### 定期审查

1. **每周**: 检查子模块更新
2. **每月**: 审查子模块使用情况
3. **每季度**: 优化子模块策略

---

通过遵循本文档中的子模块管理规范，可以建立高效、可维护的依赖管理系统，确保项目的一致性和稳定性。
