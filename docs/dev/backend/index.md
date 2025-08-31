# 后端开发

欢迎来到 WHU.sb 后端开发文档！

## 技术栈

WHU.sb 后端采用现代化的 Go 技术栈，注重性能、可扩展性和可维护性。

### 核心技术

- **Go 1.24.6+** - 高性能编程语言
- **Gin** - 高性能 HTTP Web 框架
- **GORM** - Go 语言的 ORM 库
- **JWT** - 身份认证和授权
- **Redis** - 缓存和会话存储
- **MySQL/PostgreSQL/SQLite** - 关系型数据库
- **Meilisearch/Elasticsearch** - 全文搜索引擎
- **Qdrant/Cloudflare Vectorize** - 向量数据库
- **Docker** - 容器化部署

### 开发工具

- **Zap** - 结构化日志记录
- **Prometheus** - 监控和指标收集
- **Testify** - 测试框架
- **Validator** - 数据验证
- **Protocol Buffers** - 数据序列化

## 项目结构

```
backend/
├── cmd/                    # 主程序和工具入口
│   ├── main.go            # 主API服务
│   ├── worker.go          # 评价同步Worker
│   └── cli/               # CLI工具
├── internal/              # 内部包
│   ├── handlers/          # HTTP处理器
│   ├── services/          # 业务逻辑层
│   ├── models/            # 数据模型
│   ├── database/          # 数据库适配器
│   ├── middleware/        # 中间件
│   ├── cache/             # 缓存服务
│   ├── config/            # 配置管理
│   ├── errors/            # 错误处理
│   ├── response/          # 响应处理
│   ├── monitoring/        # 监控和指标
│   ├── testutils/         # 测试工具
│   └── utils/             # 工具函数
├── proto/                 # Protocol Buffers定义
├── scripts/               # 数据库脚本
├── config/                # 配置文件
├── generated/             # 生成的代码
├── Dockerfile             # Docker配置
└── go.mod                 # Go模块定义
```

## 快速开始

### 环境要求

- **Go**: 1.24.6+
- **MySQL**: 8.0+ 或 **PostgreSQL**: 13+ 或 **SQLite**: 3
- **Redis**: 6.0+
- **Docker**: 20.0+ (可选)

### 安装依赖

```bash
cd backend
go mod download
```

### 配置环境

1. 复制配置文件模板：
```bash
cp config/config.example.toml config/config.toml
```

2. 编辑配置文件，设置数据库连接等参数。

### 启动开发服务器

```bash
# 启动主API服务
go run cmd/main.go serve

# 启动评价同步Worker
go run cmd/worker.go
```

### 构建生产版本

```bash
# 构建主程序
go build -o course-backend ./cmd/main.go

# 构建Worker
go build -o review-sync-worker ./cmd/worker.go
```

### 运行测试

```bash
# 运行所有测试
go test ./...

# 运行测试并显示覆盖率
go test -cover ./...

# 运行特定包的测试
go test ./internal/handlers
```

## 开发指南

### API设计

- [RESTful API 设计原则](/dev/backend/api-design)
- [路由配置](/dev/backend/routing)
- [请求验证](/dev/backend/validation)
- [错误处理](/dev/backend/error-handling)
- [响应格式](/dev/backend/response-format)

### 数据库设计

