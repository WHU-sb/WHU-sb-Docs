# 提交规范

## 概述

WHU.sb 采用 **Conventional Commits** 规范，确保提交信息的可读性和自动化处理。本文档详细说明提交信息格式、类型定义、工具配置和最佳实践。

## 📝 提交信息格式

### 基本格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 格式说明

- **type**: 提交类型，必填
- **scope**: 影响范围，可选
- **description**: 简短描述，必填
- **body**: 详细描述，可选
- **footer**: 脚注信息，可选

## 🏷️ 提交类型

### 主要类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add user authentication` |
| `fix` | 错误修复 | `fix: resolve login validation issue` |
| `docs` | 文档更新 | `docs: update API documentation` |
| `style` | 代码格式调整 | `style: format code with prettier` |
| `refactor` | 代码重构 | `refactor: extract validation logic` |
| `test` | 测试相关 | `test: add unit tests for user service` |
| `chore` | 构建过程或辅助工具变动 | `chore: update dependencies` |

### 特殊类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `perf` | 性能优化 | `perf: optimize database queries` |
| `ci` | CI/CD 相关 | `ci: add GitHub Actions workflow` |
| `build` | 构建系统相关 | `build: update webpack configuration` |
| `revert` | 撤销提交 | `revert: revert "feat: add new feature"` |

## 📋 提交示例

### 功能开发

```bash
git commit -m "feat(auth): add OAuth2 authentication support

- Implement OAuth2 provider integration
- Add social login buttons
- Update user model for OAuth data
- Add OAuth configuration

Closes #123"
```

### 错误修复

```bash
git commit -m "fix(api): resolve course search pagination issue

- Fix incorrect page calculation in course search
- Update pagination metadata
- Add pagination tests

Fixes #456"
```

### 文档更新

```bash
git commit -m "docs(api): update authentication API documentation

- Add OAuth2 endpoint documentation
- Update error response examples
- Fix parameter descriptions

Closes #789"
```

### 代码重构

```bash
git commit -m "refactor(service): extract course validation logic

- Move validation logic to separate service
- Improve error handling
- Add validation tests

BREAKING CHANGE: CourseService constructor signature changed"
```

### 性能优化

```bash
git commit -m "perf(database): optimize course queries

- Add database indexes for course search
- Implement query result caching
- Reduce N+1 query problems

Improves performance by 40%"
```

### 构建配置

```bash
git commit -m "chore(deps): update dependencies

- Update React to v18.2.0
- Update TypeScript to v5.0.0
- Update ESLint to v8.50.0

Resolves security vulnerabilities"
```

## 🔧 工具配置

### Git Hooks 配置

#### 提交信息验证

```bash
#!/bin/bash
# .git/hooks/commit-msg

set -e

# 读取提交信息文件
commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# 提交信息格式正则表达式
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,50}'

# 检查提交信息格式
if ! echo "$commit_msg" | grep -qE "$commit_regex"; then
    echo "❌ 提交信息格式错误"
    echo ""
    echo "期望格式: <type>[optional scope]: <description>"
    echo "类型: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
    echo ""
    echo "示例:"
    echo "  feat(auth): add OAuth2 authentication"
    echo "  fix(api): resolve pagination issue"
    echo "  docs(readme): update installation guide"
    echo ""
    echo "当前提交信息:"
    echo "$commit_msg"
    exit 1
fi

# 检查提交信息长度
if [ ${#commit_msg} -gt 72 ]; then
    echo "❌ 提交信息过长，请控制在 72 字符以内"
    echo "当前长度: ${#commit_msg} 字符"
    exit 1
fi

echo "✅ 提交信息格式正确"
```

#### 提交前检查

```bash
#!/bin/bash
# .git/hooks/pre-commit

set -e

echo "🔍 运行提交前检查..."

# 检查是否有未暂存的更改
if ! git diff-index --quiet HEAD --; then
    echo "❌ 有未暂存的更改，请先暂存所有更改"
    exit 1
fi

# 运行代码格式化检查
echo "📝 检查代码格式..."

# Go 代码格式化
if [ -f "backend/go.mod" ]; then
    echo "  检查 Go 代码格式..."
    cd backend
    if ! go fmt ./...; then
        echo "❌ Go 代码格式化失败"
        exit 1
    fi
    cd ..
fi

# TypeScript/JavaScript 代码格式化
if [ -f "frontend/package.json" ]; then
    echo "  检查前端代码格式..."
    cd frontend
    if ! npm run lint:check; then
        echo "❌ 前端代码格式检查失败"
        exit 1
    fi
    cd ..
fi

echo "✅ 提交前检查通过"
```

### Commitizen 配置

#### package.json 配置

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  },
  "devDependencies": {
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0"
  }
}
```

#### 使用 Commitizen

```bash
# 安装依赖
npm install --save-dev commitizen cz-conventional-changelog

# 使用交互式提交
npm run commit
```

### 自定义提交模板

#### 创建提交模板

```bash
# .gitmessage 文件
# 提交信息模板

# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

# 类型说明:
#   feat     : 新功能
#   fix      : 错误修复
#   docs     : 文档更新
#   style    : 代码格式调整
#   refactor : 代码重构
#   test     : 测试相关
#   chore    : 构建过程或辅助工具变动
#   perf     : 性能优化
#   ci       : CI/CD 相关
#   build    : 构建系统相关
#   revert   : 撤销提交

# 示例:
# feat(auth): add OAuth2 authentication
#
# - Implement OAuth2 provider integration
# - Add social login buttons
# - Update user model for OAuth data
#
# Closes #123
```

#### 配置 Git 使用模板

```bash
# 设置提交模板
git config --global commit.template .gitmessage

