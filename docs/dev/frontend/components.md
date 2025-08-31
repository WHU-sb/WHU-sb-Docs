# 组件开发指南

## 概述

WHU.sb 前端采用模块化的组件架构，基于 Vue 3 组合式 API 和 TypeScript 构建。本文档将详细介绍组件的设计原则、开发规范和最佳实践。

## 组件设计原则

### 1. 单一职责原则
每个组件应该只负责一个特定的功能，避免组件过于复杂。例如：
- `AppButton` 只负责按钮的渲染和交互
- `AppDataTable` 只负责数据的表格展示
- `AppForm` 只负责表单的布局和验证

### 2. 可复用性
组件应该设计为可复用的，通过 props 和插槽提供灵活的配置选项。

### 3. 可测试性
组件应该易于测试，避免复杂的内部状态和副作用。

## 组件分类和实现

### UI 基础组件

位于 `src/components/ui/` 目录，提供基础的用户界面组件。这些组件是构建更复杂功能的基础。

#### AppButton - 通用按钮组件

**设计目标**: 提供统一的按钮样式和交互体验，支持多种状态和样式变体。

**核心特性**:
- 支持多种样式变体（primary、secondary、success 等）
- 支持加载状态和禁用状态
- 支持图标和文本的组合
- 支持不同尺寸（small、normal、large）

**实现细节**:

```vue
<template>
  <Button
    :label="label"
    :icon="icon"
    :severity="severity"
    :size="size"
    :loading="loading"
    :disabled="disabled || false"
    :outlined="outlined"
    :text="text"
    :rounded="rounded"
    :class="customClass"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

interface Props {
  label?: string
  icon?: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger'
  size?: 'small' | 'normal' | 'large'
  loading?: boolean
  disabled?: boolean
  outlined?: boolean
  text?: boolean
  rounded?: boolean
  customClass?: string
}

defineProps<Props>()
defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

**使用场景和最佳实践**:

```vue
<template>
  <!-- 主要操作按钮 -->
  <AppButton
    label="提交"
    icon="pi pi-check"
    severity="success"
    :loading="isLoading"
    @click="handleSubmit"
  />
  
  <!-- 次要操作按钮 -->
  <AppButton
    label="取消"
    icon="pi pi-times"
    severity="secondary"
    outlined
    @click="handleCancel"
  />
  
  <!-- 危险操作按钮 -->
  <AppButton
    label="删除"
    icon="pi pi-trash"
    severity="danger"
    :disabled="!canDelete"
    @click="handleDelete"
  />
</template>
```

**注意事项**:
1. 优先使用 `severity` 属性而不是自定义样式类
2. 加载状态时自动禁用按钮，避免重复提交
3. 危险操作使用 `danger` 样式，并添加确认机制

#### AppDataTable - 数据表格组件

**设计目标**: 提供统一的数据展示功能，支持排序、分页、搜索等常用操作。

**核心特性**:
- 自动处理分页逻辑
- 支持多列排序
- 集成搜索功能
- 响应式设计
- 可自定义列渲染

**实现示例**:

```vue
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
    @page="onPageChange"
    @sort="onSort"
  >
    <Column field="name" header="名称" :sortable="true">
      <template #body="{ data }">
        <div class="flex align-items-center">
          <img :src="data.avatar" class="w-2rem h-2rem rounded-full mr-2" />
          <span>{{ data.name }}</span>
        </div>
      </template>
    </Column>
    
    <Column field="status" header="状态" :sortable="true">
      <template #body="{ data }">
        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
      </template>
    </Column>
    
    <Column header="操作">
      <template #body="{ data }">
        <AppButton
          icon="pi pi-edit"
          text
          size="small"
          @click="handleEdit(data)"
        />
        <AppButton
          icon="pi pi-trash"
          text
          severity="danger"
          size="small"
          @click="handleDelete(data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
```

**最佳实践**:
1. 使用懒加载模式处理大数据集
2. 为每列提供合适的排序和搜索功能
3. 使用插槽自定义复杂列的渲染
4. 提供加载状态和空数据状态

### 功能组件

位于 `src/components/features/` 目录，包含特定业务功能的组件。这些组件通常组合多个基础组件实现具体的业务功能。

#### CourseCard - 课程卡片组件

**设计目标**: 展示课程信息，提供快速操作入口。

**核心特性**:
- 展示课程基本信息（名称、教师、评分等）
- 支持收藏和分享功能
- 响应式布局适配不同屏幕尺寸
- 支持加载状态和错误状态

**实现示例**:

```vue
<template>
  <Card class="course-card" :class="{ 'loading': loading }">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <h3 class="m-0">{{ course.name }}</h3>
        <div class="flex gap-2">
          <AppButton
            :icon="isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'"
            text
            :severity="isFavorite ? 'danger' : 'secondary'"
            @click="toggleFavorite"
          />
          <AppButton
            icon="pi pi-share-alt"
            text
            @click="shareCourse"
          />
        </div>
      </div>
    </template>
    
    <template #content>
      <div class="course-info">
        <div class="teacher-info">
          <i class="pi pi-user mr-2"></i>
          <span>{{ course.teacher }}</span>
        </div>
        
        <div class="rating-info">
          <Rating :model-value="course.rating" :readonly="true" :cancel="false" />
          <span class="ml-2">({{ course.reviewCount }} 条评价)</span>
        </div>
        
        <p class="course-description">{{ course.description }}</p>
      </div>
    </template>
    
    <template #footer>
      <div class="flex justify-content-between align-items-center">
        <div class="course-tags">
          <Tag v-for="tag in course.tags" :key="tag" :value="tag" />
        </div>
        <AppButton
          label="查看详情"
          icon="pi pi-arrow-right"
          @click="viewCourse"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCourseStore } from '@/stores/course'

