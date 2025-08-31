# 版本管理

## 概述

WHU.sb 采用**语义化版本控制 (Semantic Versioning)** 规范，确保版本号的语义化和发布流程的标准化。本文档详细说明版本号格式、发布流程和变更日志管理。

## 🏷️ 语义化版本控制

### 版本号格式

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

### 版本号说明

- **MAJOR**: 主版本号，不兼容的 API 修改
- **MINOR**: 次版本号，向下兼容的功能性新增
- **PATCH**: 修订号，向下兼容的问题修正
- **PRERELEASE**: 预发布标识（可选）
- **BUILD**: 构建标识（可选）

### 版本类型

#### 正式版本
```
1.0.0
2.1.3
3.0.0
```

#### 预发布版本
```
1.0.0-alpha.1
1.0.0-beta.2
1.0.0-rc.1
```

#### 构建版本
```
1.0.0+build.1
1.0.0-alpha.1+build.2
```

## 🔄 版本发布流程

### 发布准备

#### 1. 功能冻结

```bash
# 确定版本功能范围
# 冻结新功能开发
# 只允许修复和文档更新
```

#### 2. 版本号更新

```bash
# 更新 package.json
{
  "version": "1.2.0"
}

# 更新 version.txt
1.2.0

# 更新 CHANGELOG.md
## [1.2.0] - 2024-01-15
```

#### 3. 最终测试

```bash
# 运行完整测试套件
npm test
npm run test:integration
npm run test:e2e

# 性能测试
npm run test:performance

# 安全扫描
npm audit
```

### 发布执行

#### 1. 创建发布分支

```bash
# 从 develop 创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

#### 2. 版本号更新

```bash
# 更新版本号
git add .
git commit -m "chore: bump version to v1.2.0"
```

#### 3. 最终测试和修复

```bash
# 在发布分支上进行最终测试
# 修复发现的关键问题

git add .
git commit -m "fix: resolve critical issue in release"
```

#### 4. 合并到 main

```bash
# 合并到 main 分支
git checkout main
git merge release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags
```

#### 5. 合并到 develop

```bash
# 合并到 develop 分支
git checkout develop
git merge release/v1.2.0
git push origin develop
```

#### 6. 删除发布分支

```bash
# 删除本地和远程发布分支
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### 紧急修复发布

#### 1. 创建热修复分支

```bash
# 从 main 创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug
```

#### 2. 快速修复

```bash
# 快速修复生产环境问题
git add .
git commit -m "fix: resolve critical authentication bug

- Fix JWT token validation issue
- Add additional security checks
- Update error handling

Fixes #789"
```

#### 3. 版本号更新

```bash
# 更新修订号
# 从 1.2.0 更新到 1.2.1
git add .
git commit -m "chore: bump version to v1.2.1"
```

#### 4. 合并发布

```bash
# 合并到 main
git checkout main
git merge hotfix/critical-bug
git tag -a v1.2.1 -m "Hotfix release v1.2.1"
git push origin main --tags

# 合并到 develop
git checkout develop
git merge hotfix/critical-bug
git push origin develop
```

## 📝 变更日志管理

### 变更日志格式

```markdown
# 变更日志

## [未发布]

### 新增
- 新功能 A
- 新功能 B

### 修改
- 功能 C 的改进

### 修复
- 问题 D 的修复

## [1.2.0] - 2024-01-15

### 新增
- 用户认证功能
- 课程搜索功能

### 修改
- 优化数据库查询性能
- 更新 API 响应格式

### 修复
- 修复登录验证问题
- 修复分页计算错误

## [1.1.0] - 2024-01-01

### 新增
- 用户管理功能

### 修复
- 修复数据验证问题
```

### 变更类型

#### 新增 (Added)
- 新功能
- 新 API 端点
- 新配置选项

#### 修改 (Changed)
- 现有功能改进
- API 行为变更
- 性能优化

#### 废弃 (Deprecated)
- 即将移除的功能
- 不推荐使用的 API

#### 移除 (Removed)
- 已废弃的功能
- 不再支持的 API

#### 修复 (Fixed)
- 错误修复
- 安全漏洞修复

#### 安全 (Security)
- 安全相关修复

## 🛠️ 版本管理工具

### 自动化脚本

#### 版本发布脚本

```bash
#!/bin/bash
# scripts/release.sh

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "用法: $0 <version>"
    echo "示例: $0 1.2.0"
    exit 1
fi

echo "🚀 开始发布版本 $VERSION..."

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
    echo "❌ 请在 develop 分支上执行发布"
    exit 1
fi

# 更新 develop 分支
git pull origin develop

# 创建发布分支
RELEASE_BRANCH="release/v$VERSION"
git checkout -b $RELEASE_BRANCH

# 更新版本号
echo "📝 更新版本号..."
npm version $VERSION --no-git-tag-version

# 更新变更日志
echo "📝 更新变更日志..."
# 这里可以添加自动更新变更日志的逻辑

# 提交版本更新
git add .
git commit -m "chore: bump version to v$VERSION"

echo "✅ 版本 $VERSION 发布分支创建完成"
echo "💡 下一步："
echo "1. 在 $RELEASE_BRANCH 上进行最终测试"
echo "2. 修复发现的问题"
echo "3. 运行 'scripts/merge-release.sh $VERSION' 完成发布"
```

