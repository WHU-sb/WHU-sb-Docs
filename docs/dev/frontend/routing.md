# 路由管理

## 概述

WHU.sb 前端使用 Vue Router 4 进行路由管理，采用基于文件的路由配置，支持懒加载、路由守卫、权限控制等功能。

## 路由配置

### 基础配置

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    // 路由切换时滚动到顶部
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
```

### 路由结构

```
路由结构概览：
├── /                    # 首页
├── /search              # 搜索页面（重定向到 /search/courses）
├── /search/:scope       # 搜索页面（courses, teachers, reviews, all）
├── /add/                # 添加内容
│   ├── review           # 添加评价
│   ├── teacher          # 添加教师
│   └── course           # 添加课程
├── /review/:uid         # 评价详情
├── /reviews             # 评价列表
├── /teachers            # 教师列表
├── /teacher/:id         # 教师详情
├── /teachers/:uid       # 教师详情（UID）
├── /reviews/:uid        # 评价详情（UID）
├── /about               # 关于页面
├── /utilities           # 实用工具
│   ├── navigation       # 校园导航
│   └── calendar         # 校历
├── /pwa-settings        # PWA设置
├── /pwa-debug           # PWA调试工具
├── /admin               # 管理后台
│   └── translation      # 翻译管理
├── /auth/               # 认证相关
│   ├── login            # 登录
│   └── register         # 注册
├── /user                # 用户中心
├── /admin/login         # 管理员登录
├── /random/:scope?      # 随机功能
├── /cache-test          # 缓存测试
├── /courses/:uid        # 课程详情
├── /courses/:uid/teacher/:teacherUid  # 课程讲师详情
├── /teapot              # 418错误页面
├── /error/:code         # 错误页面
└── /:pathMatch(.*)*     # 404页面
```

## 路由定义

### 基础路由

```typescript
const routes = [
  {
    path: '/',
    component: HomeView,
    meta: { title: '首页' },
  },
  {
    path: '/about',
    component: AboutView,
    meta: { title: '关于' },
  },
]
```

### 动态路由

```typescript
{
  path: '/courses/:uid',
  component: CourseDetailView,
  meta: { title: '课程详情' },
},
{
  path: '/teacher/:id',
  name: 'teacher-detail',
  component: TeacherDetailView,
  meta: { title: '教师详情' },
},
```

### 嵌套路由

```typescript
{
  path: '/admin',
  component: AdminView,
  meta: { title: '管理后台' },
  children: [
    {
      path: 'translation',
      component: () => import('@/views/admin/AdminTranslationView.vue'),
      meta: { title: '翻译管理', requiresAdmin: true },
    },
  ],
},
```

### 重定向路由

```typescript
{
  path: '/search',
  redirect: (to: any) => {
    // 保留原有 query 参数
    return {
      path: '/search/courses',
      query: to.query,
    }
  },
},
```

## 懒加载

### 组件懒加载

使用动态导入实现组件懒加载：

```typescript
// 使用更智能的组件加载
const HomeView = () => import('@/views/HomeView.vue')
const CourseDetailView = () => import('@/views/CourseDetailView.vue')
const AddReviewView = () => import('@/views/AddReviewView.vue')
const SearchView = () => import('@/views/SearchView.vue')
```

### 内联懒加载

```typescript
{
  path: '/add/teacher',
  name: 'add-teacher',
  component: () => import('@/views/AddTeacherView.vue'),
  meta: { title: '添加教师' },
},
```

## 路由元信息

### Meta 属性

```typescript
{
  path: '/search/:scope',
  component: SearchView,
  meta: {
    // 动态 title，i18n 搜索+scope
    get title(): string {
      const t = (window as any).$t || ((key: string) => key)
      const scopeMap: Record<string, string> = {
        courses: t('search.scopeCourses'),
        teachers: t('search.scopeTeachers'),
        reviews: t('search.scopeReviews'),
        all: t('search.scopeAll'),
      }
      const scope = (this && this.route && this.route.params && this.route.params.scope) || ''
      const scopeText: string = scopeMap[scope] || t('search.scopeCourses')
      return `${t('search.title')} - ${scopeText}`
    },
    keepAlive: true,
    cacheKey: 'search',
  },
}
```

### 权限控制

```typescript
{
  path: '/user',
  component: UserView,
  meta: { title: '用户中心', requiresAuth: true },
},
{
  path: '/admin/translation',
  component: () => import('@/views/admin/AdminTranslationView.vue'),
  meta: { title: '翻译管理', requiresAdmin: true },
},
```

## 路由守卫

### 全局前置守卫

```typescript
// 路由守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - WHU.sb`
  }
  next()
})

