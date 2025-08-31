# 状态管理

## 概述

WHU.sb 前端使用 Pinia 作为状态管理库，采用 Vue 3 组合式 API 风格，按业务功能模块化组织状态。

## 状态管理架构

### Store 组织结构

```
stores/
├── courses.ts      # 课程相关状态
├── reviews.ts      # 评价相关状态
├── teachers.ts     # 教师相关状态
├── search.ts       # 搜索相关状态
├── admin.ts        # 管理员相关状态
├── ham.ts          # HAM相关状态
├── random.ts       # 随机功能状态
└── translation.ts  # 翻译相关状态
```

### 核心概念

- **Store**: 每个业务模块对应一个 store
- **State**: 响应式状态数据
- **Getters**: 计算属性
- **Actions**: 异步操作和状态修改

## 课程状态管理

### useCourseStore

管理课程相关的所有状态和操作：

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiGateway, type Course, type Review, type Teacher } from '@/services/api-gateway'

export const useCourseStore = defineStore('courses', () => {
  // 状态定义
  const courses = ref<Array<Course | Review | Teacher>>([])
  const currentCourse = ref<Course | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
  })

  // 搜索缓存
  const searchCache = ref<{
    query: string
    page: number
    limit: number
    results: Array<Course | Review | Teacher>
    total: number
    timestamp: number
  } | null>(null)

  // 计算属性
  const totalPages = computed(() => 
    Math.ceil(pagination.value.total / pagination.value.limit)
  )

  // 异步操作
  async function fetchCourses(page = 1, limit = 20) {
    loading.value = true
    error.value = null
    try {
      const response = await apiGateway.getCourses(page, limit)
      courses.value = response.data || response.courses || []
      pagination.value = {
        page: response.page || 1,
        limit: response.limit || 20,
        total: response.total || 0,
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取课程列表失败'
      console.error('Error fetching courses:', error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchCourse(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await apiGateway.getCourse(id)
      currentCourse.value = res.data || res.course || res || null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取课程详情失败'
      console.error('Error fetching course:', err)
    } finally {
      loading.value = false
    }
  }

  // 搜索功能
  async function searchCourses(query: string, page = 1, limit = 20) {
    // 检查缓存
    if (searchCache.value && 
        searchCache.value.query === query &&
        searchCache.value.page === page &&
        searchCache.value.limit === limit &&
        Date.now() - searchCache.value.timestamp < 5 * 60 * 1000) {
      courses.value = searchCache.value.results
      pagination.value.total = searchCache.value.total
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await apiGateway.searchCourses(query, page, limit)
      courses.value = response.data || []
      pagination.value = {
        page: response.page || page,
        limit: response.limit || limit,
        total: response.total || 0,
      }

      // 更新缓存
      searchCache.value = {
        query,
        page,
        limit,
        results: courses.value,
        total: pagination.value.total,
        timestamp: Date.now(),
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '搜索课程失败'
      console.error('Error searching courses:', error.value)
    } finally {
      loading.value = false
    }
  }

  // 状态重置
  function resetState() {
    courses.value = []
    currentCourse.value = null
    loading.value = false
    error.value = null
    pagination.value = { page: 1, limit: 20, total: 0 }
    searchCache.value = null
  }

  return {
    // 状态
    courses,
    currentCourse,
    loading,
    error,
    pagination,
    searchCache,
    
    // 计算属性
    totalPages,
    
    // 操作
    fetchCourses,
    fetchCourse,
    searchCourses,
    resetState,
  }
})
```

## 评价状态管理

### useReviewStore

管理评价相关的状态和操作：

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiGateway, type Review, type PaginatedResponse } from '@/services/api-gateway'

export const useReviewStore = defineStore('reviews', () => {
  // 状态定义
  const reviews = ref<Review[]>([])
  const currentReview = ref<Review | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
  })

  // 计算属性
  const totalPages = computed(() => 
    Math.ceil(pagination.value.total / pagination.value.limit)
  )

  // 异步操作
  async function fetchReviews(courseId?: number, page = 1, limit = 20) {
    loading.value = true
    error.value = null
    try {
      const response: PaginatedResponse<Review> = await apiGateway.getReviews(courseId, page, limit)
      reviews.value = response.data || []
      pagination.value = {
        page: response.page || page,
        limit: response.limit || limit,
        total: response.total || 0,
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取评价列表失败'
      console.error('Error fetching reviews:', error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchReview(id: number) {
    loading.value = true
    error.value = null
    try {
      currentReview.value = await apiGateway.getReview(id)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取评价详情失败'
      console.error('Error fetching review:', err)
    } finally {
      loading.value = false
    }
  }

  // 高级搜索
  async function searchReviews(
    params: {
      query?: string
      course_id?: string
      teacher_id?: string
      min_rating?: number
      sort?: string
      limit?: number
      offset?: number
    },
    page = 1,
    limit = 20,
  ) {
    loading.value = true
    error.value = null
    try {
      const response = await apiGateway.searchReviews(params, page, limit)
      reviews.value = response.data || []
      pagination.value = {
        page: response.page || page,
        limit: response.limit || limit,
        total: response.total || 0,
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '搜索评价失败'
      console.error('Error searching reviews:', error.value)
    } finally {
      loading.value = false
    }
  }

  // 提交评价
  async function submitReview(reviewData: Partial<Review>) {
    loading.value = true
    error.value = null
    try {
      const response = await apiGateway.submitReview(reviewData)
      // 刷新评价列表
      await fetchReviews(reviewData.course_id)
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '提交评价失败'
      console.error('Error submitting review:', error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    reviews,
    currentReview,
    loading,
    error,
    pagination,
    
    // 计算属性
    totalPages,
    
    // 操作
    fetchReviews,
    fetchReview,
    searchReviews,
    submitReview,
  }
})
```

## 搜索状态管理

### useSearchStore

管理全局搜索状态：

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSearchStore = defineStore('search', () => {
  // 搜索状态
  const searchQuery = ref('')
  const searchHistory = ref<string[]>([])
  const searchFilters = ref({
    type: 'all', // all, courses, teachers, reviews
    sort: 'relevance', // relevance, rating, date
    minRating: 0,
  })

  // 搜索建议
  const suggestions = ref<string[]>([])
  const showSuggestions = ref(false)

  // 计算属性
  const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0)
  const recentSearches = computed(() => searchHistory.value.slice(0, 5))

  // 搜索操作
  function setSearchQuery(query: string) {
    searchQuery.value = query
    if (query.trim()) {
      addToHistory(query.trim())
    }
  }

  function addToHistory(query: string) {
    const index = searchHistory.value.indexOf(query)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
    }
    searchHistory.value.unshift(query)
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
  }

  function clearSearchHistory() {
    searchHistory.value = []
  }

  function setSearchFilters(filters: Partial<typeof searchFilters.value>) {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  function resetSearch() {
    searchQuery.value = ''
    suggestions.value = []
    showSuggestions.value = false
  }

  return {
    // 状态
    searchQuery,
    searchHistory,
    searchFilters,
    suggestions,
    showSuggestions,
    
    // 计算属性
    hasSearchQuery,
    recentSearches,
    
    // 操作
    setSearchQuery,
    addToHistory,
    clearSearchHistory,
    setSearchFilters,
    resetSearch,
  }
})
```

## 在组件中使用 Store

### 基础用法

```vue
<template>
  <div>
    <div v-if="courseStore.loading">加载中...</div>
    <div v-else-if="courseStore.error">{{ courseStore.error }}</div>
    <div v-else>
      <div v-for="course in courseStore.courses" :key="course.id">
        {{ course.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCourseStore } from '@/stores/courses'

const courseStore = useCourseStore()

onMounted(() => {
  courseStore.fetchCourses()
})
</script>
```

### 组合使用多个 Store

```vue
<template>
  <div>
    <!-- 搜索框 -->
    <input 
      v-model="searchStore.searchQuery"
      @input="handleSearch"
      placeholder="搜索课程或教师..."
    />
    
    <!-- 搜索结果 -->
    <div v-if="courseStore.loading">搜索中...</div>
    <div v-else>
      <div v-for="item in courseStore.courses" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useCourseStore } from '@/stores/courses'
import { useSearchStore } from '@/stores/search'

const courseStore = useCourseStore()
const searchStore = useSearchStore()

// 监听搜索查询变化
watch(
  () => searchStore.searchQuery,
  (newQuery) => {
    if (newQuery.trim()) {
      courseStore.searchCourses(newQuery)
    } else {
      courseStore.fetchCourses()
    }
  },
  { debounce: 300 }
)

const handleSearch = () => {
  searchStore.setSearchQuery(searchStore.searchQuery)
}
</script>
```

## Store 间通信

### 跨 Store 调用

```typescript
// 在 courseStore 中调用 reviewStore
async function fetchCourseWithReviews(id: number) {
  await fetchCourse(id)
  
  if (currentCourse.value) {
    // 动态导入 reviewStore
    const { useReviewStore } = await import('@/stores/reviews')
    const reviewStore = useReviewStore()
    await reviewStore.fetchReviews(currentCourse.value.id)
  }
}
```

### 状态同步

```typescript
// 在 reviewStore 中同步课程数据
async function submitReview(reviewData: Partial<Review>) {
  const response = await apiGateway.submitReview(reviewData)
  
  // 同步到课程 store
  const { useCourseStore } = await import('@/stores/courses')
  const courseStore = useCourseStore()
  
  if (courseStore.currentCourse?.id === reviewData.course_id) {
    await courseStore.fetchCourse(courseStore.currentCourse.id)
  }
  
  return response
}
```

## 状态持久化

### 本地存储

```typescript
import { useLocalStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  // 持久化用户偏好设置
  const preferences = useLocalStorage('user-preferences', {
    theme: 'light',
    language: 'zh-CN',
    notifications: true,
  })

  function updatePreferences(newPrefs: Partial<typeof preferences.value>) {
    preferences.value = { ...preferences.value, ...newPrefs }
  }

  return {
    preferences,
    updatePreferences,
  }
})
```

### 会话存储

```typescript
import { useSessionStorage } from '@vueuse/core'