#### 发布合并脚本

```bash
#!/bin/bash
# scripts/merge-release.sh

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "用法: $0 <version>"
    echo "示例: $0 1.2.0"
    exit 1
fi

echo "🔄 开始合并发布版本 $VERSION..."

RELEASE_BRANCH="release/v$VERSION"

# 检查发布分支是否存在
if ! git show-ref --verify --quiet refs/heads/$RELEASE_BRANCH; then
    echo "❌ 发布分支 $RELEASE_BRANCH 不存在"
    exit 1
fi

# 合并到 main
echo "📦 合并到 main 分支..."
git checkout main
git pull origin main
git merge $RELEASE_BRANCH
git tag -a v$VERSION -m "Release version $VERSION"
git push origin main --tags

# 合并到 develop
echo "📦 合并到 develop 分支..."
git checkout develop
git pull origin develop
git merge $RELEASE_BRANCH
git push origin develop

# 删除发布分支
echo "🗑️ 删除发布分支..."
git branch -d $RELEASE_BRANCH
git push origin --delete $RELEASE_BRANCH

echo "✅ 版本 $VERSION 发布完成"
```

### 版本检查工具

#### 版本验证脚本

```bash
#!/bin/bash
# scripts/validate-version.sh

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "用法: $0 <version>"
    exit 1
fi

# 检查版本号格式
if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$'; then
    echo "❌ 版本号格式错误: $VERSION"
    echo "期望格式: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]"
    exit 1
fi

# 检查是否已存在
if git tag -l | grep -q "^v$VERSION$"; then
    echo "❌ 版本 $VERSION 已存在"
    exit 1
fi

echo "✅ 版本号 $VERSION 格式正确"
```

## 📊 版本管理最佳实践

### 版本号选择原则

#### MAJOR 版本升级
- 不兼容的 API 修改
- 重大架构变更
- 数据库结构变更

#### MINOR 版本升级
- 新功能添加
- 向下兼容的功能改进
- 新 API 端点

#### PATCH 版本升级
- 错误修复
- 安全漏洞修复
- 文档更新

### 发布频率

#### 正式版本
- **MAJOR**: 按需发布，重大变更时
- **MINOR**: 每月发布，新功能完成时
- **PATCH**: 每周发布，错误修复时

#### 预发布版本
- **Alpha**: 功能开发阶段
- **Beta**: 功能测试阶段
- **RC**: 发布候选阶段

### 版本兼容性

#### 向后兼容
- 保持 API 接口稳定
- 数据库结构兼容
- 配置文件兼容

#### 升级指南
- 提供详细的升级文档
- 说明不兼容变更
- 提供迁移脚本

## 🚨 常见问题和解决方案

### 版本冲突

#### 问题描述
多个分支同时修改版本号

#### 解决方案

```bash
# 协调版本号更新
git checkout develop
git pull origin develop

# 解决冲突
git merge release/v1.2.0
# 手动解决版本号冲突

# 重新提交
git add .
git commit -m "chore: resolve version conflict"
```

### 错误发布

#### 问题描述
发布了错误的版本

#### 解决方案

```bash
# 撤销标签
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0

# 撤销合并
git checkout main
git reset --hard HEAD~1
git push --force origin main

# 重新发布
git checkout release/v1.2.0
# 修复问题后重新发布
```

### 版本回滚

#### 问题描述
需要回滚到之前的版本

#### 解决方案

```bash
# 创建回滚分支
git checkout -b hotfix/rollback-to-v1.1.0

# 回滚到指定版本
git revert --no-commit v1.2.0..HEAD
git commit -m "revert: rollback to v1.1.0

- Revert all changes from v1.2.0
- Restore v1.1.0 functionality

Reverts #123"

# 发布回滚版本
git checkout main
git merge hotfix/rollback-to-v1.1.0
git tag -a v1.2.1 -m "Rollback release v1.2.1"
git push origin main --tags
```

## 📈 版本管理监控

### 关键指标

1. **发布频率**: 版本发布间隔
2. **版本质量**: 发布后问题数量
3. **升级成功率**: 版本升级成功率
4. **兼容性**: 向后兼容性保持

### 定期审查

1. **每周**: 审查版本发布计划
2. **每月**: 分析版本质量指标
3. **每季度**: 优化版本管理流程

---

通过遵循本文档中的版本管理规范，可以建立稳定、可预测的版本发布流程，确保软件质量和用户满意度。
