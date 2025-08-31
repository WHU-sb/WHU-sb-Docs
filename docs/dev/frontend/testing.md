# 前端测试指南

WHU.sb 前端项目使用 Vitest 作为测试框架，结合 Vue Test Utils 进行组件测试。本文档介绍测试策略、工具配置和最佳实践。

## 🧪 测试策略

### 测试金字塔

我们采用测试金字塔策略，确保测试覆盖的全面性：

```
    E2E Tests (少量)
       /    \
   Integration Tests (适量)
      /      \
  Unit Tests (大量)
```

- **单元测试**: 测试独立的组件和函数
- **集成测试**: 测试组件间的交互
- **E2E测试**: 测试完整的用户流程

### 测试覆盖目标

- **单元测试覆盖率**: 80%+
- **关键业务逻辑**: 100%覆盖
- **公共组件**: 100%覆盖

## 🛠️ 测试工具配置

### Vitest 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'test-setup.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

### 测试环境设置

```typescript
// test-setup.ts
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// 全局模拟
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟 IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟 matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// 配置 Vue Test Utils
config.global.stubs = {
  'router-link': true,
  'router-view': true,
}
```

## 📝 单元测试示例

### 组件测试

#### 基础组件测试

```typescript
// __tests__/components/AppButton.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppButton from '@/components/ui/AppButton.vue'

describe('AppButton', () => {
  it('renders correctly with label', () => {
    const wrapper = mount(AppButton, {
      props: {
        label: '测试按钮'
      }
    })
    
    expect(wrapper.text()).toContain('测试按钮')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(AppButton)
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('applies correct severity class', () => {
    const wrapper = mount(AppButton, {
      props: {
        severity: 'success'
      }
    })
    
    expect(wrapper.find('button').classes()).toContain('p-button-success')
  })

  it('shows loading state', () => {
    const wrapper = mount(AppButton, {
      props: {
        loading: true
      }
    })
    
    expect(wrapper.find('.p-button-loading').exists()).toBe(true)
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('renders icon when provided', () => {
    const wrapper = mount(AppButton, {
      props: {
        icon: 'pi pi-check'
      }
    })
    
    expect(wrapper.find('.pi-check').exists()).toBe(true)
  })
})
```

#### 复杂组件测试

```typescript
// __tests__/components/CourseCard.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import CourseCard from '@/components/features/course/CourseCard.vue'

// 模拟 store
vi.mock('@/stores/course', () => ({
  useCourseStore: () => ({
    toggleFavorite: vi.fn()
  })
}))

vi.mock('@/stores/user', () => ({
  useUserStore: () => ({
    favoriteCourses: []
  })
}))

describe('CourseCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockCourse = {
    id: '1',
    name: '数据结构与算法',
    code: 'CS101',
    credits: 4,
    description: '本课程介绍基本的数据结构和算法...',
    rating: 4.5,
    reviewCount: 128
  }

  it('renders course information correctly', () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse
      }
    })
    
    expect(wrapper.find('.course-card__title').text()).toBe('数据结构与算法')
    expect(wrapper.find('.course-card__code').text()).toBe('CS101')
    expect(wrapper.find('.course-card__credits').text()).toBe('4学分')
    expect(wrapper.find('.course-card__description').text()).toBe('本课程介绍基本的数据结构和算法...')
  })

  it('displays rating and review count', () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse
      }
    })
    
    expect(wrapper.find('.stat-item').text()).toContain('4.5')
    expect(wrapper.text()).toContain('128条评价')
  })

  it('emits viewDetails event when view button is clicked', async () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse
      }
    })
    
    await wrapper.find('button[label="查看详情"]').trigger('click')
    
    expect(wrapper.emitted('viewDetails')).toBeTruthy()
    expect(wrapper.emitted('viewDetails')[0]).toEqual(['1'])
  })

  it('shows loading state when loading prop is true', () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse,
        loading: true
      }
    })
    
    expect(wrapper.find('.course-card--loading').exists()).toBe(true)
  })

  it('handles favorite toggle correctly', async () => {
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse
      }
    })
    
    await wrapper.find('button[label="收藏"]').trigger('click')
    
    expect(wrapper.emitted('toggleFavorite')).toBeTruthy()
    expect(wrapper.emitted('toggleFavorite')[0]).toEqual(['1', true])
  })
})
```

