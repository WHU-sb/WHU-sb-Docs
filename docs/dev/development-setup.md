# 开发环境设置指南

本文档提供详细的开发环境设置步骤，包括环境配置、依赖安装、常见问题排查等。

## 🛠️ 环境准备

### 必需软件

#### 1. Go 环境设置

**下载安装**：
```bash
# Windows (使用 Chocolatey)
choco install go

# macOS (使用 Homebrew)
brew install go

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install golang-go

# 验证安装
go version
# 输出: go version go1.24.6 windows/amd64
```

**环境变量配置**：
```bash
# Windows (PowerShell)
$env:GOPATH = "$HOME/go"
$env:GOROOT = "C:\Go"
$env:PATH += ";$env:GOROOT\bin;$env:GOPATH\bin"

# macOS/Linux
export GOPATH=$HOME/go
export GOROOT=/usr/local/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
```

**Go 模块配置**：
```bash
# 启用 Go 模块
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct

# 验证配置
go env GOPATH
go env GOROOT
```

#### 2. Node.js 环境设置

**下载安装**：
```bash
# 推荐使用 nvm 管理 Node.js 版本
# Windows
# 下载 nvm-windows: https://github.com/coreybutler/nvm-windows/releases

# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js 18
nvm install 18
nvm use 18

# 验证安装
node --version
npm --version
```

**npm 配置**：
```bash
# 设置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 安装常用全局包
npm install -g @vue/cli
npm install -g pnpm
```

#### 3. 数据库环境

**MySQL 安装**：
```bash
# Windows
# 下载 MySQL Installer: https://dev.mysql.com/downloads/installer/

# macOS
brew install mysql
brew services start mysql

# Linux (Ubuntu)
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**MySQL 初始配置**：
```sql
-- 创建数据库和用户
CREATE DATABASE whu_sb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'whu_sb_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON whu_sb.* TO 'whu_sb_user'@'localhost';
FLUSH PRIVILEGES;

-- 验证连接
mysql -u whu_sb_user -p whu_sb
```

**Redis 安装**：
```bash
# Windows
# 下载 Redis for Windows: https://github.com/microsoftarchive/redis/releases

# macOS
brew install redis
brew services start redis

# Linux (Ubuntu)
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**Redis 验证**：
```bash
redis-cli ping
# 输出: PONG
```

## 📦 项目设置

### 1. 克隆项目

```bash
# 克隆主仓库
git clone https://github.com/WHU-sb/WHU-sb.git
cd whu.sb

# 初始化子模块
git submodule update --init --recursive
```

### 2. 后端环境设置

```bash
cd backend

# 安装 Go 依赖
go mod download
go mod tidy

# 复制配置文件
cp config/config.example.toml config/config.toml
```

**配置文件示例** (`config/config.toml`)：
```toml
[server]
port = 8080
mode = "debug"
read_timeout = 30
write_timeout = 30

[database]
driver = "mysql"
host = "localhost"
port = 3306
username = "whu_sb_user"
password = "your_password"
database = "whu_sb"
charset = "utf8mb4"
max_open_conns = 100
max_idle_conns = 10
conn_max_lifetime = 3600

[redis]
host = "localhost"
port = 6379
password = ""
database = 0
pool_size = 10

[jwt]
secret = "your_jwt_secret_key_here"
expire_hours = 24

[search]
engine = "meilisearch"
url = "http://localhost:7700"
key = "your_meilisearch_key"

[vector]
engine = "qdrant"
url = "http://localhost:6333"
```

**数据库迁移**：
```bash
# 运行数据库迁移
go run cmd/main.go migrate

# 导入初始数据
go run scripts/import/main.go
```

### 3. 前端环境设置

```bash
cd frontend

# 安装依赖
npm install

# 复制环境配置
cp .env.example .env.local
```

**环境配置示例** (`.env.local`)：
```html
# API 配置
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=WHU.sb

# 开发配置
VITE_DEV_MODE=true
VITE_ENABLE_MOCK=false

# 第三方服务
VITE_GA_TRACKING_ID=your_ga_id
VITE_SENTRY_DSN=your_sentry_dsn
```

### 4. Cloudflare Worker 设置

```bash
cd cloudflare-worker

# 安装依赖
npm install

# 配置 Wrangler
npx wrangler login
```

**Wrangler 配置** (`wrangler.toml`)：
```toml
name = "whu-sb-worker"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[env.development]
name = "whu-sb-worker-dev"

[env.production]
name = "whu-sb-worker-prod"

[[env.development.d1_databases]]
binding = "DB"
database_name = "whu-sb-dev"
database_id = "your_d1_database_id"

[[env.production.d1_databases]]
binding = "DB"
database_name = "whu-sb-prod"
database_id = "your_d1_database_id"
```

## 🚀 启动开发环境

### 1. 启动后端服务