// 路由守卫：未登录或无权限跳转到登录页
router.beforeEach((to, _from, next) => {
  // 排除不需要权限检查的页面
  const publicPaths = ['/auth/login', '/auth/register', '/admin/login']
  if (publicPaths.includes(to.path)) {
    next()
    return
  }

  // 检查是否是管理员路径
  if (to.path.startsWith('/admin')) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      next({ path: '/auth/login', query: { redirect: to.fullPath } })
      return
    }
    next()
  } else if (to.meta.requiresAdmin) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      next({ path: '/auth/login', query: { redirect: to.fullPath } })
      return
    }
    next()
  } else if (to.meta.requiresAuth) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      next({ path: '/auth/login', query: { redirect: to.fullPath } })
      return
    }
    next()
  } else {
    next()
  }
})
```

### 路由独享守卫

```typescript
{
  path: '/search/:scope',
  component: SearchView,
  beforeEnter: (to: any, _from: any, next: any) => {
    const validScopes = ['courses', 'teachers', 'reviews', 'all']
    const scope = to.params.scope as string | undefined
    if (!scope || validScopes.includes(scope)) {
      next()
    } else {
      next({ path: '/search/courses', query: to.query })
    }
  },
},
{
  path: '/teapot',
  name: 'Teapot',
  component: () => import('@/views/TeapotView.vue'),
  meta: { title: "I'm a Teapot" },
  beforeEnter: (_to: any, _from: any, next: any) => {
    // 检查是否有特殊状态码信息
    const specialStatusInfo = (window as any).__SPECIAL_STATUS_INFO__
    if (specialStatusInfo && specialStatusInfo.status === 418) {
      // 如果有418状态码信息，确保页面正确显示
      document.title = "I'm a Teapot - WHU.sb"
    }
    next()
  },
},
```

## 错误处理

### 全局错误处理

```typescript
// 全局错误处理
router.onError((error) => {
  console.error('Router error:', error)

  // 如果是组件加载失败，重定向到404页面
  if (error.message.includes('Loading chunk') || error.message.includes('Loading CSS chunk')) {
    router.push({ name: 'NotFound' })
  }
})
```

### 404 路由

```typescript
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/ErrorView.vue'),
  props: (route: any) => ({
    code: (window as any).__GLOBAL_ERROR__?.status || 404,
    originalPath: (window as any).__GLOBAL_ERROR__?.path || route.path,
  }),
  meta: { title: '页面未找到' },
},
```

## 在组件中使用路由

### 编程式导航

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 导航到指定路由
const goToCourse = (courseId: string) => {
  router.push(`/courses/${courseId}`)
}

// 带参数的导航
const goToSearch = (query: string) => {
  router.push({
    path: '/search/courses',
    query: { q: query }
  })
}

// 替换当前路由
const replaceRoute = () => {
  router.replace('/new-path')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>
```

### 路由参数

```vue
<template>
  <div>
    <h1>课程详情: {{ courseId }}</h1>
    <p>教师ID: {{ teacherId }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 获取路由参数
const courseId = computed(() => route.params.uid as string)
const teacherId = computed(() => route.params.teacherUid as string)

// 获取查询参数
const searchQuery = computed(() => route.query.q as string)
</script>
```

### 路由链接

```vue
<template>
  <div>
    <!-- 基础链接 -->
    <router-link to="/">首页</router-link>
    
    <!-- 带参数的链接 -->
    <router-link :to="`/courses/${course.id}`">
      {{ course.name }}
    </router-link>
    
    <!-- 带查询参数的链接 -->
    <router-link :to="{ path: '/search', query: { q: searchTerm } }">
      搜索
    </router-link>
    
    <!-- 命名路由 -->
    <router-link :to="{ name: 'teacher-detail', params: { id: teacher.id } }">
      {{ teacher.name }}
    </router-link>
  </div>
</template>
```

## 路由缓存

### Keep-Alive 配置

```typescript
{
  path: '/search/:scope',
  component: SearchView,
  meta: {
    keepAlive: true,
    cacheKey: 'search',
  },
},
{
  path: '/reviews',
  component: ReviewsView,
  meta: {
    title: '评价列表',
    keepAlive: true,
    cacheKey: 'reviews',
  },
},
```

### 在 App.vue 中使用

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.meta.cacheKey || route.path" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const cachedViews = computed(() => {
  // 根据路由 meta 决定是否缓存
  return route.meta.keepAlive ? [route.meta.cacheKey || route.name] : []
})
</script>
```

## 路由权限控制

### 权限检查函数

```typescript
// 检查用户权限
function checkPermission(requiredRole: 'user' | 'admin'): boolean {
  const userToken = localStorage.getItem('auth_token')
  const adminToken = localStorage.getItem('admin_token')
  
  if (requiredRole === 'admin') {
    return !!adminToken
  }
  
  return !!userToken || !!adminToken
}

// 权限守卫
function authGuard(to: any, from: any, next: any) {
  if (to.meta.requiresAuth && !checkPermission('user')) {
    next({ path: '/auth/login', query: { redirect: to.fullPath } })
    return
  }
  
  if (to.meta.requiresAdmin && !checkPermission('admin')) {
    next({ path: '/auth/login', query: { redirect: to.fullPath } })
    return
  }
  
  next()
}
```

### 动态路由

```typescript
// 根据用户权限动态添加路由
function addDynamicRoutes(userRole: string) {
  if (userRole === 'admin') {
    router.addRoute({
      path: '/admin/dashboard',
      component: () => import('@/views/admin/DashboardView.vue'),
      meta: { requiresAdmin: true }
    })
  }
}
```

## 路由性能优化

### 预加载

```typescript
// 预加载重要路由
function preloadRoutes() {
  // 预加载首页
  import('@/views/HomeView.vue')
  
  // 预加载搜索页面
  import('@/views/SearchView.vue')
}
```

### 路由分割

```typescript
// 按功能模块分割路由
const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'users',
        component: () => import('@/views/admin/UsersView.vue'),
      },
    ],
  },
]
```

## 路由测试

### 单元测试

```typescript
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import App from '@/App.vue'

describe('Router', () => {
  it('should navigate to home page', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          component: { template: '<div>Home</div>' }
        }
      ]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await router.push('/')
    await router.isReady()

    expect(wrapper.text()).toContain('Home')
  })
})
```

---

**提示**: 路由管理采用模块化设计，支持懒加载和权限控制，确保应用性能和安全性。
