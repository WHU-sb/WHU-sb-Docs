# 安全实践

## 概述

WHU.sb 项目建立了完善的安全实践体系，确保代码和数据的安全性。本文档详细说明敏感信息管理、安全扫描、访问控制等安全最佳实践。

## 🔒 敏感信息管理

### 环境变量管理

#### 环境变量配置

```bash
# .env.example
# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=whu_sb
DATABASE_USER=whu_user
DATABASE_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# API 密钥
API_KEY=your_api_key
EXTERNAL_API_KEY=your_external_api_key

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password

# 第三方服务
REDIS_URL=redis://localhost:6379
CLOUD_STORAGE_KEY=your_cloud_storage_key
```

#### 环境变量加载

```go
// config/config.go
package config

import (
	"os"
	"strconv"
)

type Config struct {
	Database DatabaseConfig
	JWT      JWTConfig
	API      APIConfig
	Email    EmailConfig
}

type DatabaseConfig struct {
	URL      string
	Host     string
	Port     int
	Name     string
	User     string
	Password string
}

type JWTConfig struct {
	Secret     string
	Expiration string
}

type APIConfig struct {
	Key            string
	ExternalAPIKey string
}

type EmailConfig struct {
	Host     string
	Port     int
	User     string
	Password string
}

func LoadConfig() (*Config, error) {
	port, _ := strconv.Atoi(getEnv("DATABASE_PORT", "5432"))
	smtpPort, _ := strconv.Atoi(getEnv("SMTP_PORT", "587"))
	
	return &Config{
		Database: DatabaseConfig{
			URL:      getEnv("DATABASE_URL", ""),
			Host:     getEnv("DATABASE_HOST", "localhost"),
			Port:     port,
			Name:     getEnv("DATABASE_NAME", "whu_sb"),
			User:     getEnv("DATABASE_USER", "whu_user"),
			Password: getEnv("DATABASE_PASSWORD", ""),
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", ""),
			Expiration: getEnv("JWT_EXPIRATION", "24h"),
		},
		API: APIConfig{
			Key:            getEnv("API_KEY", ""),
			ExternalAPIKey: getEnv("EXTERNAL_API_KEY", ""),
		},
		Email: EmailConfig{
			Host:     getEnv("SMTP_HOST", "smtp.gmail.com"),
			Port:     smtpPort,
			User:     getEnv("SMTP_USER", ""),
			Password: getEnv("SMTP_PASSWORD", ""),
		},
	}, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
```

### 配置文件管理

#### 配置文件模板

```yaml
# config/config.yaml.example
database:
  host: localhost
  port: 5432
  name: whu_sb
  user: whu_user
  password: your_password

jwt:
  secret: your_jwt_secret_key
  expiration: 24h

api:
  key: your_api_key
  external_api_key: your_external_api_key

email:
  host: smtp.gmail.com
  port: 587
  user: your_email@gmail.com
  password: your_email_password

redis:
  url: redis://localhost:6379

cloud:
  storage_key: your_cloud_storage_key
```

#### 配置文件加载

```go
// config/loader.go
package config

import (
	"os"
	"path/filepath"
	
	"gopkg.in/yaml.v2"
)

func LoadConfigFromFile(configPath string) (*Config, error) {
	// 检查配置文件是否存在
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return nil, err
	}
	
	// 读取配置文件
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, err
	}
	
	// 解析配置文件
	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, err
	}
	
	return &config, nil
}

func CreateConfigTemplate(templatePath string) error {
	config := &Config{
		Database: DatabaseConfig{
			Host: "localhost",
			Port: 5432,
			Name: "whu_sb",
			User: "whu_user",
		},
		JWT: JWTConfig{
			Expiration: "24h",
		},
		Email: EmailConfig{
			Host: "smtp.gmail.com",
			Port: 587,
		},
	}
	
	data, err := yaml.Marshal(config)
	if err != nil {
		return err
	}
	
	// 确保目录存在
	dir := filepath.Dir(templatePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	
	return os.WriteFile(templatePath, data, 0644)
}
```

### .gitignore 配置

```bash
# .gitignore
# 环境变量文件
.env
.env.local
.env.development
.env.test
.env.production

# 配置文件
config/config.yaml
config/config.json
config/config.toml

# 密钥文件
*.key
*.pem
*.crt
*.p12
*.pfx

# 证书文件
certs/
certificates/

# 密钥目录
secrets/
keys/

# 日志文件
*.log
logs/

# 临时文件
*.tmp
*.temp
temp/

# 数据库文件
*.db
*.sqlite
*.sqlite3

# 备份文件
*.bak
*.backup

# IDE 文件
.vscode/
.idea/
*.swp
*.swo

# 操作系统文件
.DS_Store
Thumbs.db
```