### 组合式函数测试

```typescript
// __tests__/composables/useDebounce.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDebounce } from '@/composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('debounces function calls', () => {
    const mockFn = vi.fn()
    const debouncedFn = useDebounce(mockFn, 300)
    
    // 快速调用多次
    debouncedFn('test1')
    debouncedFn('test2')
    debouncedFn('test3')
    
    expect(mockFn).not.toHaveBeenCalled()
    
    // 前进时间
    vi.advanceTimersByTime(300)
    
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('test3')
  })

  it('cancels previous calls when new call is made', () => {
    const mockFn = vi.fn()
    const debouncedFn = useDebounce(mockFn, 300)
    
    debouncedFn('test1')
    vi.advanceTimersByTime(200)
    
    debouncedFn('test2')
    vi.advanceTimersByTime(100)
    
    expect(mockFn).not.toHaveBeenCalled()
    
    vi.advanceTimersByTime(200)
    
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('test2')
  })
})
```

### Store 测试

```typescript
// __tests__/stores/course.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCourseStore } from '@/stores/course'

describe('Course Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty courses', () => {
    const store = useCourseStore()
    
    expect(store.courses).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetches courses successfully', async () => {
    const store = useCourseStore()
    const mockCourses = [
      { id: '1', name: '课程1' },
      { id: '2', name: '课程2' }
    ]
    
    // 模拟 API 调用
    vi.spyOn(store, 'fetchCourses').mockResolvedValue(mockCourses)
    
    await store.fetchCourses()
    
    expect(store.courses).toEqual(mockCourses)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('handles fetch error', async () => {
    const store = useCourseStore()
    const error = new Error('API Error')
    
    vi.spyOn(store, 'fetchCourses').mockRejectedValue(error)
    
    await store.fetchCourses()
    
    expect(store.error).toBe(error)
    expect(store.loading).toBe(false)
  })

  it('toggles favorite status', async () => {
    const store = useCourseStore()
    const courseId = '1'
    
    vi.spyOn(store, 'toggleFavorite').mockResolvedValue()
    
    await store.toggleFavorite(courseId)
    
    expect(store.toggleFavorite).toHaveBeenCalledWith(courseId)
  })
})
```

## 🔄 集成测试

### 组件交互测试

```typescript
// __tests__/integration/CourseList.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import CourseList from '@/views/CourseList.vue'
import CourseCard from '@/components/features/course/CourseCard.vue'

describe('CourseList Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders course cards and handles interactions', async () => {
    const mockCourses = [
      { id: '1', name: '课程1', rating: 4.0, reviewCount: 10 },
      { id: '2', name: '课程2', rating: 3.5, reviewCount: 5 }
    ]
    
    const wrapper = mount(CourseList, {
      global: {
        stubs: {
          CourseCard: {
            template: '<div class="course-card">{{ course.name }}</div>',
            props: ['course']
          }
        }
      }
    })
    
    // 模拟 store 数据
    const store = useCourseStore()
    store.courses = mockCourses
    
    await wrapper.vm.$nextTick()
    
    const courseCards = wrapper.findAll('.course-card')
    expect(courseCards).toHaveLength(2)
    expect(courseCards[0].text()).toBe('课程1')
    expect(courseCards[1].text()).toBe('课程2')
  })
})
```

## 🌐 E2E 测试

### 使用 Playwright