- [数据模型](/dev/backend/database)
- [数据库迁移](/dev/backend/database#数据库迁移)
- [ORM使用](/dev/backend/database#gorm-使用)
- [查询优化](/dev/backend/database#查询优化)

### 权限系统

- [RBAC权限控制](/dev/backend/rbac)
- [JWT认证](/dev/backend/rbac#jwt认证)
- [中间件](/dev/backend/rbac#认证中间件)
- [权限验证](/dev/backend/rbac#权限检查工具)

### 缓存策略

- [Redis缓存](/dev/backend/cache-strategy)
- [缓存策略](/dev/backend/cache-strategy#缓存策略)
- [缓存失效](/dev/backend/cache-strategy#缓存失效策略)

### 搜索引擎

- [全文搜索](/dev/backend/fulltext-search)
- [Meilisearch集成](/dev/backend/meilisearch)
- [搜索优化](/dev/backend/search-optimization)

### 向量数据库

- [向量搜索](/dev/backend/vector-search)
- [Qdrant集成](/dev/backend/qdrant)
- [Embedding处理](/dev/backend/embedding)

## 测试指南

### 单元测试

```bash
# 运行所有测试
go test ./...

# 运行测试并监听文件变化
go test -watch ./...

# 生成测试覆盖率报告
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

### 集成测试

```bash
# 运行集成测试
go test -tags=integration ./...

# 运行特定测试
go test -run TestUserAPI ./internal/handlers
```

### 测试示例

```go
package handlers_test

import (
    "testing"
    "net/http"
    "net/http/httptest"
    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
)

func TestUserHandler(t *testing.T) {
    gin.SetMode(gin.TestMode)
    router := gin.New()
    
    // 设置路由
    router.GET("/api/users", handlers.GetUsers)
    
    // 创建测试请求
    w := httptest.NewRecorder()
    req, _ := http.NewRequest("GET", "/api/users", nil)
    router.ServeHTTP(w, req)
    
    // 断言结果
    assert.Equal(t, http.StatusOK, w.Code)
}
```

## 监控和日志

### 日志记录

使用 Zap 进行结构化日志记录：

```go
import "go.uber.org/zap"

logger := zap.NewProduction()
logger.Info("User logged in", 
    zap.String("user_id", userID),
    zap.String("ip", clientIP),
)
```

### 监控指标

使用 Prometheus 收集应用指标：

```go
import "github.com/prometheus/client_golang/prometheus"

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )
)
```

## 部署配置

### Docker部署

```bash
# 构建镜像
docker build -t whu-sb-backend .

# 运行容器
docker run -p 8080:8080 whu-sb-backend
```

### 环境变量

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=whu_sb
DB_USER=root
DB_PASSWORD=password

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRE_HOURS=24
```

### 生产环境配置

- [Docker配置](/dev/backend/deployment#docker部署)
- [环境变量](/dev/backend/deployment#环境配置)
- [性能优化](/dev/backend/deployment#性能优化)
- [安全配置](/dev/backend/deployment#安全配置)

## 代码规范

### Go代码规范

遵循 Go 官方代码规范：

```bash
# 格式化代码
go fmt ./...

# 运行静态检查
go vet ./...

# 运行golint
golint ./...
```

### 项目规范

- 使用 `internal/` 包组织内部代码
- 遵循依赖注入原则
- 使用接口进行解耦
- 编写完整的测试用例

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加用户认证功能
fix: 修复数据库连接池泄漏
docs: 更新API文档
style: 格式化代码
refactor: 重构用户服务
test: 添加用户API测试
chore: 更新依赖版本
```

## 性能优化

### 数据库优化

- 使用连接池
- 优化查询语句
- 添加适当的索引
- 使用读写分离

### 缓存优化

- 合理使用Redis缓存
- 实现缓存预热
- 设置合适的TTL
- 使用缓存穿透保护

### 并发处理

- 使用goroutine处理并发
- 实现限流机制
- 使用连接池
- 优化内存使用

## 故障排查

### 常见问题

- [数据库连接问题](/dev/backend/troubleshooting/database)
- [Redis连接问题](/dev/backend/troubleshooting/redis)
- [性能问题](/dev/backend/troubleshooting/performance)
- [内存泄漏](/dev/backend/troubleshooting/memory)

### 调试工具

- [pprof性能分析](/dev/backend/debugging/pprof)
- [日志分析](/dev/backend/debugging/logs)
- [监控面板](/dev/backend/debugging/monitoring)

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 编写代码和测试
4. 提交 Pull Request

### 开发流程

- 遵循 Git Flow 工作流
- 编写完整的测试用例
- 更新相关文档
- 进行代码审查

---

**提示**: 后端开发文档会随着项目发展持续更新，建议定期查看最新版本。
