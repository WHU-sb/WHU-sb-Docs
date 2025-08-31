# 开发环境

本文档详细介绍了如何设置和配置 WHU.sb Cloudflare Worker 的开发环境。

## 环境要求

### 基础要求

- **Node.js**: 18.0 或更高版本
- **npm**: 8.0 或更高版本，或 **yarn**: 1.22 或更高版本
- **Git**: 用于版本控制

### 推荐版本

```bash
# 检查 Node.js 版本
node --version  # 推荐 v18.17.0 或更高

# 检查 npm 版本
npm --version   # 推荐 v9.0.0 或更高

# 检查 Git 版本
git --version   # 推荐 v2.30.0 或更高
```

## 安装步骤

### 1. 克隆项目

```bash
# 克隆主项目
git clone https://github.com/WHU-sb/WHU-sb.git
cd whu.sb

# 进入 Cloudflare Worker 目录
cd cloudflare-worker
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 安装 Wrangler CLI

```bash
# 全局安装 Wrangler CLI
npm install -g wrangler

# 验证安装
wrangler --version
```

### 4. 登录 Cloudflare 账户

```bash
# 登录到 Cloudflare 账户
wrangler login

# 这会打开浏览器进行身份验证
# 确保你有 Cloudflare 账户的访问权限
```

## 环境配置

### 1. 创建 D1 数据库

```bash
# 创建 D1 数据库
npm run d1:create

