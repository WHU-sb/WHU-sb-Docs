# 前端技术栈详解

## 概述

WHU.sb 前端采用现代化的技术栈，基于 Vue 3 生态系统构建。本文档不仅介绍技术栈的组成，更重要的是说明如何在项目中实际使用这些技术，以及相关的配置和最佳实践。

## 核心技术栈

### Vue 3.5.18 - 渐进式 JavaScript 框架

**选择原因**: Vue 3 提供了更好的性能、TypeScript 支持和组合式 API，适合构建大型应用。

**实际应用场景**:

#### 组合式 API 的使用

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from '@/stores/course'

// 响应式数据
const searchQuery = ref('')
const loading = ref(false)

// 计算属性
const filteredCourses = computed(() => {
  const courses = useCourseStore().courses
  if (!searchQuery.value) return courses
  
  return courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 生命周期钩子
onMounted(async () => {
  loading.value = true
  try {
    await useCourseStore().fetchCourses()
  } finally {
    loading.value = false
  }
})

// 方法
const handleSearch = (query: string) => {
  searchQuery.value = query
}
</script>
```

#### 响应式系统的实际应用

```vue
<template>
  <div class="course-list">
    <!-- 响应式数据绑定 -->
    <div v-if="loading" class="loading-skeleton">
      <AppSkeleton v-for="i in 6" :key="i" height="120px" />
    </div>
    
    <div v-else-if="filteredCourses.length === 0" class="empty-state">
      <i class="pi pi-search" style="font-size: 3rem; color: var(--text-color-secondary)"></i>
      <p>未找到相关课程</p>
    </div>
    
    <div v-else class="courses-grid">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
        @click="handleCourseClick"
      />
    </div>
  </div>
</template>
```

### TypeScript 5.9.2 - 类型安全的 JavaScript 超集

**选择原因**: 提供静态类型检查，提高代码质量和开发效率。

**实际应用场景**:

#### 类型定义和接口

```typescript
// src/types/course.ts
export interface Course {
  id: string
  name: string
  code: string
  teacher: string
  credits: number
  rating: number
  reviewCount: number
  description: string
  tags: string[]
  schedule: CourseSchedule[]
  createdAt: string
  updatedAt: string
}

export interface CourseSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
  startTime: string
  endTime: string
  location: string
}

export interface CourseFilter {
  search?: string
  category?: string
  teacher?: string
  minRating?: number
  tags?: string[]
  page: number
  pageSize: number
  sortBy?: 'name' | 'rating' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}
```

#### 泛型和工具类型的使用

```typescript
// src/utils/api.ts
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  meta?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 泛型 API 请求函数
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// 使用示例
const courses = await apiRequest<Course[]>('/api/courses')
const course = await apiRequest<Course>(`/api/courses/${id}`)
```

### Vite 7.1.1 - 下一代前端构建工具

**选择原因**: 快速的开发服务器启动和热重载，优秀的构建性能。

**实际配置和优化**:

#### 开发环境配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'primevue-vendor': ['primevue', 'primeflex', 'primeicons'],
          'utils': ['axios', 'crypto-js', 'nanoid']
        }
      }
    }
  }
})
```

#### 环境变量配置

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_DEV_MODE=true
VITE_ENABLE_DEVTOOLS=true

# .env.production
VITE_API_BASE_URL=https://api.whu.sb/api/v1
VITE_ENABLE_ANALYTICS=true
```

## UI 框架和组件库

### PrimeVue 4.3.7 - 企业级 UI 组件库

**选择原因**: 丰富的组件库、良好的 TypeScript 支持、现代化的设计。

**实际使用场景**:

#### 组件封装和定制

```vue
<!-- src/components/ui/AppDataTable.vue -->
<template>
  <DataTable
    :value="data"
    :loading="loading"
    :paginator="true"
    :rows="pageSize"
    :total-records="total"
    :lazy="true"
    :sort-field="sortField"
    :sort-order="sortOrder"
    :filters="filters"
    filter-display="menu"
    :global-filter-fields="globalFilterFields"
    @page="onPageChange"
    @sort="onSort"
    @filter="onFilter"
  >
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <h5 class="m-0">{{ title }}</h5>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="globalFilter"
            placeholder="搜索..."
            class="w-20rem"
          />
        </span>
      </div>
    </template>
    
    <template #empty>
      <div class="text-center py-4">
        <i class="pi pi-inbox" style="font-size: 3rem; color: var(--text-color-secondary)"></i>
        <p class="text-color-secondary">暂无数据</p>
      </div>
    </template>
    
    <template #loading>
      <div class="text-center py-4">
        <ProgressSpinner />
        <p class="text-color-secondary">加载中...</p>
      </div>
    </template>
    
    <slot />
  </DataTable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'

interface Props {
  data: any[]
  loading?: boolean
  title?: string
  pageSize?: number
  total?: number
  sortField?: string
  sortOrder?: number
  filters?: any
  globalFilterFields?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: '数据表格',
  pageSize: 20,
  total: 0,
  globalFilterFields: []
})