```bash
cd backend

# 启动主 API 服务
go run cmd/main.go serve

# 新终端启动 Worker
go run cmd/worker.go

# 新终端启动 CLI 工具
go run cmd/cli/main.go
```

**验证后端服务**：
```bash
# 健康检查
curl http://localhost:8080/api/v1/health

# API 文档
curl http://localhost:8080/api/v1/docs
```

### 2. 启动前端服务

```bash
cd frontend

# 开发模式
npm run dev

# 或者使用 pnpm
pnpm dev
```

**验证前端服务**：
- 访问本地开发服务器（默认3000端口）
- 检查控制台是否有错误
- 验证热更新是否正常工作

### 3. 启动 Cloudflare Worker

```bash
cd cloudflare-worker

# 本地开发
npm run dev

# 部署到开发环境
npm run deploy:dev
```

## 🔧 常见问题排查

### 后端问题

#### 1. 数据库连接失败

**错误信息**：
```
Error 1045: Access denied for user 'whu_sb_user'@'localhost'
```

**解决方案**：
```bash
# 检查 MySQL 服务状态
sudo systemctl status mysql

# 重置用户密码
mysql -u root -p
ALTER USER 'whu_sb_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;

# 验证连接
mysql -u whu_sb_user -p whu_sb
```

#### 2. Redis 连接失败

**错误信息**：
```
dial tcp 127.0.0.1:6379: connect: connection refused
```

**解决方案**：
```bash
# 检查 Redis 服务状态
sudo systemctl status redis

# 启动 Redis 服务
sudo systemctl start redis

# 检查 Redis 配置
redis-cli ping
```

#### 3. 端口被占用

**错误信息**：
```
listen tcp :8080: bind: address already in use
```

**解决方案**：
```bash
# 查找占用端口的进程
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # macOS/Linux

# 杀死进程
taskkill /PID <pid> /F        # Windows
kill -9 <pid>                 # macOS/Linux
```

### 前端问题

#### 1. 依赖安装失败

**错误信息**：
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /path/to/package.json
```

**解决方案**：
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

#### 2. 热更新不工作

**解决方案**：
```bash
# 检查文件监听限制 (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 重启开发服务器
npm run dev
```

#### 3. API 请求失败

**错误信息**：
```
Failed to fetch: http://localhost:8080/api/v1/courses
```

**解决方案**：
```bash
# 检查后端服务是否运行
curl http://localhost:8080/api/v1/health

# 检查 CORS 配置
# 确保后端允许前端域名访问

# 检查网络连接
ping localhost
```

### 开发工具问题

#### 1. Go 模块下载失败

**解决方案**：
```bash
# 设置代理
go env -w GOPROXY=https://goproxy.cn,direct

# 清理模块缓存
go clean -modcache

# 重新下载
go mod download
```

#### 2. TypeScript 编译错误

**解决方案**：
```bash
# 检查 TypeScript 版本
npx tsc --version

# 清理构建缓存
rm -rf dist node_modules/.cache

# 重新安装依赖
npm install
```

## 📊 性能优化

### 开发环境优化

#### 1. 后端性能

```bash
# 启用 Go 性能分析
go run -cpuprofile=cpu.prof cmd/main.go serve

# 分析性能数据
go tool pprof cpu.prof
```

#### 2. 前端性能

```bash
# 构建分析
npm run build -- --analyze

# 开发模式优化
npm run dev -- --host 0.0.0.0
```

### 数据库优化

```sql
-- 检查慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- 优化查询
EXPLAIN SELECT * FROM courses WHERE name LIKE '%算法%';

-- 添加索引
CREATE INDEX idx_courses_name ON courses(name);
CREATE INDEX idx_courses_category ON courses(category);
```

## 🔍 调试技巧

### 1. 后端调试

```go
// 使用 Delve 调试器
dlv debug cmd/main.go

// 添加调试日志
log.Printf("Debug: %+v", variable)

// 使用 pprof 分析
import _ "net/http/pprof"
```

### 2. 前端调试

```javascript
// 浏览器开发者工具
console.log('Debug:', variable)
debugger; // 断点

// Vue DevTools
// 安装 Vue DevTools 浏览器扩展
```

### 3. 网络调试

```bash
# 使用 curl 测试 API
curl -X GET http://localhost:8080/api/v1/courses \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json"

# 使用 Postman 或 Insomnia
# 导入 API 文档进行测试
```

## 📚 学习资源

### 官方文档
- [Go 官方文档](https://golang.org/doc/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Gin 框架文档](https://gin-gonic.com/docs/)
- [PrimeVue 文档](https://primevue.org/)

### 社区资源
- [Go 中文网](https://studygolang.com/)
- [Vue.js 中文文档](https://cn.vuejs.org/)
- [掘金 - Go 技术](https://juejin.cn/tag/Go)
- [掘金 - Vue.js](https://juejin.cn/tag/Vue.js)

---

> 💡 **提示**: 如果遇到其他问题，请查看项目的 Issues 页面或提交新的 Issue。
