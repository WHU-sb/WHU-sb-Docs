# CI/CD 配置

## 概述

WHU.sb 使用 **GitHub Actions** 实现持续集成和持续部署 (CI/CD)，自动化测试、构建和部署流程。本文档详细说明 CI/CD 流水线配置、环境管理和最佳实践。

## 🔄 CI/CD 流水线

### 流水线架构

```
代码提交 → 自动测试 → 代码质量检查 → 安全扫描 → 构建 → 部署
```

### 触发条件

- **Push**: 推送到 main、develop 分支
- **Pull Request**: 创建或更新 PR
- **Release**: 创建版本标签
- **Manual**: 手动触发

## 🛠️ GitHub Actions 配置

### 主要工作流

#### CI 流水线

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
      with:
        submodules: recursive
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        cache-dependency-path: |
          frontend/package-lock.json
          cloudflare-worker/package-lock.json
    
    - name: Setup Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.24'
        cache: true
    
    - name: Install dependencies
      run: |
        # 安装前端依赖
        cd frontend && npm ci
        cd ../cloudflare-worker && npm ci
    
    - name: Run tests
      run: |
        # 运行 Go 测试
        cd backend && go test -v ./...
        
        # 运行前端测试
        cd ../frontend && npm test
        
        # 运行 Cloudflare Worker 测试
        cd ../cloudflare-worker && npm test
    
    - name: Run linting
      run: |
        # 检查 Go 代码
        cd backend && golangci-lint run
        
        # 检查前端代码
        cd ../frontend && npm run lint
        
        # 检查 Cloudflare Worker 代码
        cd ../cloudflare-worker && npm run lint
    
    - name: Build
      run: |
        # 构建前端
        cd frontend && npm run build
        
        # 构建 Cloudflare Worker
        cd ../cloudflare-worker && npm run build
        
        # 构建后端
        cd ../backend && go build ./cmd/main.go
```

#### 安全扫描

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run CodeQL Analysis
      uses: github/codeql-action/init@v3
      with:
        languages: javascript, go
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
    
    - name: Run dependency scan
      run: |
        # 扫描 Go 依赖
        cd backend && go list -json -deps ./... | nancy sleuth
        
        # 扫描 Node.js 依赖
        cd ../frontend && npm audit --audit-level moderate
        cd ../cloudflare-worker && npm audit --audit-level moderate
```

#### 部署流水线

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: [test, security]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Setup Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.24'
        cache: true
    
    - name: Install dependencies
      run: |
        cd frontend && npm ci
        cd ../cloudflare-worker && npm ci
    
    - name: Build
      run: |
        cd frontend && npm run build
        cd ../cloudflare-worker && npm run build
        cd ../backend && go build ./cmd/main.go
    
    - name: Deploy to production
      run: |
        echo "🚀 部署到生产环境..."
        # 这里添加实际的部署脚本
```

### 环境配置

#### 开发环境

```yaml
# .github/workflows/deploy-dev.yml
name: Deploy to Development

on:
  push:
    branches: [ develop ]

jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    environment: development
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to development
      run: |
        echo "🚀 部署到开发环境..."
        # 开发环境部署脚本
```

#### 生产环境

```yaml
# .github/workflows/deploy-prod.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to production
      run: |
        echo "🚀 部署到生产环境..."
        # 生产环境部署脚本
```

## 🔧 环境管理

### 环境变量

#### 开发环境

```yaml
# .github/environments/development.yml
name: development
url: https://dev.whu.sb

protection_rules:
  - required_reviewers:
      - username1
      - username2
    dismiss_stale_reviews: true
    require_code_owner_reviews: true

environment_variables:
  DATABASE_URL: ${{ secrets.DEV_DATABASE_URL }}
  API_KEY: ${{ secrets.DEV_API_KEY }}
  JWT_SECRET: ${{ secrets.DEV_JWT_SECRET }}
```

#### 生产环境

```yaml
# .github/environments/production.yml
name: production
url: https://whu.sb

protection_rules:
  - required_reviewers:
      - admin1
      - admin2
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
    wait_timer: 5

environment_variables:
  DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
  API_KEY: ${{ secrets.PROD_API_KEY }}
  JWT_SECRET: ${{ secrets.PROD_JWT_SECRET }}
```

### 密钥管理

#### GitHub Secrets

```bash
# 数据库连接
DEV_DATABASE_URL=postgresql://user:pass@dev-db:5432/whu_sb_dev
PROD_DATABASE_URL=postgresql://user:pass@prod-db:5432/whu_sb_prod

# API 密钥
DEV_API_KEY=dev_api_key_123
PROD_API_KEY=prod_api_key_456

# JWT 密钥
DEV_JWT_SECRET=dev_jwt_secret_key
PROD_JWT_SECRET=prod_jwt_secret_key

# 部署密钥
DEPLOY_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
```

## 📊 质量检查

### 代码质量检查

#### ESLint 配置

```yaml
# .github/workflows/lint.yml
name: Lint

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        cd frontend && npm ci
        cd ../cloudflare-worker && npm ci
    
    - name: Run ESLint
      run: |
        cd frontend && npm run lint
        cd ../cloudflare-worker && npm run lint
    
    - name: Run Prettier check
      run: |
        cd frontend && npm run format:check
        cd ../cloudflare-worker && npm run format:check