```typescript
// e2e/course-search.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Course Search', () => {
  test('should search courses and display results', async ({ page }) => {
    // 访问课程列表页面
    await page.goto('/courses')
    
    // 等待页面加载
    await page.waitForSelector('.course-list')
    
    // 输入搜索关键词
    await page.fill('[data-testid="search-input"]', '算法')
    
    // 等待搜索结果
    await page.waitForSelector('.course-card')
    
    // 验证搜索结果
    const courseCards = await page.$$('.course-card')
    expect(courseCards.length).toBeGreaterThan(0)
    
    // 验证搜索关键词在结果中
    const courseNames = await page.$$eval('.course-card__title', 
      elements => elements.map(el => el.textContent)
    )
    
    courseNames.forEach(name => {
      expect(name.toLowerCase()).toContain('算法')
    })
  })

  test('should filter courses by category', async ({ page }) => {
    await page.goto('/courses')
    
    // 选择分类
    await page.click('[data-testid="category-filter"]')
    await page.click('text=计算机科学')
    
    // 等待筛选结果
    await page.waitForSelector('.course-card')
    
    // 验证所有课程都属于计算机科学分类
    const categories = await page.$$eval('.course-card__category', 
      elements => elements.map(el => el.textContent)
    )
    
    categories.forEach(category => {
      expect(category).toBe('计算机科学')
    })
  })

  test('should handle course detail navigation', async ({ page }) => {
    await page.goto('/courses')
    
    // 点击第一个课程卡片
    await page.click('.course-card:first-child')
    
    // 验证跳转到详情页
    await expect(page).toHaveURL(/\/courses\/\d+/)
    
    // 验证详情页内容
    await expect(page.locator('.course-detail')).toBeVisible()
  })
})
```

## 📊 测试覆盖率

### 覆盖率配置

```typescript
// vitest.config.ts 中的 coverage 配置
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: [
    'node_modules/',
    'dist/',
    '**/*.d.ts',
    'test-setup.ts',
    '**/*.config.*',
    '**/__tests__/**',
    '**/*.test.*',
    '**/*.spec.*'
  ],
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### 覆盖率报告

```bash
# 运行测试并生成覆盖率报告
npm run test:coverage

# 查看 HTML 报告
open coverage/index.html
```

## 🚀 测试最佳实践

### 1. 测试命名规范

```typescript
// 使用描述性的测试名称
describe('CourseCard Component', () => {
  it('should display course information when course prop is provided', () => {
    // 测试实现
  })
  
  it('should emit viewDetails event when view button is clicked', () => {
    // 测试实现
  })
  
  it('should show loading skeleton when loading prop is true', () => {
    // 测试实现
  })
})
```

### 2. 测试数据管理

```typescript
// 使用工厂函数创建测试数据
const createMockCourse = (overrides = {}) => ({
  id: '1',
  name: '测试课程',
  code: 'TEST101',
  credits: 3,
  description: '测试课程描述',
  rating: 4.0,
  reviewCount: 10,
  ...overrides
})

// 在测试中使用
const course = createMockCourse({ name: '特殊课程' })
```

### 3. 异步测试处理

```typescript
it('should handle async operations correctly', async () => {
  const wrapper = mount(AsyncComponent)
  
  // 等待异步操作完成
  await wrapper.vm.$nextTick()
  
  // 或者等待特定条件
  await waitFor(() => {
    expect(wrapper.find('.loaded-content').exists()).toBe(true)
  })
})
```

### 4. 模拟外部依赖

```typescript
// 模拟 API 调用
vi.mock('@/services/api', () => ({
  fetchCourses: vi.fn()
}))

// 模拟路由
const mockRouter = {
  push: vi.fn()
}

const wrapper = mount(Component, {
  global: {
    mocks: {
      $router: mockRouter
    }
  }
})
```

## 📝 测试脚本

### package.json 脚本

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### CI/CD 集成

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 🔧 调试测试

### 调试技巧

```typescript
// 使用 debugger 语句
it('should work correctly', () => {
  debugger // 在浏览器中调试
  // 测试代码
})

// 使用 console.log
it('should work correctly', () => {
  console.log('Debug info:', someVariable)
  // 测试代码
})

// 使用 Vitest 的调试模式
// npm run test -- --reporter=verbose
```

### 常见问题排查

1. **组件不渲染**: 检查是否正确导入和注册
2. **异步操作失败**: 确保使用 `await` 和 `$nextTick()`
3. **模拟不工作**: 检查模拟是否正确设置
4. **类型错误**: 确保 TypeScript 配置正确

---

> 💡 **提示**: 定期运行测试，保持测试代码的更新，确保测试覆盖关键业务逻辑。
