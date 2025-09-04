# Cloudflare Worker 开发

欢迎来到 WHU.sb Cloudflare Worker 开发文档！

## 技术栈

WHU.sb Cloudflare Worker 采用现代化的边缘计算技术栈，提供高性能的AI服务和API网关功能。

### 核心技术

- **Cloudflare Workers** - 边缘计算平台
- **TypeScript** - 类型安全的 JavaScript
- **Cloudflare D1** - 分布式 SQLite 数据库
- **Cloudflare R2** - 对象存储服务
- **Cloudflare AI** - AI 模型服务
- **Cloudflare Vectorize** - 向量数据库
- **Wrangler CLI** - 开发和部署工具
- **Vitest** - 单元测试框架

### 开发工具

- **Drizzle ORM** - 类型安全的数据库操作
- **Drizzle Kit** - 数据库迁移和生成工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化

## 项目结构

```
cloudflare-worker/
├── src/
│   ├── worker.ts           # Worker主入口
│   ├── router.ts           # 路由配置
│   ├── handlers/           # 请求处理器
│   ├── middleware/         # 中间件
│   ├── services/           # 业务服务层
│   ├── db/                 # 数据库相关
│   └── utils/              # 工具函数
├── migrations/             # 数据库迁移文件
├── tests/                  # 测试文件
├── wrangler.toml          # Wrangler配置
└── package.json           # 项目依赖
```

## 快速开始

### 环境要求

- **Node.js**: 18.0+
- **npm**: 8.0+ 或 **yarn**: 1.22+
- **Wrangler CLI**: 最新版本

### 安装依赖

```bash
cd cloudflare-worker
npm install
```

### 配置环境

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare 账户**
   ```bash
   wrangler login
   ```

3. **创建 D1 数据库**
   ```bash
   npm run d1:create
   ```

4. **应用数据库迁移**
   ```bash
   npm run d1:migrate
   ```

### 启动开发服务器

```bash
npm run dev
```

访问本地开发服务器查看 Worker。

### 类型检查

```bash
npm run type-check
```

### 运行测试

```bash
# 运行所有测试
npm run test

# 运行测试并显示覆盖率
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 开发指南

### Worker 开发
- [项目结构](/dev/cloudflare/structure) - 目录结构和文件组织
- [开发环境](/dev/cloudflare/development) - 环境配置和开发工具
- [D1数据库](/dev/cloudflare/d1-database) - Cloudflare D1 使用指南
- [测试指南](/dev/cloudflare/testing) - Vitest 测试框架

### 数据库管理
- [D1 数据库](/dev/cloudflare/d1-database) - Cloudflare D1 使用指南

### 测试指南
- [单元测试](/dev/cloudflare/testing) - Vitest 测试框架

## 核心功能

### AI 聊天引擎

基于 Cloudflare AI 的智能对话系统，支持：

- 课程知识问答
- 流式响应
- 上下文记忆
- 多轮对话

### 数据管理

提供完整的数据管理功能：

- 课程数据同步
- 评价数据管理
- 数据备份恢复
- 实时数据更新

### API 网关

作为前端和后端的中间层，提供：

- 请求路由转发
- 响应缓存优化
- 错误处理统一
- CORS 跨域支持

### 安全验证

多层次的安全保护机制：

- Turnstile 人机验证
- API 签名验证
- 请求频率限制
- 输入数据验证

## 性能优化

### 边缘计算

- 全球分布式部署
- 就近访问优化
- 低延迟响应
- 高可用性

### 缓存策略

- 静态资源缓存
- API 响应缓存
- 数据库查询缓存
- CDN 加速

### 资源优化

- 代码压缩
- 数据压缩
- 连接复用
- 异步处理

## 调试工具

### Wrangler CLI

```bash
# 本地开发
wrangler dev

# 查看日志
wrangler tail

# 数据库操作
wrangler d1 execute

# 环境变量管理
wrangler secret put
```

### 浏览器开发者工具

- **Console**: 日志输出和错误调试
- **Network**: 网络请求监控
- **Performance**: 性能分析
- **Application**: 存储和缓存管理

## 代码规范

### TypeScript 配置

项目使用严格的 TypeScript 配置，确保类型安全和代码质量。配置包括：

- 严格模式启用
- 隐式类型检查
- 未使用变量检查
- 返回值类型检查

### ESLint 配置

使用 ESLint 进行代码质量检查，配置包括：

- TypeScript 规则
- 最佳实践规则
- 代码风格规则
- 安全规则

### Prettier 配置

使用 Prettier 进行代码格式化，确保代码风格一致。

### Git Hooks

项目配置了 Git Hooks，在提交前会自动：

- 运行 ESLint 检查
- 运行 Prettier 格式化
- 运行类型检查
- 运行单元测试

## 开发最佳实践

### 1. 代码组织

- **单一职责原则**: 每个文件只负责一个特定功能
- **依赖注入**: 通过参数传递依赖，避免硬编码
- **接口分离**: 定义清晰的接口，避免过度耦合
- **错误处理**: 统一的错误处理机制

### 2. 性能优化

- **异步处理**: 充分利用异步操作
- **缓存策略**: 合理使用缓存减少重复计算
- **资源复用**: 避免重复创建对象和连接
- **代码分割**: 按需加载减少包大小

### 3. 安全考虑

- **输入验证**: 严格验证所有输入数据
- **参数化查询**: 防止 SQL 注入攻击
- **权限控制**: 实现细粒度的权限管理
- **日志记录**: 记录关键操作和错误信息

### 4. 测试策略

- **单元测试**: 测试独立的函数和模块
- **集成测试**: 测试模块间的交互
- **端到端测试**: 测试完整的业务流程
- **性能测试**: 确保性能指标达标

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 编写代码和测试
4. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
5. 推送到分支 (`git push origin feature/AmazingFeature`)
6. 打开 Pull Request

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

---

**提示**: Cloudflare Worker 开发文档会随着项目发展持续更新，建议定期查看最新版本。
