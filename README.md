# WHU.sb 文档

这是 WHU.sb 项目的文档站点，基于 VitePress 构建。

## 📚 文档结构

```
docs/
├── docs/                    # VitePress 文档目录
│   ├── .vitepress/         # VitePress 配置
│   ├── index.md            # 首页
│   ├── guide/              # 使用教程
│   │   └── index.md        # 教程首页
│   └── dev/                # 开发文档
│       ├── index.md        # 开发文档首页
│       ├── architecture.md # 项目架构
│       ├── tech-stack.md   # 技术栈
│       ├── frontend/       # 前端开发文档
│       ├── backend/        # 后端开发文档
│       ├── cloudflare/     # Cloudflare Worker 文档
│       ├── docs/           # 文档维护指南
│       └── repo/           # 仓库管理指南
├── package.json            # 项目依赖
└── README.md               # 本文档
```

## 🚀 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看文档。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run serve
```

## 📖 文档编写

### 新增页面

1. 在 `docs/docs/` 目录下创建 Markdown 文件
2. 在 `.vitepress/config.ts` 中添加导航配置
3. 遵循现有的文档结构和写作规范

### 写作规范

- 使用 Markdown 格式
- 遵循中文写作规范
- 使用 emoji 图标增强可读性
- 保持文档结构清晰

## 🔧 配置说明

### VitePress 配置

主要配置文件：`.vitepress/config.ts`

- 网站标题和描述
- 导航栏配置
- 侧边栏配置
- 主题配置

### 主题定制

可以通过修改 `.vitepress/theme/` 目录下的文件来自定义主题。

## 📝 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 编写或修改文档
4. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。