## 🔍 安全扫描

### 依赖漏洞扫描

#### 前端依赖扫描

```json
// package.json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "audit:ci": "npm audit --audit-level moderate",
    "security:scan": "npm audit && snyk test"
  },
  "devDependencies": {
    "snyk": "^1.1000.0"
  }
}
```

#### 后端依赖扫描

```bash
# Go 依赖扫描
go list -json -deps ./... | nancy sleuth

# 或者使用 govulncheck
govulncheck ./...

# 使用 gosec 进行安全扫描
gosec ./...
```

#### 自动化扫描脚本

```bash
#!/bin/bash
# scripts/security-scan.sh

set -e

echo "🔒 开始安全扫描..."

# 扫描依赖漏洞
echo "📦 扫描依赖漏洞..."

# Go 依赖扫描
if [ -f "backend/go.mod" ]; then
    echo "  扫描 Go 依赖..."
    cd backend
    if ! go list -json -deps ./... | nancy sleuth; then
        echo "❌ Go 依赖存在安全漏洞"
        exit 1
    fi
    cd ..
fi

# Node.js 依赖扫描
if [ -f "frontend/package.json" ]; then
    echo "  扫描前端依赖..."
    cd frontend
    if ! npm audit --audit-level moderate; then
        echo "❌ 前端依赖存在安全风险"
        exit 1
    fi
    cd ..
fi

# 扫描代码中的敏感信息
echo "🔍 扫描敏感信息..."
if grep -r "password\|secret\|key\|token" . --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist; then
    echo "⚠️  发现可能的敏感信息，请检查"
    exit 1
fi

# 检查文件权限
echo "📁 检查文件权限..."
find . -type f -executable -not -path "./.git/*" -not -path "./node_modules/*" | while read file; do
    echo "可执行文件: $file"
done

echo "✅ 安全扫描完成"
```

### 代码安全扫描

#### ESLint 安全规则

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    'plugin:security/recommended'
  ],
  plugins: ['security'],
  rules: {
    // 安全相关规则
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error'
  }
};
```

#### Go 安全扫描

```yaml
# .golangci.yml
linters:
  enable:
    - gosec
    - govet
    - staticcheck

linters-settings:
  gosec:
    excludes:
      - G101 # Look for hardcoded credentials
      - G102 # Bind to all interfaces
      - G103 # Audit the use of unsafe block
      - G104 # Audit errors not checked
      - G106 # Audit the use of ssh.InsecureIgnoreHostKey
      - G107 # Url provided to HTTP request as taint input
      - G108 # Profiling endpoint is automatically exposed
      - G109 # Converting strconv.Atoi result to int32/int16
      - G110 # Potential DoS vulnerability via decompression bomb
      - G111 # Potential directory traversal
      - G112 # Potential slowloris attack
      - G113 # Usage of Rat.SetString in math/big with int
      - G114 # Use of net/http serve function that has no support for setting timeouts
      - G201 # SQL query construction using format string
      - G202 # SQL query construction using string concatenation
      - G203 # Use of unescaped data in HTML templates
      - G204 # Audit use of command execution
      - G301 # Poor file permissions used when creating a directory
      - G302 # Poor file permissions used with chmod
      - G303 # Creating tempfile using a predictable path
      - G304 # File path provided as taint input
      - G305 # File traversal when extracting zip/tar archive
      - G306 # Poor file permissions used when writing to a file
      - G307 # Poor file permissions used when creating a file with os.Create
      - G401 # Detect the usage of DES, RC4, MD5 or SHA1
      - G402 # Look for bad TLS connection settings
      - G403 # Ensure minimum RSA key length of 2048 bits
      - G404 # Insecure random number source (rand)
      - G501 # Import blocklist: crypto/md5
      - G502 # Import blocklist: crypto/des
      - G503 # Import blocklist: crypto/rc4
      - G504 # Import blocklist: net/http/cgi
      - G505 # Import blocklist: crypto/sha1
```

### 容器安全扫描

#### Docker 安全扫描

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

# 设置非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 复制源代码
COPY --chown=nextjs:nodejs . .

# 安装依赖
RUN npm ci --only=production

# 构建应用
RUN npm run build

# 生产镜像
FROM node:18-alpine AS runner
WORKDIR /app

# 设置非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 启动应用
CMD ["node", "server.js"]
```

#### 容器安全扫描脚本