const emit = defineEmits<{
  page: [event: any]
  sort: [event: any]
  filter: [event: any]
}>()

const globalFilter = ref('')

const onPageChange = (event: any) => {
  emit('page', event)
}

const onSort = (event: any) => {
  emit('sort', event)
}

const onFilter = (event: any) => {
  emit('filter', event)
}

// 监听全局搜索
watch(globalFilter, (newValue) => {
  // 实现全局搜索逻辑
})
</script>
```

#### 主题定制

```scss
// src/assets/styles/primevue-custom.scss
// 自定义 PrimeVue 主题变量
:root {
  --primary-color: #3b82f6;
  --primary-color-text: #ffffff;
  --surface-ground: #f8fafc;
  --surface-section: #ffffff;
  --surface-card: #ffffff;
  --surface-overlay: #ffffff;
  --surface-border: #e2e8f0;
  --surface-hover: #f1f5f9;
  --text-color: #1e293b;
  --text-color-secondary: #64748b;
  --border-radius: 0.5rem;
  --focus-ring: 0 0 0 0.2rem rgba(59, 130, 246, 0.2);
}

// 自定义组件样式
.p-datatable {
  .p-datatable-header {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-bottom: none;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }
  
  .p-datatable-thead > tr > th {
    background: var(--surface-ground);
    border: 1px solid var(--surface-border);
    font-weight: 600;
  }
  
  .p-datatable-tbody > tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background: var(--surface-hover);
    }
  }
}

.p-button {
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:focus {
    box-shadow: var(--focus-ring);
  }
}
```

### PrimeFlex 4.0.0 - CSS 工具类库

**实际应用场景**:

```vue
<template>
  <!-- 响应式布局 -->
  <div class="grid">
    <div class="col-12 md:col-6 lg:col-4">
      <CourseCard :course="course" />
    </div>
  </div>
  
  <!-- Flexbox 布局 -->
  <div class="flex justify-content-between align-items-center">
    <h2>课程列表</h2>
    <AppButton label="添加课程" icon="pi pi-plus" />
  </div>
  
  <!-- 间距和尺寸 -->
  <div class="p-4 m-2">
    <div class="w-full h-20rem bg-primary-50 border-round">
      内容区域
    </div>
  </div>
  
  <!-- 文本样式 -->
  <p class="text-lg font-semibold text-primary mb-3">
    重要信息
  </p>
</template>
```

## 状态管理

### Pinia 3.0.3 - Vue 3 官方推荐的状态管理库

**选择原因**: 轻量级、TypeScript 友好、组合式 API 支持。

**实际应用场景**:

#### Store 定义和使用

```typescript
// src/stores/course.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Course, CourseFilter } from '@/types/course'
import { apiRequest } from '@/utils/api'

