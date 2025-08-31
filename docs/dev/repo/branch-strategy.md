# 分支策略

## 概述

WHU.sb 采用 **Git Flow** 分支策略，结合 **Feature Branch** 工作流程，确保代码质量和发布稳定性。本文档详细说明分支类型、命名规范、工作流程和最佳实践。

## 🏗️ 分支架构

### 分支类型和用途

#### 主要分支

- **main**: 生产环境代码，只接受经过测试的稳定版本
- **develop**: 开发分支，集成所有功能开发
- **release**: 发布分支，用于版本发布前的最终测试

#### 辅助分支

- **feature/***: 功能开发分支，从 develop 分支创建
- **hotfix/***: 紧急修复分支，从 main 分支创建
- **bugfix/***: 问题修复分支，从 develop 分支创建

### 分支生命周期

```
main ←─── hotfix/xxx ←─── main
  ↑           ↑
  │           │
  │         develop
  │           ↑
  │         feature/xxx
  │           ↑
develop ←─── release/xxx
```

## 📝 分支命名规范

### 命名格式

```
<type>/<description>
```

### 分支类型

#### 功能开发分支
```bash
feature/user-authentication
feature/course-search
feature/admin-dashboard
feature/api-rate-limiting
```

#### 问题修复分支
```bash
bugfix/login-validation
bugfix/database-connection
bugfix/api-response-format
bugfix/memory-leak
```

#### 紧急修复分支
```bash
hotfix/security-vulnerability
hotfix/critical-bug
hotfix/performance-issue
hotfix/data-loss
```

#### 发布分支
```bash
release/v1.2.0
release/v1.3.0-beta
release/v2.0.0-rc
```

### 命名规则

1. **使用小写字母和连字符**
2. **描述要简洁明了**
3. **避免使用特殊字符**
4. **长度控制在 50 字符以内**

## 🔄 工作流程

### 功能开发流程

#### 1. 创建功能分支

```bash
# 确保 develop 分支是最新的
git checkout develop
git pull origin develop

# 创建功能分支
git checkout -b feature/user-profile
```

#### 2. 开发功能

```bash
# 在功能分支上进行开发
# ... 编写代码和测试 ...

# 提交代码（遵循提交规范）
git add .
git commit -m "feat: add user profile management

- Add user profile model and repository
- Implement profile update API
- Add profile validation middleware
- Update API documentation

Closes #123"
```

#### 3. 推送分支

```bash
# 推送到远程仓库
git push origin feature/user-profile
```

#### 4. 创建 Pull Request

在 GitHub 上创建 PR，从 `feature/user-profile` 到 `develop`

### 问题修复流程

#### 1. 创建修复分支

```bash
# 从 develop 分支创建修复分支
git checkout develop
git pull origin develop
git checkout -b bugfix/login-validation
```

#### 2. 修复问题

```bash
# 修复问题并提交
git add .
git commit -m "fix: resolve login validation issue

- Fix email format validation
- Add proper error messages
- Update validation tests

Fixes #456"
```

#### 3. 推送和创建 PR

```bash
git push origin bugfix/login-validation
# 创建 PR 到 develop 分支
```

### 发布流程

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
# 编辑 package.json、version.txt 等文件

git add .
git commit -m "chore: bump version to v1.2.0"
```

#### 3. 最终测试和修复

```bash
# 在 release 分支上进行最终测试
# 修复发现的问题（只修复关键问题）

git add .
git commit -m "fix: resolve critical issue in release"
```

#### 4. 合并到 main 和 develop

```bash
# 合并到 main
git checkout main
git merge release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# 合并到 develop
git checkout develop
git merge release/v1.2.0
git push origin develop
```

#### 5. 删除发布分支

```bash
# 删除本地和远程发布分支
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### 紧急修复流程

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
# ... 修复代码 ...

git add .
git commit -m "fix: resolve critical authentication bug

- Fix JWT token validation issue
- Add additional security checks
- Update error handling

Fixes #789"
```

#### 3. 合并到 main 和 develop

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

#### 4. 删除热修复分支

```bash
git branch -d hotfix/critical-bug
git push origin --delete hotfix/critical-bug
```

## 🛠️ 分支管理工具

### 自动化脚本

#### 分支创建脚本

```bash
#!/bin/bash
# scripts/create-branch.sh

set -e

BRANCH_TYPE=$1
BRANCH_NAME=$2

if [ -z "$BRANCH_TYPE" ] || [ -z "$BRANCH_NAME" ]; then
    echo "用法: $0 <type> <name>"
    echo "类型: feature, bugfix, hotfix, release"
    exit 1
fi

# 确定源分支
SOURCE_BRANCH="develop"
if [ "$BRANCH_TYPE" = "hotfix" ]; then
    SOURCE_BRANCH="main"
fi

# 切换到源分支并更新
git checkout $SOURCE_BRANCH
git pull origin $SOURCE_BRANCH

# 创建新分支
BRANCH_FULL_NAME="$BRANCH_TYPE/$BRANCH_NAME"
git checkout -b $BRANCH_FULL_NAME

echo "✅ 分支创建成功: $BRANCH_FULL_NAME"
echo "💡 提示: 使用 'git push origin $BRANCH_FULL_NAME' 推送到远程"
```

#### 分支清理脚本

```bash
#!/bin/bash
# scripts/cleanup-branches.sh

set -e

echo "🧹 开始清理已合并分支..."

# 切换到 main 分支
git checkout main
git pull origin main

# 删除本地已合并分支
echo "删除本地已合并分支..."
git branch --merged main | grep -v '^[ *]*main$' | xargs git branch -d

# 删除远程已合并分支
echo "删除远程已合并分支..."
git branch -r --merged main | grep -v '^[ *]*origin/main$' | sed 's/origin\///' | xargs -I {} git push origin --delete {}

# 清理远程分支引用
git remote prune origin

echo "✅ 分支清理完成"
```

### 分支管理命令

#### 查看分支状态

```bash
# 查看所有分支
git branch -a

# 查看已合并分支
git branch --merged main

# 查看未合并分支
git branch --no-merged main

# 查看分支详细信息
git for-each-ref --format='%(refname:short) %(committerdate) %(subject)' refs/heads
```

#### 分支同步

```bash
# 获取所有远程分支信息
git fetch --all

# 更新当前分支
git pull origin $(git branch --show-current)

# 同步远程分支
git remote prune origin
```

#### 分支重命名

```bash
# 重命名本地分支
git branch -m old-name new-name

# 删除远程旧分支
git push origin --delete old-name

# 推送新分支
git push origin new-name

# 设置上游分支
git push origin -u new-name
```

## 📊 分支策略最佳实践

### 分支保护规则

#### main 分支保护

- **必需状态检查**: 所有 CI 检查必须通过
- **必需审查**: 至少 1 名审查者批准
- **限制推送**: 禁止直接推送，必须通过 PR
- **自动删除**: 合并后自动删除源分支

#### develop 分支保护

- **必需状态检查**: 所有 CI 检查必须通过
- **必需审查**: 至少 1 名审查者批准
- **限制推送**: 禁止直接推送，必须通过 PR

### 分支命名最佳实践

1. **使用描述性名称**: 清楚说明分支的用途
2. **包含问题编号**: 关联相关的 Issue 或 PR
3. **使用连字符分隔**: 提高可读性
4. **避免过长的名称**: 控制在 50 字符以内

### 分支生命周期管理

1. **及时删除**: 合并后及时删除功能分支
2. **定期清理**: 定期清理已合并的远程分支
3. **保持同步**: 定期同步远程分支信息
4. **监控状态**: 监控分支状态和健康度

### 冲突预防策略

1. **频繁同步**: 定期从主分支拉取更新
2. **小步提交**: 避免大量代码一次性提交
3. **及时沟通**: 团队成员间及时沟通变更
4. **合理分工**: 避免多人同时修改同一文件

## 🚨 常见问题和解决方案

### 分支冲突

#### 预防措施

```bash
# 定期同步主分支
git checkout develop
git pull origin develop

# 在功能分支上变基
git checkout feature/my-feature
git rebase develop
```

#### 解决冲突

```bash
# 解决冲突后继续变基
git add .
git rebase --continue

# 或者中止变基
git rebase --abort
```

### 分支丢失

#### 恢复分支

```bash
# 查看提交历史
git reflog

# 恢复分支
git checkout -b feature/recovered-branch <commit-hash>
```

### 错误合并

#### 撤销合并

```bash
# 撤销最近的合并
git reset --hard HEAD~1

# 或者使用 revert
git revert -m 1 <merge-commit-hash>
```

## 📈 分支策略监控

### 关键指标

1. **分支数量**: 监控活跃分支数量
2. **合并时间**: 跟踪 PR 合并时间
3. **冲突频率**: 统计合并冲突次数
4. **分支生命周期**: 分析分支存活时间

### 定期审查

1. **每周**: 清理已合并分支
2. **每月**: 审查分支策略效果
3. **每季度**: 优化分支策略

---

通过遵循本文档中的分支策略，可以建立高效、稳定的代码开发流程，确保代码质量和团队协作效率。
