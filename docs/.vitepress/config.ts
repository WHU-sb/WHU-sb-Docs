import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: 'WHU.sb 文档',
  description: '武汉大学课程评价系统开发文档',
  lang: 'zh-CN',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],
  
  vite: {
    css: {
      preprocessorOptions: {
        css: {
          charset: false
        }
      }
    }
  },

  // 添加更好的主题支持
  appearance: true,
  
  themeConfig: {
    siteTitle: 'WHU.sb 文档',
    
    // 添加logo
    logo: '/img/logo.png',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '使用教程', link: '/guide/' },
      { text: '开发文档', link: '/dev/' }
    ],
    
    // 添加搜索功能
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    
    // 添加社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WHU-sb/WHU-sb' }
    ],
    
    // 添加页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present WHU.sb Team'
    },
    
    // 添加大纲配置
    outline: {
      level: [2, 3],
      label: '目录'
    },
    
    // 添加返回顶部按钮
    returnToTop: true,
    
    // 添加侧边栏配置
    sidebar: {
      '/guide/': [
        {
          text: '使用教程',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '功能概览', link: '/guide/features' },
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '常见问题', link: '/guide/faq' }
          ]
        }
      ],
      
      '/dev/': [
        {
          text: '开发文档',
          items: [
            { text: '概述', link: '/dev/' },
            { text: '项目架构', link: '/dev/architecture' },
            { text: '技术栈', link: '/dev/tech-stack' },
            { text: '开发环境设置', link: '/dev/development-setup' }
          ]
        },
        {
          text: '前端开发',
          items: [
            { text: '概述', link: '/dev/frontend/' },
            { text: '技术栈', link: '/dev/frontend/tech-stack' },
            { text: '项目结构', link: '/dev/frontend/structure' },
            { text: '开发环境', link: '/dev/frontend/development' },
            { text: '组件开发', link: '/dev/frontend/components' },
            { text: '状态管理', link: '/dev/frontend/state-management' },
            { text: '路由管理', link: '/dev/frontend/routing' },
            { text: '国际化', link: '/dev/frontend/internationalization' },
            { text: 'PWA 支持', link: '/dev/frontend/pwa' },
            { text: '测试指南', link: '/dev/frontend/testing' },
            { text: '构建部署', link: '/dev/frontend/build-deploy' }
          ]
        },
        {
          text: '后端开发',
          items: [
            { text: '概述', link: '/dev/backend/' },
            { text: 'API设计', link: '/dev/backend/api-design' },
            { text: '数据库设计', link: '/dev/backend/database' },
            { text: '权限系统', link: '/dev/backend/rbac' },
            { text: '缓存策略', link: '/dev/backend/cache-strategy' },
            { text: '部署配置', link: '/dev/backend/deployment' },
            { text: '项目结构', link: '/dev/backend/structure' },
            { text: '技术栈', link: '/dev/backend/tech-stack' },
            { text: '开发环境', link: '/dev/backend/development' },
            { text: '权限系统', link: '/dev/backend/permissions' },
            { text: '缓存策略', link: '/dev/backend/caching' },
            { text: '搜索引擎', link: '/dev/backend/search' },
            { text: '向量数据库', link: '/dev/backend/vector-db' },
            { text: '测试指南', link: '/dev/backend/testing' },
            { text: 'Docker配置', link: '/dev/backend/docker' }
          ]
        },
        {
          text: 'Cloudflare Worker',
          items: [
            { text: '概述', link: '/dev/cloudflare/' },
            { text: '项目结构', link: '/dev/cloudflare/structure' },
            { text: '开发环境', link: '/dev/cloudflare/development' },
            { text: 'D1数据库', link: '/dev/cloudflare/d1-database' },
            { text: '测试指南', link: '/dev/cloudflare/testing' },
            { text: '技术栈', link: '/dev/cloudflare/tech-stack' },
            { text: 'API网关', link: '/dev/cloudflare/api-gateway' },
            { text: 'R2存储', link: '/dev/cloudflare/r2-storage' },
            { text: 'AI服务', link: '/dev/cloudflare/ai-services' },
            { text: '向量搜索', link: '/dev/cloudflare/vector-search' },
            { text: '部署配置', link: '/dev/cloudflare/deployment' }
          ]
        },
        {
          text: '文档维护',
          items: [
            { text: '概述', link: '/dev/docs/' },
            { text: '文档结构', link: '/dev/docs/structure' },
            { text: '写作规范', link: '/dev/docs/writing-guide' },
            { text: 'VitePress配置', link: '/dev/docs/vitepress-config' },
            { text: '部署流程', link: '/dev/docs/deployment' },
            { text: '贡献指南', link: '/dev/docs/contributing' }
          ]
        },
        {
          text: '仓库管理',
          items: [
            { text: '概述', link: '/dev/repo/' },
            { text: '分支策略', link: '/dev/repo/branching' },
            { text: '提交规范', link: '/dev/repo/commits' },
            { text: 'PR流程', link: '/dev/repo/pull-requests' },
            { text: '版本管理', link: '/dev/repo/versioning' },
            { text: 'CI/CD配置', link: '/dev/repo/ci-cd' },
            { text: '子模块管理', link: '/dev/repo/submodules' },
            { text: '代码规范', link: '/dev/repo/code-standards' }
          ]
        }
      ]
    }
  }
})