export const useCourseStore = defineStore('course', () => {
  // 状态
  const courses = ref<Course[]>([])
  const currentCourse = ref<Course | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<CourseFilter>({
    page: 1,
    pageSize: 20
  })

  // 计算属性
  const totalCourses = computed(() => courses.value.length)
  const favoriteCourses = computed(() => 
    courses.value.filter(course => course.isFavorite)
  )

  // 动作
  const fetchCourses = async (newFilters?: Partial<CourseFilter>) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedFilters = { ...filters.value, ...newFilters }
      const response = await apiRequest<Course[]>('/courses', {
        method: 'GET',
        params: updatedFilters
      })
      
      courses.value = response.data
      filters.value = updatedFilters
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取课程失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCourseById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiRequest<Course>(`/courses/${id}`)
      currentCourse.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取课程详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = async (courseId: string) => {
    try {
      await apiRequest(`/courses/${courseId}/favorite`, {
        method: 'POST'
      })
      
      // 更新本地状态
      const course = courses.value.find(c => c.id === courseId)
      if (course) {
        course.isFavorite = !course.isFavorite
      }
      
      if (currentCourse.value?.id === courseId) {
        currentCourse.value.isFavorite = !currentCourse.value.isFavorite
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '操作失败'
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    courses: readonly(courses),
    currentCourse: readonly(currentCourse),
    loading: readonly(loading),
    error: readonly(error),
    filters: readonly(filters),
    
    // 计算属性
    totalCourses,
    favoriteCourses,
    
    // 动作
    fetchCourses,
    fetchCourseById,
    toggleFavorite,
    clearError
  }
})
```

#### 在组件中使用 Store

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useCourseStore } from '@/stores/course'
import { storeToRefs } from 'pinia'

const courseStore = useCourseStore()

// 使用 storeToRefs 保持响应性
const { courses, loading, error } = storeToRefs(courseStore)

onMounted(async () => {
  try {
    await courseStore.fetchCourses()
  } catch (err) {
    console.error('Failed to fetch courses:', err)
  }
})

const handleFavorite = async (courseId: string) => {
  try {
    await courseStore.toggleFavorite(courseId)
  } catch (err) {
    console.error('Failed to toggle favorite:', err)
  }
}
</script>
```

## 路由管理

### Vue Router 4.5.1 - Vue 官方路由管理器

**实际应用场景**:

#### 路由配置

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('@/views/Courses.vue'),
    meta: {
      title: '课程列表',
      requiresAuth: false
    }
  },
  {
    path: '/courses/:id',
    name: 'CourseDetail',
    component: () => import('@/views/CourseDetail.vue'),
    props: true,
    meta: {
      title: '课程详情',
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      title: '个人中心',
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: {
      title: '管理后台',
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - WHU.sb`
  }
  
  // 检查认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // 检查管理员权限
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Forbidden' })
    return
  }
  
  next()
})

export default router
```

#### 路由参数和查询

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'

const route = useRoute()
const router = useRouter()

// 获取路由参数
const courseId = computed(() => route.params.id as string)

// 获取查询参数
const searchQuery = computed(() => route.query.search as string || '')
const currentPage = computed(() => parseInt(route.query.page as string) || 1)

// 监听参数变化
watch(searchQuery, (newQuery) => {
  // 更新搜索逻辑
})

// 编程式导航
const navigateToCourse = (id: string) => {
  router.push({ name: 'CourseDetail', params: { id } })
}

const updateSearch = (query: string) => {
  router.push({
    name: 'Courses',
    query: { 
      ...route.query,
      search: query,
      page: 1 // 重置页码
    }
  })
}

const goToPage = (page: number) => {
  router.push({
    name: 'Courses',
    query: { 
      ...route.query,
      page: page.toString()
    }
  })
}
</script>
```

## 国际化

### Vue I18n 11.1.11 - Vue 国际化插件

**实际应用场景**:

#### 配置和消息定义

```typescript
// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  }
})

export default i18n
```

```json
// src/i18n/locales/zh.json
{
  "common": {
    "loading": "加载中...",
    "error": "发生错误",
    "success": "操作成功",
    "cancel": "取消",
    "confirm": "确认",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑",
    "search": "搜索",
    "filter": "筛选"
  },
  "course": {
    "title": "课程",
    "list": "课程列表",
    "detail": "课程详情",
    "name": "课程名称",
    "teacher": "授课教师",
    "credits": "学分",
    "rating": "评分",
    "reviews": "评价",
    "description": "课程描述",
    "schedule": "课程安排",
    "tags": "标签",
    "favorite": "收藏",
    "unfavorite": "取消收藏",
    "share": "分享",
    "enroll": "选课",
    "unenroll": "退课"
  },
  "validation": {
    "required": "{field} 是必填项",
    "minLength": "{field} 最少需要 {min} 个字符",
    "maxLength": "{field} 最多只能有 {max} 个字符",
    "email": "请输入有效的邮箱地址",
    "url": "请输入有效的网址"
  }
}
```

#### 在组件中使用

```vue
<template>
  <div class="course-page">
    <h1>{{ $t('course.list') }}</h1>
    
    <div class="search-section">
      <InputText
        v-model="searchQuery"
        :placeholder="$t('common.search')"
        class="w-full"
      />
    </div>
    
    <div v-if="loading" class="loading">
      {{ $t('common.loading') }}
    </div>
    
    <div v-else class="courses-grid">
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
        @favorite="handleFavorite"
      />
    </div>
    
    <div v-if="error" class="error">
      {{ $t('common.error') }}: {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 动态切换语言
const switchLanguage = (lang: 'zh' | 'en') => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

// 格式化消息
const formatMessage = (key: string, params: Record<string, any>) => {
  return t(key, params)
}

// 使用示例
const validationMessage = formatMessage('validation.required', { field: '课程名称' })
</script>
```

## HTTP 客户端

### Axios 1.11.0 - HTTP 请求库

**实际应用场景**:

#### 配置和拦截器

```typescript
// src/services/api.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const authStore = useAuthStore()
    
    // 添加认证头
    if (authStore.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authStore.token}`
      }
    }
    
    // 添加请求 ID 用于追踪
    config.headers = {
      ...config.headers,
      'X-Request-ID': crypto.randomUUID()
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    const toast = useToast()
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未认证，跳转到登录页
          const authStore = useAuthStore()
          authStore.logout()
          window.location.href = '/login'
          break
          
        case 403:
          toast.add({
            severity: 'error',
            summary: '权限不足',
            detail: '您没有权限执行此操作',
            life: 3000
          })
          break
          
        case 404:
          toast.add({
            severity: 'warn',
            summary: '资源不存在',
            detail: '请求的资源不存在',
            life: 3000
          })
          break
          
        case 500:
          toast.add({
            severity: 'error',
            summary: '服务器错误',
            detail: '服务器内部错误，请稍后重试',
            life: 3000
          })
          break
          
        default:
          toast.add({
            severity: 'error',
            summary: '请求失败',
            detail: data.message || '未知错误',
            life: 3000
          })
      }
    } else if (error.request) {
      // 网络错误
      toast.add({
        severity: 'error',
        summary: '网络错误',
        detail: '请检查网络连接',
        life: 3000
      })
    }
    
    return Promise.reject(error)
  }
)

export default api
```

#### API 服务封装

```typescript
// src/services/courseService.ts
import api from './api'
import type { Course, CourseFilter, CreateCourseRequest } from '@/types/course'

export class CourseService {
  // 获取课程列表
  static async getCourses(filter: CourseFilter) {
    const response = await api.get('/courses', { params: filter })
    return response.data
  }
  
  // 获取课程详情
  static async getCourseById(id: string) {
    const response = await api.get(`/courses/${id}`)
    return response.data
  }
  
  // 创建课程
  static async createCourse(data: CreateCourseRequest) {
    const response = await api.post('/courses', data)
    return response.data
  }
  
  // 更新课程
  static async updateCourse(id: string, data: Partial<Course>) {
    const response = await api.put(`/courses/${id}`, data)
    return response.data
  }
  
  // 删除课程
  static async deleteCourse(id: string) {
    await api.delete(`/courses/${id}`)
  }
  
  // 收藏/取消收藏课程
  static async toggleFavorite(id: string) {
    const response = await api.post(`/courses/${id}/favorite`)
    return response.data
  }
  
  // 上传课程图片
  static async uploadImage(id: string, file: File) {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await api.post(`/courses/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}
```

## 开发工具和构建优化

### ESLint 9.33.0 - 代码质量检查

**配置示例**:

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn'
  }
}
```

### 测试框架配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

## 性能优化策略

### 代码分割和懒加载

```typescript
// 路由懒加载
const routes = [
  {
    path: '/courses',
    component: () => import('@/views/Courses.vue')
  }
]

// 组件懒加载
const HeavyComponent = defineAsyncComponent(() => 
  import('@/components/HeavyComponent.vue')
)
```

### 缓存策略

```typescript
// 使用 keep-alive 缓存组件
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['CourseList', 'CourseDetail']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```

## 总结

WHU.sb 前端技术栈的选择基于以下考虑：

1. **现代化**: 使用最新的稳定版本，确保长期维护
2. **性能**: 选择高性能的框架和工具
3. **开发体验**: 提供良好的 TypeScript 支持和开发工具
4. **生态系统**: 选择有活跃社区和丰富生态的技术
5. **可维护性**: 注重代码质量和可维护性

通过合理配置和使用这些技术，我们能够构建出高性能、易维护的前端应用。