```

#### Go 代码检查

```yaml
# .github/workflows/go-lint.yml
name: Go Lint

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  golint:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.24'
        cache: true
    
    - name: Install golangci-lint
      run: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
    
    - name: Run golangci-lint
      run: |
        cd backend
        golangci-lint run
```

### 测试覆盖率

#### 测试配置

```yaml
# .github/workflows/test-coverage.yml
name: Test Coverage

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test-coverage:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Setup Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.24'
        cache: true
    
    - name: Install dependencies
      run: |
        cd frontend && npm ci
        cd ../cloudflare-worker && npm ci
    
    - name: Run tests with coverage
      run: |
        # Go 测试覆盖率
        cd backend && go test -coverprofile=coverage.out ./...
        go tool cover -html=coverage.out -o coverage.html
        
        # 前端测试覆盖率
        cd ../frontend && npm run test:coverage
        
        # Cloudflare Worker 测试覆盖率
        cd ../cloudflare-worker && npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./backend/coverage.out
        flags: backend
        name: backend-coverage
```

## 🚀 部署策略

### 蓝绿部署

```yaml
# .github/workflows/blue-green-deploy.yml
name: Blue-Green Deployment

on:
  push:
    branches: [ main ]

jobs:
  blue-green-deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to blue environment
      run: |
        echo "🔵 部署到蓝色环境..."
        # 部署到蓝色环境
    
    - name: Health check blue environment
      run: |
        echo "🔍 检查蓝色环境健康状态..."
        # 健康检查
    
    - name: Switch traffic to blue
      run: |
        echo "🔄 切换流量到蓝色环境..."
        # 切换流量
    
    - name: Deploy to green environment
      run: |
        echo "🟢 部署到绿色环境..."
        # 部署到绿色环境
    
    - name: Health check green environment
      run: |
        echo "🔍 检查绿色环境健康状态..."
        # 健康检查
    
    - name: Switch traffic to green
      run: |
        echo "🔄 切换流量到绿色环境..."
        # 切换流量
```

### 滚动部署

```yaml
# .github/workflows/rolling-deploy.yml
name: Rolling Deployment

on:
  push:
    branches: [ main ]

jobs:
  rolling-deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Rolling deployment
      run: |
        echo "🔄 开始滚动部署..."
        # 滚动部署脚本
```

## 📈 监控和告警

### 部署监控

```yaml
# .github/workflows/monitor.yml
name: Deployment Monitor

on:
  workflow_run:
    workflows: ["Deploy"]
    types: [completed]

jobs:
  monitor:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    
    steps:
    - name: Monitor deployment
      run: |
        echo "📊 监控部署状态..."
        # 监控脚本
    
    - name: Send notification
      run: |
        echo "📧 发送部署通知..."
        # 通知脚本
```

### 性能监控

```yaml
# .github/workflows/performance.yml
name: Performance Test

on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 3 * * *'  # 每天凌晨 3 点

jobs:
  performance:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run performance tests
      run: |
        echo "⚡ 运行性能测试..."
        # 性能测试脚本
    
    - name: Generate performance report
      run: |
        echo "📊 生成性能报告..."
        # 生成报告
```

## 🚨 故障处理

### 回滚策略

```yaml
# .github/workflows/rollback.yml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to'
        required: true
        default: '1.1.0'

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Rollback to version
      run: |
        echo "🔄 回滚到版本 ${{ github.event.inputs.version }}..."
        # 回滚脚本
```

### 健康检查

```yaml
# .github/workflows/health-check.yml
name: Health Check

on:
  schedule:
    - cron: '*/5 * * * *'  # 每 5 分钟

jobs:
  health-check:
    runs-on: ubuntu-latest
    
    steps:
    - name: Check application health
      run: |
        echo "🏥 检查应用健康状态..."
        # 健康检查脚本
    
    - name: Alert on failure
      if: failure()
      run: |
        echo "🚨 应用健康检查失败，发送告警..."
        # 告警脚本
```

## 📊 CI/CD 最佳实践

### 性能优化

1. **缓存依赖**: 使用 GitHub Actions 缓存
2. **并行执行**: 并行运行独立的任务
3. **条件执行**: 只在必要时运行任务
4. **资源优化**: 合理使用运行器资源

### 安全性

1. **最小权限**: 使用最小必要的权限
2. **密钥管理**: 安全存储和管理密钥
3. **代码扫描**: 定期进行安全扫描
4. **依赖更新**: 及时更新依赖

### 可靠性

1. **重试机制**: 为失败的任务添加重试
2. **超时设置**: 设置合理的超时时间
3. **监控告警**: 监控流水线状态
4. **文档维护**: 保持文档更新

---

通过遵循本文档中的 CI/CD 配置，可以建立高效、可靠的自动化部署流程，确保代码质量和部署稳定性。