```bash
#!/bin/bash
# scripts/container-scan.sh

set -e

echo "🐳 开始容器安全扫描..."

# 使用 Trivy 扫描容器镜像
if command -v trivy &> /dev/null; then
    echo "🔍 使用 Trivy 扫描容器镜像..."
    
    # 扫描 Dockerfile
    trivy config .
    
    # 扫描镜像
    if [ -n "$IMAGE_NAME" ]; then
        trivy image $IMAGE_NAME
    fi
else
    echo "⚠️  Trivy 未安装，跳过容器扫描"
fi

# 使用 Docker Scout 扫描
if command -v docker &> /dev/null; then
    echo "🔍 使用 Docker Scout 扫描..."
    
    if [ -n "$IMAGE_NAME" ]; then
        docker scout cves $IMAGE_NAME
    fi
fi

echo "✅ 容器安全扫描完成"
```

## 🔐 访问控制

### 用户权限管理

#### 角色定义

```go
// models/role.go
package models

type Role string

const (
	RoleAdmin    Role = "admin"
	RoleUser     Role = "user"
	RoleGuest    Role = "guest"
	RoleModerator Role = "moderator"
)

type Permission string

const (
	PermissionRead   Permission = "read"
	PermissionWrite  Permission = "write"
	PermissionDelete Permission = "delete"
	PermissionAdmin  Permission = "admin"
)

type RolePermission struct {
	Role       Role         `json:"role"`
	Permissions []Permission `json:"permissions"`
}

var RolePermissions = map[Role][]Permission{
	RoleAdmin: {
		PermissionRead,
		PermissionWrite,
		PermissionDelete,
		PermissionAdmin,
	},
	RoleUser: {
		PermissionRead,
		PermissionWrite,
	},
	RoleGuest: {
		PermissionRead,
	},
	RoleModerator: {
		PermissionRead,
		PermissionWrite,
		PermissionDelete,
	},
}
```

#### 权限中间件

```go
// middleware/auth.go
package middleware

import (
	"context"
	"net/http"
	"strings"
	
	"whu.sb/internal/models"
	"whu.sb/internal/services"
)

type AuthMiddleware struct {
	userService services.UserService
}

func NewAuthMiddleware(userService services.UserService) *AuthMiddleware {
	return &AuthMiddleware{
		userService: userService,
	}
}

func (m *AuthMiddleware) Authenticate(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 获取 Authorization 头
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}
		
		// 验证 Bearer token
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
			return
		}
		
		token := tokenParts[1]
		
		// 验证 token
		user, err := m.userService.ValidateToken(r.Context(), token)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}
		
		// 将用户信息添加到上下文
		ctx := context.WithValue(r.Context(), "user", user)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func (m *AuthMiddleware) RequirePermission(permission models.Permission) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			user, ok := r.Context().Value("user").(*models.User)
			if !ok {
				http.Error(w, "User not found in context", http.StatusInternalServerError)
				return
			}
			
			// 检查用户权限
			if !m.hasPermission(user, permission) {
				http.Error(w, "Insufficient permissions", http.StatusForbidden)
				return
			}
			
			next.ServeHTTP(w, r)
		}
	}
}

func (m *AuthMiddleware) hasPermission(user *models.User, permission models.Permission) bool {
	userPermissions, exists := models.RolePermissions[user.Role]
	if !exists {
		return false
	}
	
	for _, p := range userPermissions {
		if p == permission {
			return true
		}
	}
	
	return false
}
```

### API 安全

#### 输入验证

```go
// middleware/validation.go
package middleware

import (
	"net/http"
	"regexp"
	"strings"
)

type ValidationMiddleware struct{}

func NewValidationMiddleware() *ValidationMiddleware {
	return &ValidationMiddleware{}
}

func (m *ValidationMiddleware) ValidateInput(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 验证 Content-Type
		contentType := r.Header.Get("Content-Type")
		if !strings.Contains(contentType, "application/json") {
			http.Error(w, "Content-Type must be application/json", http.StatusBadRequest)
			return
		}
		
		// 验证请求大小
		if r.ContentLength > 10*1024*1024 { // 10MB
			http.Error(w, "Request too large", http.StatusRequestEntityTooLarge)
			return
		}
		
		next.ServeHTTP(w, r)
	}
}

func (m *ValidationMiddleware) SanitizeInput(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 清理查询参数
		for key, values := range r.URL.Query() {
			for i, value := range values {
				values[i] = m.sanitizeString(value)
			}
			r.URL.Query()[key] = values
		}
		
		next.ServeHTTP(w, r)
	}
}

func (m *ValidationMiddleware) sanitizeString(input string) string {
	// 移除潜在的 XSS 攻击
	re := regexp.MustCompile(`<script[^>]*>.*?</script>`)
	input = re.ReplaceAllString(input, "")
	
	// 移除 SQL 注入攻击
	re = regexp.MustCompile(`(\b(union|select|insert|update|delete|drop|create|alter)\b)`)
	input = re.ReplaceAllString(input, "")
	
	return input
}
```