interface Course {
  id: string
  name: string
  teacher: string
  rating: number
  reviewCount: number
  description: string
  tags: string[]
}

interface Props {
  course: Course
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  view: [course: Course]
  favorite: [courseId: string, isFavorite: boolean]
  share: [course: Course]
}>()

const courseStore = useCourseStore()
const isFavorite = computed(() => courseStore.isFavorite(props.course.id))

const toggleFavorite = () => {
  emit('favorite', props.course.id, !isFavorite.value)
}

const shareCourse = () => {
  emit('share', props.course)
}

const viewCourse = () => {
  emit('view', props.course)
}
</script>

<style scoped>
.course-card {
  transition: transform 0.2s ease-in-out;
}

.course-card:hover {
  transform: translateY(-2px);
}

.course-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.teacher-info {
  display: flex;
  align-items: center;
  color: var(--text-color-secondary);
}

.course-description {
  color: var(--text-color-secondary);
  line-height: 1.5;
  margin: 0;
}

.course-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
```

**使用场景**:

```vue
<template>
  <div class="courses-grid">
    <CourseCard
      v-for="course in courses"
      :key="course.id"
      :course="course"
      :loading="loading"
      @view="handleViewCourse"
      @favorite="handleToggleFavorite"
      @share="handleShareCourse"
    />
  </div>
</template>
```

## 组件通信模式

### Props 和 Events

**原则**: 使用 props 向下传递数据，使用 events 向上传递事件。

**最佳实践**:
1. Props 应该是只读的，不要在子组件中修改
2. 使用 TypeScript 接口定义 props 和 events
3. 为复杂对象提供默认值
4. 使用 `v-model` 简化双向绑定

**示例**:

```vue
<!-- 父组件 -->
<template>
  <SearchInput
    v-model="searchQuery"
    :placeholder="placeholder"
    :debounce="300"
    @search="handleSearch"
  />
</template>

<!-- 子组件 SearchInput.vue -->
<template>
  <div class="search-input">
    <InputText
      :model-value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <i class="pi pi-search search-icon"></i>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  debounce?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索...',
  debounce: 300
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
}>()

const debouncedValue = ref(props.modelValue)
let debounceTimer: NodeJS.Timeout

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  
  // 防抖处理
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedValue.value = value
    emit('search', value)
  }, props.debounce)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  debouncedValue.value = newValue
})
</script>
```

### 插槽通信

**用途**: 用于组件内容的灵活定制，特别是布局组件。

**示例**:

```vue
<template>
  <AppCard>
    <template #header>
      <h3>课程信息</h3>
      <p class="text-sm text-muted">课程的基本信息展示</p>
    </template>
    
    <div class="course-content">
      <slot name="content" />
    </div>
    
    <template #footer>
      <div class="flex justify-content-between">
        <slot name="actions" />
        <AppButton label="关闭" @click="$emit('close')" />
      </div>
    </template>
  </AppCard>
</template>
```

## 组件注册和管理

### 全局组件注册

**适用场景**: 频繁使用的通用组件，如按钮、输入框等。

**实现方式**:

```typescript
// src/plugins/global-components.ts
import type { App } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import AppDataTable from '@/components/ui/AppDataTable.vue'

export function registerGlobalComponents(app: App) {
  app.component('AppButton', AppButton)
  app.component('AppSkeleton', AppSkeleton)
  app.component('AppDataTable', AppDataTable)
}
```

**注意事项**:
1. 只注册真正通用的组件
2. 避免注册业务相关的组件
3. 考虑按需加载以减少初始包大小

### 局部组件注册

**适用场景**: 特定页面或功能使用的组件。

**最佳实践**:

```vue
<script setup lang="ts">
// 使用相对路径导入
import AppButton from '@/components/ui/AppButton.vue'
import CourseCard from '@/components/features/CourseCard.vue'
import SearchInput from '@/components/features/SearchInput.vue'