# 或者手动创建
wrangler d1 create whu-course-review
```

创建成功后，你会看到类似以下的输出：

```
✅ Successfully created DB 'whu-course-review' in region APAC
Created database 'whu-course-review' (ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
```

### 2. 配置 wrangler.toml

更新 `wrangler.toml` 文件中的数据库 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "whu-course-review"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # 替换为实际的数据库 ID
```

### 3. 创建 R2 存储桶

```bash
# 创建 R2 存储桶
wrangler r2 bucket create whu-course-bucket
```

### 4. 创建 Vectorize 索引

```bash
# 创建向量索引
wrangler vectorize create whu-course-knowledge-base --dimensions=1536
```

### 5. 设置环境变量

```bash
# 设置 API 密钥
wrangler secret put API_SECRET

# 设置 Turnstile 密钥
wrangler secret put TURNSTILE_SECRET_KEY

# 设置后端 API URL
wrangler secret put BACKEND_API_URL
```

## 数据库迁移

### 1. 应用数据库迁移

```bash
# 应用所有迁移
npm run d1:migrate

# 或者手动执行
wrangler d1 migrations apply whu-course-review
```

### 2. 导入初始数据

使用项目提供的 SQL 执行脚本：

```bash
# Windows
execute_d1_sql.bat

# Linux/Mac
chmod +x execute_d1_sql.sh
./execute_d1_sql.sh
```

### 3. 验证数据库

```bash
# 连接到本地数据库
npm run d1:local

# 在交互式环境中执行查询
SELECT COUNT(*) FROM courses;
```

## 开发服务器

### 启动开发服务器

```bash
# 启动本地开发服务器
npm run dev

# 或者使用 wrangler
wrangler dev
```

开发服务器将在 `http://localhost:8787` 启动。

### 开发服务器特性

- **热重载**: 代码修改后自动重启
- **本地数据库**: 使用本地 SQLite 数据库
- **环境变量**: 自动加载本地环境变量
- **调试支持**: 支持断点和日志输出

### 访问开发环境

- **主页面**: http://localhost:8787
- **健康检查**: http://localhost:8787/health
- **API 文档**: http://localhost:8787/api/docs

## 类型检查

### 运行类型检查

```bash
# 检查 TypeScript 类型
npm run type-check

# 或者使用 tsc
npx tsc --noEmit
```

### 类型检查配置

项目使用严格的 TypeScript 配置，包括：

- 严格模式启用
- 隐式类型检查
- 未使用变量检查
- 返回值类型检查
- 模块解析配置

## 测试环境

### 安装测试依赖

```bash
# 安装 Vitest
npm install -D vitest @vitest/coverage-v8
```

### 运行测试

```bash
# 运行所有测试
npm run test

# 运行测试并显示覆盖率
npm run test:coverage

# 监听模式运行测试
npm run test:watch

# 运行特定测试文件
npm run test -- handlers/ai.test.ts
```

### 测试配置

项目使用 Vitest 作为测试框架，配置包括：

- Miniflare 环境模拟
- 测试覆盖率报告
- 测试文件组织
- Mock 对象配置

## 调试配置

### VS Code 调试

创建 `.vscode/launch.json` 文件，配置调试环境：

- Worker 调试配置
- 断点设置
- 变量监控
- 调用栈分析

### 日志调试

在代码中添加日志输出，使用 `wrangler tail` 查看实时日志。

## 环境变量管理

### 本地环境变量

创建 `.dev.vars` 文件（不要提交到版本控制），包含：

- 开发环境配置
- 本地服务地址
- 测试密钥
- 调试选项

### 生产环境变量

使用 `wrangler secret put` 命令设置生产环境变量，确保安全性。

## 开发工具

### 推荐 VS Code 扩展

- **TypeScript Importer**: 自动导入 TypeScript 模块
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Thunder Client**: API 测试工具
- **GitLens**: Git 集成增强

### 有用的命令行工具

```bash
# 查看 Worker 日志
wrangler tail

# 查看 D1 数据库
wrangler d1 execute whu-course-review --command "SELECT * FROM courses LIMIT 5"

# 查看 R2 存储桶
wrangler r2 bucket list

# 查看 Vectorize 索引
wrangler vectorize list
```

## 常见问题

### 1. Wrangler 登录失败

```bash
# 清除登录状态
wrangler logout

# 重新登录
wrangler login
```

### 2. 数据库连接失败

```bash
# 检查数据库 ID 是否正确
wrangler d1 list

# 重新创建数据库
wrangler d1 delete whu-course-review
wrangler d1 create whu-course-review
```

### 3. 环境变量未加载

```bash
# 检查环境变量
wrangler secret list

# 重新设置环境变量
wrangler secret put VARIABLE_NAME
```

### 4. 端口被占用

```bash
# 使用不同端口启动
wrangler dev --port 8788

# 或者杀死占用端口的进程
lsof -ti:8787 | xargs kill -9
```

### 5. 类型错误

```bash
# 清理 TypeScript 缓存
rm -rf node_modules/.cache

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

## 性能优化

### 开发环境优化

- 使用 `wrangler dev --local` 进行本地开发
- 启用热重载减少重启时间
- 使用 TypeScript 增量编译
- 合理配置缓存策略

### 调试性能

```bash
# 查看 Worker 性能指标
wrangler tail --format=pretty

# 分析请求响应时间
wrangler tail --format=json | jq '.response_time'
```

## 开发最佳实践

### 1. 环境隔离

- **开发环境**: 使用本地数据库和模拟服务
- **测试环境**: 独立的测试数据库
- **生产环境**: 真实的服务和数据库

### 2. 配置管理

- **环境变量**: 敏感信息使用环境变量
- **配置文件**: 非敏感配置使用配置文件
- **版本控制**: 配置文件模板纳入版本控制

### 3. 调试策略

- **日志记录**: 合理使用日志记录
- **错误处理**: 完善的错误处理机制
- **性能监控**: 监控关键性能指标

### 4. 代码质量

- **类型检查**: 严格使用 TypeScript 类型检查
- **代码格式化**: 统一的代码风格
- **测试覆盖**: 保持足够的测试覆盖率

## 团队协作

### 1. 开发流程

- **分支管理**: 使用 Git Flow 工作流
- **代码审查**: 强制代码审查流程
- **持续集成**: 自动化测试和部署

### 2. 文档维护

- **API 文档**: 及时更新 API 文档
- **代码注释**: 关键代码添加注释
- **变更日志**: 记录重要变更

### 3. 知识共享

- **技术分享**: 定期技术分享会议
- **最佳实践**: 总结和分享最佳实践
- **问题解决**: 记录常见问题和解决方案

## 下一步

环境配置完成后，你可以：

1. [查看项目结构](/dev/cloudflare/structure) 了解代码组织
2. [学习路由配置](/dev/cloudflare/routing) 了解请求处理
3. [阅读 API 设计](/dev/cloudflare/api-design) 了解接口规范
4. [开始编写测试](/dev/cloudflare/testing) 确保代码质量

---

**提示**: 开发环境配置是项目开发的基础，确保所有工具和依赖都正确安装和配置。遵循最佳实践，提高开发效率和代码质量。