# 或者设置编辑器
git config --global core.editor "code --wait"
```

## 📊 提交规范最佳实践

### 提交信息编写原则

1. **简洁明了**: 描述要简洁，不超过 50 字符
2. **使用祈使句**: 使用现在时态，如 "add" 而不是 "added"
3. **首字母小写**: 描述部分首字母小写
4. **不加句号**: 描述末尾不加句号

### 范围定义

#### 常见范围

- **auth**: 认证相关
- **api**: API 相关
- **ui**: 用户界面
- **db**: 数据库
- **test**: 测试
- **docs**: 文档
- **ci**: 持续集成
- **build**: 构建

#### 范围命名规范

1. **使用小写字母**: 避免大写字母
2. **使用连字符**: 多个单词用连字符分隔
3. **保持简洁**: 范围名称要简洁明了
4. **保持一致性**: 团队内保持命名一致

### 提交粒度控制

#### 好的提交粒度

```bash
# 功能完整的最小单元
feat(auth): add user login functionality

# 单个修复
fix(api): resolve pagination bug

# 相关文档更新
docs(api): update authentication endpoints
```

#### 避免的提交粒度

```bash
# 过于宽泛
feat: add new features

# 过于详细
feat(auth): add user login with email validation and password hashing and session management

# 混合多个功能
feat: add user login and course search and admin panel
```

### 提交信息模板

#### 功能开发模板

```bash
feat(<scope>): <description>

- <change 1>
- <change 2>
- <change 3>

Closes #<issue-number>
```

#### 错误修复模板

```bash
fix(<scope>): <description>

- <fix 1>
- <fix 2>
- <fix 3>

Fixes #<issue-number>
```

#### 破坏性变更模板

```bash
feat(<scope>): <description>

- <change 1>
- <change 2>

BREAKING CHANGE: <description of breaking change>
```

## 🔍 提交信息验证

### 自动化验证

#### ESLint 规则

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['commitlint'],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci', 'build', 'revert']
    ],
    'type-case': [2, 'always', 'lower'],
    'type-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 50]
  }
};
```

#### Husky 配置

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### 手动验证

#### 验证脚本

```bash
#!/bin/bash
# scripts/validate-commit.sh

set -e

COMMIT_MSG=$1

if [ -z "$COMMIT_MSG" ]; then
    echo "❌ 请提供提交信息"
    exit 1
fi

# 检查格式
if ! echo "$COMMIT_MSG" | grep -qE '^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,50}'; then
    echo "❌ 提交信息格式错误"
    exit 1
fi

# 检查长度
if [ ${#COMMIT_MSG} -gt 72 ]; then
    echo "❌ 提交信息过长"
    exit 1
fi

echo "✅ 提交信息格式正确"
```

## 📈 提交历史管理

### 提交历史清理

#### 交互式变基

```bash
# 交互式变基最近 5 个提交
git rebase -i HEAD~5

# 常用操作
# pick: 保留提交
# reword: 修改提交信息
# edit: 修改提交内容
# squash: 合并到前一个提交
# fixup: 合并到前一个提交，丢弃提交信息
# drop: 删除提交
```

#### 提交信息修改

```bash
# 修改最近一次提交信息
git commit --amend -m "New commit message"

# 修改最近一次提交内容
git add .
git commit --amend --no-edit

# 修改历史提交信息
git rebase -i HEAD~3
# 在编辑器中将要修改的提交前的 'pick' 改为 'reword'
```

### 提交历史查看

#### 高级日志查看

```bash
# 图形化显示分支历史
git log --graph --oneline --all

# 显示文件变更统计
git log --stat

# 显示具体变更内容
git log -p

# 按作者筛选
git log --author="username"

# 按时间范围筛选
git log --since="2024-01-01" --until="2024-01-31"

# 按文件筛选
git log -- path/to/file
```

## 🚨 常见问题和解决方案

### 提交信息格式错误

#### 问题描述
提交信息不符合 Conventional Commits 规范

#### 解决方案

```bash
# 修改最近一次提交
git commit --amend -m "feat(auth): add user authentication"

# 修改历史提交
git rebase -i HEAD~3
# 在编辑器中修改提交信息
```

### 提交信息过长

#### 问题描述
提交信息超过 72 字符限制

#### 解决方案

```bash
# 缩短描述
git commit --amend -m "feat(auth): add OAuth2 support"

# 使用详细描述
git commit --amend -m "feat(auth): add OAuth2 support

- Implement OAuth2 provider integration
- Add social login buttons
- Update user model for OAuth data"
```

### 提交类型错误

#### 问题描述
使用了错误的提交类型

#### 解决方案

```bash
# 修改提交类型
git commit --amend -m "fix(auth): resolve login validation issue"

# 常见类型映射
# feat -> 新功能
# fix -> 错误修复
# docs -> 文档更新
# style -> 代码格式
# refactor -> 代码重构
# test -> 测试相关
# chore -> 构建工具
```

## 📊 提交规范监控

### 关键指标

1. **提交信息合规率**: 符合规范的提交比例
2. **提交类型分布**: 各种类型提交的分布
3. **提交频率**: 团队提交频率
4. **提交质量**: 提交信息的质量评分

### 定期审查

1. **每周**: 审查提交信息质量
2. **每月**: 分析提交类型分布
3. **每季度**: 优化提交规范

---

通过遵循本文档中的提交规范，可以建立清晰、可读的提交历史，便于代码审查、版本管理和自动化处理。