// 使用动态导入实现懒加载
const LazyComponent = defineAsyncComponent(() => 
  import('@/components/features/HeavyComponent.vue')
)
</script>
```

## 组件测试策略

### 单元测试

**测试目标**: 验证组件的核心功能和边界情况。

**测试框架**: Vitest + Vue Test Utils

**示例**:

```typescript
// tests/components/AppButton.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import AppButton from '@/components/ui/AppButton.vue'

describe('AppButton', () => {
  it('renders with correct label', () => {
    const wrapper = mount(AppButton, {
      props: {
        label: '测试按钮'
      }
    })
    
    expect(wrapper.text()).toContain('测试按钮')
  })
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(AppButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
  
  it('shows loading state correctly', () => {
    const wrapper = mount(AppButton, {
      props: {
        loading: true
      }
    })
    
    expect(wrapper.find('.p-button-loading').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
  
  it('applies correct severity class', () => {
    const wrapper = mount(AppButton, {
      props: {
        severity: 'danger'
      }
    })
    
    expect(wrapper.classes()).toContain('p-button-danger')
  })
  
  it('disables button when disabled prop is true', () => {
    const wrapper = mount(AppButton, {
      props: {
        disabled: true
      }
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
```

### 集成测试

**测试目标**: 验证组件在真实环境中的交互。

**示例**:

```typescript
// tests/integration/CourseCard.test.ts
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import CourseCard from '@/components/features/CourseCard.vue'

describe('CourseCard Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('handles favorite toggle correctly', async () => {
    const mockCourse = {
      id: '1',
      name: '测试课程',
      teacher: '测试教师',
      rating: 4.5,
      reviewCount: 10,
      description: '测试描述',
      tags: ['测试', '课程']
    }
    
    const wrapper = mount(CourseCard, {
      props: {
        course: mockCourse
      }
    })
    
    const favoriteButton = wrapper.find('[data-testid="favorite-button"]')
    await favoriteButton.trigger('click')
    
    expect(wrapper.emitted('favorite')).toBeTruthy()
    expect(wrapper.emitted('favorite')[0]).toEqual(['1', true])
  })
})
```

### 测试最佳实践

1. **测试组件渲染**: 验证组件是否正确渲染
2. **测试用户交互**: 验证点击、输入等交互行为
3. **测试事件发射**: 验证组件是否正确发射事件
4. **测试 props 变化**: 验证组件对 props 变化的响应
5. **测试插槽内容**: 验证插槽内容的正确渲染
6. **测试边界情况**: 验证空数据、错误状态等边界情况

## 样式规范

### Scoped 样式

**原则**: 使用 scoped 样式避免样式冲突，保持组件的独立性。

**示例**:

```vue
<style scoped>
.button {
  background-color: var(--primary-color);
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: var(--primary-color-dark);
}

.button:disabled {
  background-color: var(--disabled-color);
  cursor: not-allowed;
}

/* 使用深度选择器修改子组件样式 */
:deep(.p-button) {
  font-weight: 600;
}
</style>
```

### CSS 变量

**原则**: 使用 CSS 变量实现主题切换和样式复用。

**示例**:

```css
/* src/assets/styles/variables.css */
:root {
  --primary-color: #3b82f6;
  --primary-color-dark: #2563eb;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --disabled-color: #d1d5db;
  
  --border-radius: 4px;
  --transition-duration: 0.2s;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### 响应式设计

**原则**: 确保组件在不同屏幕尺寸下都能正常工作。

**示例**:

```vue
<template>
  <div class="responsive-card">
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.responsive-card {
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .responsive-card {
    padding: 0.75rem;
  }
  
  .card-content {
    gap: 0.75rem;
  }
}

/* 平板适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  .responsive-card {
    padding: 1.25rem;
  }
}
</style>
```

## 性能优化

### 组件懒加载

**适用场景**: 大型组件或不是首屏必需的组件。

**实现方式**:

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 懒加载组件
const HeavyComponent = defineAsyncComponent(() => 
  import('@/components/features/HeavyComponent.vue')
)

// 带加载状态的懒加载
const AsyncComponent = defineAsyncComponent({
  loader: () => import('@/components/features/AsyncComponent.vue'),
  loadingComponent: AppSkeleton,
  delay: 200,
  timeout: 3000
})
</script>
```

### 虚拟滚动

**适用场景**: 大量数据的列表展示。

**实现方式**:

```vue
<template>
  <VirtualScroller
    :items="items"
    :item-size="60"
    class="virtual-list"
  >
    <template #item="{ item }">
      <div class="list-item">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </template>
  </VirtualScroller>
</template>
```

## 总结

组件开发是前端开发的核心，良好的组件设计能够提高代码的可维护性和复用性。通过遵循本文档中的设计原则和最佳实践，可以构建出高质量、易维护的组件系统。

记住以下关键点：
1. **单一职责**: 每个组件只负责一个特定功能
2. **可复用性**: 通过 props 和插槽提供灵活的配置
3. **可测试性**: 设计易于测试的组件结构
4. **性能优化**: 合理使用懒加载和虚拟滚动
5. **样式规范**: 使用 scoped 样式和 CSS 变量
