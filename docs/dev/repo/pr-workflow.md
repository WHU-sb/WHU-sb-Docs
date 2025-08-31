# PR 流程

## 概述

Pull Request (PR) 是 WHU.sb 项目代码审查和协作的核心流程。本文档详细说明 PR 的创建、审查、合并流程以及最佳实践。

## 🔄 PR 工作流程

### 基本流程

1. **创建功能分支** → 2. **开发功能** → 3. **创建 PR** → 4. **代码审查** → 5. **修改完善** → 6. **合并代码**

### 详细步骤

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

# 推送到远程仓库
git push origin feature/user-profile
```

#### 3. 创建 Pull Request

在 GitHub 上创建 PR：

1. 访问项目仓库
2. 点击 "Compare & pull request"
3. 填写 PR 信息
4. 设置审查者
5. 提交 PR

## 📝 PR 模板

### 功能开发 PR 模板

```markdown
## 📋 描述

简要描述此 PR 的功能和目的。

## 🎯 相关 Issue

Closes #123
Related to #456

## 🔧 变更类型

- [ ] 新功能 (feature)
- [ ] 错误修复 (bug fix)
- [ ] 文档更新 (documentation)
- [ ] 代码重构 (refactoring)
- [ ] 性能优化 (performance)
- [ ] 测试相关 (test)
- [ ] 构建配置 (build)

## 📝 变更内容

### 新增功能
- [ ] 功能 A
- [ ] 功能 B

### 修复问题
- [ ] 问题 A
- [ ] 问题 B

### 技术改进
- [ ] 改进 A
- [ ] 改进 B

## 🧪 测试

- [ ] 单元测试已添加/更新
- [ ] 集成测试已添加/更新
- [ ] 手动测试已完成
- [ ] 所有测试通过

## 📸 截图 (如适用)

<!-- 添加相关截图 -->

## ✅ 检查清单

- [ ] 代码遵循项目规范
- [ ] 提交信息符合 Conventional Commits 规范
- [ ] 文档已更新
- [ ] 没有引入新的警告
- [ ] 代码已自测

## 🔍 审查要点

请重点审查以下方面：
- [ ] 代码质量和可读性
- [ ] 性能和安全性
- [ ] 错误处理
- [ ] 测试覆盖
- [ ] 文档完整性
```

### 错误修复 PR 模板

```markdown
## 🐛 问题描述

详细描述修复的问题。

## 🔧 修复方案

说明如何修复此问题。

## 🧪 测试验证

- [ ] 问题已复现
- [ ] 修复已验证
- [ ] 回归测试通过

## 📋 变更清单

- [ ] 修复代码
- [ ] 添加测试
- [ ] 更新文档

## ✅ 检查清单

- [ ] 修复方案合理
- [ ] 没有引入新问题
- [ ] 测试覆盖充分
```

## 🔍 代码审查流程

### 审查要点

#### 代码质量
- **可读性**: 代码是否清晰易懂
- **可维护性**: 代码结构是否合理
- **性能**: 是否有性能问题
- **安全性**: 是否有安全漏洞

#### 功能完整性
- **需求实现**: 是否完全实现需求
- **边界情况**: 是否处理边界情况
- **错误处理**: 错误处理是否完善
- **用户体验**: 用户体验是否良好

#### 测试覆盖
- **单元测试**: 是否有足够的单元测试
- **集成测试**: 是否需要集成测试
- **测试质量**: 测试是否有效
- **覆盖率**: 测试覆盖率是否足够

#### 文档更新
- **API 文档**: API 文档是否更新
- **代码注释**: 代码注释是否清晰
- **README**: README 是否更新
- **变更日志**: 变更日志是否更新

### 审查流程

#### 1. 自动检查

PR 创建后，自动触发以下检查：

- **CI/CD 流水线**: 运行测试和构建
- **代码质量检查**: ESLint、SonarQube 等
- **安全扫描**: 依赖漏洞扫描
- **代码覆盖率**: 测试覆盖率检查

#### 2. 人工审查

- **同行审查**: 至少 1 名团队成员审查
- **技术审查**: 技术负责人审查（如需要）
- **产品审查**: 产品经理审查（如需要）

#### 3. 审查反馈

审查者提供反馈：

- **批准**: 代码质量良好，可以合并
- **需要修改**: 需要修改后重新审查
- **拒绝**: 代码质量不达标，需要重新设计

#### 4. 修改完善

根据审查反馈修改代码：

```bash
# 修改代码
git add .
git commit -m "fix: address review comments

- Fix code style issues
- Add missing error handling
- Update documentation

