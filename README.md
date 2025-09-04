# WHU.sb 文档系统

这是 WHU.sb 项目的官方文档系统，基于 VitePress 构建。

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run serve
```

## 📁 项目结构

```
docs/
├── .vitepress/           # VitePress 配置
│   ├── config.ts        # 主配置文件
│   └── theme/           # 自定义主题
│       ├── index.ts     # 主题入口
│       └── custom.css   # 自定义样式
├── docs/                # 文档内容
│   ├── index.md         # 首页
│   ├── guide/           # 使用教程
│   └── dev/             # 开发文档
├── package.json         # 项目依赖
└── README.md            # 本文档
```

## 🎨 主题定制

### 颜色变量
在 `custom.css` 中定义了以下颜色变量：
- `--vp-c-brand`: 主品牌色 (#3c8772)
- `--vp-c-brand-light`: 浅色品牌色
- `--vp-c-brand-dark`: 深色品牌色
- `--vp-c-brand-lighter`: 极浅品牌色
- `--vp-c-brand-darker`: 极深品牌色

### 样式组件
- `.VPHero`: 首页英雄区域
- `.VPFeatures`: 特性卡片区域
- `.tech-stack`: 技术架构展示
- `.doc-sections`: 文档导航区域
- `.footer-note`: 页脚提示区域

## 🔧 常见问题解决

### 1. 排版问题
**问题**: 首页排版混乱，样式不统一
**解决方案**: 
- 检查 VitePress 版本是否过旧
- 确保 CSS 变量正确定义
- 验证 Markdown 语法是否正确

### 2. 响应式问题
**问题**: 移动端显示异常
**解决方案**:
- 使用 `clamp()` 函数设置响应式字体
- 添加适当的媒体查询
- 测试不同屏幕尺寸

### 3. 主题切换问题
**问题**: 暗色主题样式异常
**解决方案**:
- 在 `.dark` 选择器中定义暗色主题变量
- 使用 CSS 变量确保主题一致性
- 测试主题切换功能

### 4. 组件渲染问题
**问题**: 首页组件不显示
**解决方案**:
- 检查 `layout: home` 配置
- 验证 `hero` 和 `features` 配置
- 确保 VitePress 版本支持相关功能

## 📝 内容维护

### 添加新页面
1. 在 `docs/` 目录下创建新的 `.md` 文件
2. 在 `config.ts` 中添加导航链接
3. 在侧边栏中添加页面链接

### 更新样式
1. 修改 `custom.css` 文件
2. 使用 CSS 变量保持一致性
3. 测试不同主题下的显示效果

### 优化性能
1. 压缩图片资源
2. 优化 CSS 选择器
3. 减少不必要的动画效果

## 🌟 最佳实践

### 1. 内容组织
- 使用清晰的标题层级
- 保持文档结构一致
- 添加适当的导航链接

### 2. 样式设计
- 使用 CSS 变量管理颜色
- 实现响应式设计
- 支持明暗主题切换

### 3. 用户体验
- 添加平滑滚动
- 优化加载动画
- 提供搜索功能

### 4. 维护性
- 模块化 CSS 代码
- 添加详细注释
- 定期更新依赖

## 🔄 更新日志

### v1.0.0-rc.44 (当前版本)
- 升级到 VitePress 1.0.0-rc.44
- 优化首页布局和样式
- 添加响应式设计支持
- 改进主题切换功能
- 优化文档导航结构

### v1.0.0-alpha.28 (之前版本)
- 初始版本
- 基础文档结构
- 简单样式配置

## 🤝 贡献指南

欢迎提交 Pull Request 来改进文档系统！

### 提交规范
- 使用清晰的提交信息
- 包含必要的测试说明
- 更新相关文档

### 代码规范
- 遵循 CSS 最佳实践
- 使用语义化的类名
- 添加适当的注释

## 📚 相关资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Vue 3 文档](https://vuejs.org/)
- [CSS 变量指南](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## 📄 许可证

本项目采用 MIT 许可证。