export const useSearchStore = defineStore('search', () => {
  // 会话级别的搜索历史
  const searchHistory = useSessionStorage('search-history', [] as string[])

  function addToHistory(query: string) {
    if (!searchHistory.value.includes(query)) {
      searchHistory.value.unshift(query)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
    }
  }

  return {
    searchHistory,
    addToHistory,
  }
})
```

## 性能优化

### 状态缓存

```typescript
// 实现简单的缓存机制
const cache = new Map<string, { data: any; timestamp: number }>()

async function fetchWithCache(key: string, fetcher: () => Promise<any>, ttl = 5 * 60 * 1000) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }

  const data = await fetcher()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

### 懒加载 Store

```typescript
// 按需加载 store
export async function useLazyCourseStore() {
  const { useCourseStore } = await import('@/stores/courses')
  return useCourseStore()
}
```

## 错误处理

### 统一错误处理

```typescript
// 在 store 中统一处理错误
async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
  try {
    return await apiCall()
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '操作失败'
    error.value = errorMessage
    
    // 记录错误日志
    console.error('API Error:', err)
    
    // 显示用户友好的错误信息
    // 这里可以集成 toast 通知系统
    
    return null
  }
}
```

### 错误恢复

```typescript
// 提供重试机制
async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetcher()
    } catch (err) {
      if (i === maxRetries - 1) throw err
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
  throw new Error('Max retries exceeded')
}
```

## 测试 Store

### 单元测试

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCourseStore } from '@/stores/courses'

describe('Course Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should fetch courses', async () => {
    const store = useCourseStore()
    
    // Mock API call
    vi.spyOn(apiGateway, 'getCourses').mockResolvedValue({
      data: [{ id: 1, name: 'Test Course' }],
      total: 1,
      page: 1,
      limit: 20,
    })

    await store.fetchCourses()
    
    expect(store.courses).toHaveLength(1)
    expect(store.courses[0].name).toBe('Test Course')
    expect(store.loading).toBe(false)
  })

  it('should handle errors', async () => {
    const store = useCourseStore()
    
    vi.spyOn(apiGateway, 'getCourses').mockRejectedValue(
      new Error('Network error')
    )

    await store.fetchCourses()
    
    expect(store.error).toBe('Network error')
    expect(store.loading).toBe(false)
  })
})
```

---

**提示**: 状态管理采用模块化设计，每个 store 职责单一，便于维护和测试。