Addresses #123"
```

#### 5. 重新审查

修改完成后，重新请求审查。

## 🔀 合并策略

### 合并选项

#### 1. Create a merge commit

```bash
git merge --no-ff feature/user-profile
```

**适用场景**:
- 保留完整的分支历史
- 需要明确的分支边界
- 团队偏好合并提交

#### 2. Squash and merge

```bash
git merge --squash feature/user-profile
git commit -m "feat: add user profile management

- Add user profile model and repository
- Implement profile update API
- Add profile validation middleware
- Update API documentation

Closes #123"
```

**适用场景**:
- 保持主分支历史简洁
- 功能分支有多个提交
- 团队偏好线性历史

#### 3. Rebase and merge

```bash
git rebase develop
git checkout develop
git merge feature/user-profile
```

**适用场景**:
- 保持线性历史
- 功能分支提交较少
- 团队偏好 rebase

### 合并规则

#### main 分支合并规则

- **必需状态检查**: 所有 CI 检查必须通过
- **必需审查**: 至少 1 名审查者批准
- **合并策略**: Squash and merge
- **自动删除**: 合并后自动删除源分支

#### develop 分支合并规则

- **必需状态检查**: 所有 CI 检查必须通过
- **必需审查**: 至少 1 名审查者批准
- **合并策略**: Create a merge commit
- **自动删除**: 合并后自动删除源分支

## 🚨 常见问题和解决方案

### PR 冲突

#### 问题描述
PR 与目标分支存在冲突

#### 解决方案

```bash
# 方法 1: 在功能分支上变基
git checkout feature/user-profile
git rebase develop
# 解决冲突
git push --force-with-lease origin feature/user-profile

# 方法 2: 在 develop 上合并
git checkout develop
git pull origin develop
git merge feature/user-profile
# 解决冲突
git push origin develop
```

### 审查意见处理

#### 问题描述
审查者提出了修改意见

#### 解决方案

```bash
# 修改代码
git add .
git commit -m "fix: address review comments

- Fix code style issues
- Add missing error handling
- Update documentation

Addresses #123"

# 推送到远程
git push origin feature/user-profile
```

### CI 检查失败

#### 问题描述
PR 的 CI 检查失败

#### 解决方案

1. **查看失败原因**: 检查 CI 日志
2. **本地复现**: 在本地运行失败的测试
3. **修复问题**: 修复代码问题
4. **重新提交**: 提交修复并推送

```bash
# 修复问题
git add .
git commit -m "fix: resolve CI issues

- Fix failing tests
- Update linting rules
- Fix build configuration"

# 推送修复
git push origin feature/user-profile
```

## 📊 PR 质量指标

### 关键指标

1. **PR 大小**: 建议不超过 400 行变更
2. **审查时间**: 平均审查时间
3. **修改次数**: 平均修改次数
4. **合并时间**: 从创建到合并的时间

### 质量检查清单

#### PR 创建前

- [ ] 代码已完成并测试
- [ ] 提交信息符合规范
- [ ] 没有调试代码
- [ ] 文档已更新

#### PR 审查中

- [ ] 代码质量良好
- [ ] 功能完整实现
- [ ] 测试覆盖充分
- [ ] 文档更新完整

#### PR 合并前

- [ ] 所有检查通过
- [ ] 审查已批准
- [ ] 冲突已解决
- [ ] 变更已记录

## 🛠️ PR 工具和配置

### GitHub 配置

#### 分支保护规则

```yaml
# .github/branch-protection.yml
branches:
  - name: main
    protection:
      required_status_checks:
        strict: true
        contexts:
          - "ci/tests"
          - "ci/lint"
          - "ci/security"
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
      enforce_admins: true
      restrictions: null
```

#### PR 模板

```yaml
# .github/pull_request_template.md
## 描述

## 相关 Issue

## 变更类型

## 测试

## 检查清单
```

### 自动化工具

#### PR 标签

- **bug**: 错误修复
- **enhancement**: 功能增强
- **documentation**: 文档更新
- **good first issue**: 适合新手
- **help wanted**: 需要帮助

#### PR 检查

- **代码覆盖率**: 检查测试覆盖率
- **依赖扫描**: 检查依赖漏洞
- **代码质量**: 检查代码质量
- **安全检查**: 检查安全漏洞

## 📈 PR 流程优化

### 持续改进

1. **定期回顾**: 定期回顾 PR 流程效果
2. **收集反馈**: 收集团队反馈
3. **优化流程**: 根据反馈优化流程
4. **工具升级**: 升级相关工具

### 最佳实践

1. **小步提交**: 保持 PR 规模适中
2. **及时审查**: 及时进行代码审查
3. **清晰描述**: 提供清晰的 PR 描述
4. **充分测试**: 确保代码充分测试

---

通过遵循本文档中的 PR 流程，可以建立高效、高质量的代码审查机制，确保代码质量和团队协作效率。