#### 速率限制

```go
// middleware/ratelimit.go
package middleware

import (
	"net/http"
	"sync"
	"time"
	
	"golang.org/x/time/rate"
)

type RateLimiter struct {
	limiters map[string]*rate.Limiter
	mu       sync.RWMutex
	r        rate.Limit
	b        int
}

func NewRateLimiter(r rate.Limit, b int) *RateLimiter {
	return &RateLimiter{
		limiters: make(map[string]*rate.Limiter),
		r:        r,
		b:        b,
	}
}

func (rl *RateLimiter) getLimiter(key string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	
	limiter, exists := rl.limiters[key]
	if !exists {
		limiter = rate.NewLimiter(rl.r, rl.b)
		rl.limiters[key] = limiter
	}
	
	return limiter
}

func (rl *RateLimiter) RateLimit(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 获取客户端 IP
		clientIP := r.RemoteAddr
		if forwardedFor := r.Header.Get("X-Forwarded-For"); forwardedFor != "" {
			clientIP = forwardedFor
		}
		
		limiter := rl.getLimiter(clientIP)
		if !limiter.Allow() {
			http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
			return
		}
		
		next.ServeHTTP(w, r)
	}
}
```

## 📊 安全监控

### 安全日志

#### 日志配置

```go
// logging/security.go
package logging

import (
	"log"
	"os"
	"time"
)

type SecurityLogger struct {
	logger *log.Logger
	file   *os.File
}

func NewSecurityLogger(logPath string) (*SecurityLogger, error) {
	file, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, err
	}
	
	logger := log.New(file, "", log.LstdFlags)
	
	return &SecurityLogger{
		logger: logger,
		file:   file,
	}, nil
}

func (sl *SecurityLogger) LogSecurityEvent(event string, details map[string]interface{}) {
	sl.logger.Printf("[SECURITY] %s - %s - %v", time.Now().Format(time.RFC3339), event, details)
}

func (sl *SecurityLogger) LogFailedLogin(ip, username string) {
	sl.LogSecurityEvent("Failed login", map[string]interface{}{
		"ip":       ip,
		"username": username,
		"time":     time.Now().Format(time.RFC3339),
	})
}

func (sl *SecurityLogger) LogSuccessfulLogin(ip, username string) {
	sl.LogSecurityEvent("Successful login", map[string]interface{}{
		"ip":       ip,
		"username": username,
		"time":     time.Now().Format(time.RFC3339),
	})
}

func (sl *SecurityLogger) LogUnauthorizedAccess(ip, resource string) {
	sl.LogSecurityEvent("Unauthorized access", map[string]interface{}{
		"ip":       ip,
		"resource": resource,
		"time":     time.Now().Format(time.RFC3339),
	})
}

func (sl *SecurityLogger) Close() error {
	return sl.file.Close()
}
```

### 安全告警

#### 告警配置

```yaml
# config/alerts.yaml
alerts:
  failed_login:
    threshold: 5
    window: 5m
    action: block_ip
    
  unauthorized_access:
    threshold: 3
    window: 1m
    action: notify_admin
    
  rate_limit_exceeded:
    threshold: 10
    window: 1m
    action: block_ip
    
  suspicious_activity:
    threshold: 1
    window: 1h
    action: investigate

notifications:
  email:
    enabled: true
    recipients:
      - admin@whu.sb
      - security@whu.sb
  
  slack:
    enabled: true
    webhook_url: https://hooks.slack.com/services/xxx/yyy/zzz
  
  webhook:
    enabled: false
    url: https://api.example.com/security-alerts
```

## 📈 安全最佳实践

### 开发阶段

1. **安全编码**: 遵循安全编码规范
2. **代码审查**: 重点关注安全相关代码
3. **依赖管理**: 及时更新依赖，扫描漏洞
4. **测试覆盖**: 包含安全测试用例

### 部署阶段

1. **环境隔离**: 开发、测试、生产环境隔离
2. **密钥管理**: 使用安全的密钥管理服务
3. **网络安全**: 配置防火墙和网络安全策略
4. **监控告警**: 部署安全监控和告警系统

### 运维阶段

1. **定期扫描**: 定期进行安全扫描
2. **日志分析**: 分析安全日志，发现异常
3. **漏洞修复**: 及时修复发现的安全漏洞
4. **安全培训**: 定期进行安全培训

---

通过遵循本文档中的安全实践，可以建立完善的安全防护体系，确保项目和数据的安全性。
