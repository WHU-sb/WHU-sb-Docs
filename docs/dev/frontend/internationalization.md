# 国际化

## 概述

WHU.sb 前端使用 Vue I18n 实现国际化，支持多种语言，包括简体中文、繁体中文、英文和粤语。

## 支持的语言

### 语言列表

```typescript
export const supportedLocales = [
  {
    code: 'zh_Hans',
    name: '中文（简体）',
    flag: '🇨🇳',
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'zh_Hant',
    name: '中文（繁體）',
    flag: '🇹🇼',
  },
  {
    code: 'yue_Hans',
    name: '粤语（简体）',
    flag: '🇭🇰',
  },
  {
    code: 'yue_Hant',
    name: '粵語（繁體）',
    flag: '🇭🇰',
  },
]
```

### 默认语言

```typescript
const defaultLocale = 'zh_Hans'
```

## 配置

### I18n 实例配置

```typescript
import { createI18n } from 'vue-i18n'
import zhHans from '../locales/zh_Hans.json'
import en from '../locales/en.json'
import zhHant from '../locales/zh_Hant.json'
import yueHans from '../locales/yue_Hans.json'
import yueHant from '../locales/yue_Hant.json'

const i18n = createI18n({
  legacy: false, // 使用Composition API
  locale: getCurrentLocale(),
  fallbackLocale: 'zh_Hans',
  messages: {
    zh_Hans: zhHans,
    en: en,
    zh_Hant: zhHant,
    yue_Hans: yueHans,
    yue_Hant: yueHant,
  },
  numberFormats: {
    zh_Hans: {
      currency: {
        style: 'currency',
        currency: 'CNY',
      },
    },
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
      },
    },
  },
  datetimeFormats: {
    zh_Hans: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },
})
```

## 语言管理

### 获取当前语言

```typescript
export function getCurrentLocale(): string {
  const saved = localStorage.getItem('locale')
  if (saved && supportedLocales.find((locale) => locale.code === saved)) {
    return saved
  }
  return defaultLocale
}
```

### 设置语言

```typescript
export function setLocale(locale: string) {
  if (supportedLocales.find((l) => l.code === locale)) {
    localStorage.setItem('locale', locale)
    window.location.reload()
  }
}
```

## 语言包结构

### 语言包组织

```
locales/
├── zh_Hans.json          # 简体中文
├── en.json               # 英文
├── zh_Hant.json          # 繁体中文
├── yue_Hans.json         # 粤语简体
└── yue_Hant.json         # 粤语繁体
```

### 翻译键命名规范

使用点号分隔的层级结构，按功能模块组织：

```json
{
  "common.anonymous": "匿名",
  "common.author": "作者",
  "common.back": "返回",
  "navigation.about": "关于",
  "navigation.addReview": "评价",
  "navigation.home": "首页",
  "home.title": "WHU.sb",
  "home.subtitle": "发现最好的课程，分享你的学习体验",
  "search.advanced": "高级",
  "search.advancedSearch": "高级搜索"
}
```

### 翻译键分类

- **common**: 通用翻译
- **navigation**: 导航相关
- **home**: 首页相关
- **search**: 搜索相关
- **course**: 课程相关
- **review**: 评价相关
- **teacher**: 教师相关
- **auth**: 认证相关
- **admin**: 管理相关

## 在组件中使用

### Composition API

```vue
<template>
  <div>
    <h1>{{ $t('home.title') }}</h1>
    <p>{{ $t('home.subtitle') }}</p>
    <button>{{ $t('common.search') }}</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 使用 t 函数
const title = t('home.title')
const subtitle = t('home.subtitle')

// 切换语言
const switchLanguage = (lang: string) => {
  locale.value = lang
}
</script>
```

### 带参数的翻译

```vue
<template>
  <div>
    <!-- 基础参数 -->
    <p>{{ $t('navigation.redirectingTo', { name: 'WHU.sb' }) }}</p>
    
    <!-- 复数形式 -->
    <p>{{ $tc('common.items', count) }}</p>
    
    <!-- 数字格式化 -->
    <p>{{ $n(price, 'currency') }}</p>
    
    <!-- 日期格式化 -->
    <p>{{ $d(date, 'long') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, tc, n, d } = useI18n()

const count = 5
const price = 99.99
const date = new Date()

// 带参数的翻译
const message = t('navigation.redirectingTo', { name: 'WHU.sb' })

// 复数形式
const itemsText = tc('common.items', count)

// 数字格式化
const formattedPrice = n(price, 'currency')

// 日期格式化
const formattedDate = d(date, 'long')
</script>
```

### 语言切换组件

```vue
<template>
  <div class="language-switcher">
    <select v-model="currentLocale" @change="changeLanguage">
      <option 
        v-for="locale in supportedLocales" 
        :key="locale.code" 
        :value="locale.code"
      >
        {{ locale.flag }} {{ locale.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales, setLocale } from '@/i18n'

const { locale } = useI18n()

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
  }
})

const changeLanguage = () => {
  setLocale(currentLocale.value)
}
</script>
```

## 格式化工具

### 数字格式化

```typescript
export function formatNumber(number: number, locale?: string): string {
  return new Intl.NumberFormat(locale || getCurrentLocale()).format(number)
}

// 使用示例
const price = formatNumber(1234.56) // 1,234.56 (中文) 或 1,234.56 (英文)
```

### 日期格式化

```typescript
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale || getCurrentLocale(), options).format(dateObj)
}

// 使用示例
const date = formatDate(new Date(), { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})
```

### 时间格式化

```typescript
export function formatTime(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale || getCurrentLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(dateObj)
}

// 使用示例
const time = formatTime(new Date()) // 14:30 (中文) 或 2:30 PM (英文)
```

### 相对时间格式化

```typescript
export function formatRelativeTime(date: Date | string, locale?: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale || getCurrentLocale(), { numeric: 'auto' })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}

// 使用示例
const relativeTime = formatRelativeTime('2023-01-01') // 2年前 (中文) 或 2 years ago (英文)
```

## 动态翻译

### 动态键名

```vue
<template>
  <div>
    <h1>{{ $t(`page.${pageName}.title`) }}</h1>
    <p>{{ $t(`page.${pageName}.description`) }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const pageName = ref('home')

// 动态翻译键
const title = t(`page.${pageName.value}.title`)
</script>
```

### 条件翻译

```vue
<template>
  <div>
    <p>{{ $t(`status.${status}`) }}</p>
    <button>{{ $t(`button.${isLoading ? 'loading' : 'submit'}`) }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const status = ref('success')
const isLoading = ref(false)

// 条件翻译
const statusText = t(`status.${status.value}`)
const buttonText = t(`button.${isLoading.value ? 'loading' : 'submit'}`)
</script>
```

## 语言包管理

### 添加新语言

1. 创建新的语言包文件：

```json
// locales/ja.json
{
  "common.anonymous": "匿名",
  "common.author": "作者",
  "common.back": "戻る",
  "home.title": "WHU.sb",
  "home.subtitle": "最高のコースを発見し、学習体験を共有する"
}
```

2. 更新支持的语言列表：

```typescript
export const supportedLocales = [
  // ... 现有语言
  {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
  },
]
```

3. 在 i18n 配置中添加：

```typescript
import ja from '../locales/ja.json'

const i18n = createI18n({
  // ...
  messages: {
    // ... 现有语言
    ja: ja,
  },
})
```

### 翻译键管理

#### 添加新翻译键

1. 在语言包中添加新的翻译键：

```json
{
  "newFeature.title": "新功能",
  "newFeature.description": "这是一个新功能的描述"
}
```

2. 在所有语言包中添加对应的翻译。

#### 删除翻译键

1. 从所有语言包中删除对应的翻译键。
2. 更新使用该翻译键的组件。

### 翻译键检查工具

项目包含翻译键管理工具：

```bash
# 检查未使用的翻译键
npm run check:i18n

# 清理未使用的翻译键
npm run clean:i18n
```

## 性能优化

### 懒加载语言包

```typescript
// 按需加载语言包
async function loadLanguageAsync(locale: string) {
  const messages = await import(`../locales/${locale}.json`)
  i18n.global.setLocaleMessage(locale, messages.default)
  i18n.global.locale.value = locale
}
```

### 语言包分割

```typescript
// 将大型语言包分割为多个文件
const messages = {
  common: await import('./common.json'),
  navigation: await import('./navigation.json'),
  home: await import('./home.json'),
}

// 合并语言包
const zhHans = {
  ...messages.common,
  ...messages.navigation,
  ...messages.home,
}
```

## 测试

### 单元测试

```typescript
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, it, expect } from 'vitest'
import MyComponent from '@/components/MyComponent.vue'

describe('Internationalization', () => {
  it('should display correct translation', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh_Hans',
      messages: {
        zh_Hans: {
          'home.title': 'WHU.sb',
        },
      },
    })

    const wrapper = mount(MyComponent, {
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('WHU.sb')
  })
})
```

### 翻译完整性测试

```typescript
import { describe, it, expect } from 'vitest'
import zhHans from '@/locales/zh_Hans.json'
import en from '@/locales/en.json'

describe('Translation completeness', () => {
  it('should have all keys in both languages', () => {
    const zhKeys = Object.keys(zhHans)
    const enKeys = Object.keys(en)

    const missingInEn = zhKeys.filter(key => !enKeys.includes(key))
    const missingInZh = enKeys.filter(key => !zhKeys.includes(key))

    expect(missingInEn).toHaveLength(0)
    expect(missingInZh).toHaveLength(0)
  })
})
```

## 最佳实践

### 翻译键命名

- 使用点号分隔的层级结构
- 按功能模块组织
- 使用描述性的键名
- 保持键名的一致性

### 翻译内容

- 保持翻译的准确性和一致性
- 考虑不同语言的文化差异
- 避免硬编码文本
- 使用参数化翻译

### 性能考虑

- 避免在模板中使用复杂的翻译逻辑
- 使用懒加载减少初始包大小
- 缓存翻译结果
- 定期清理未使用的翻译键

---

**提示**: 国际化配置支持多语言切换，采用模块化的语言包管理，确保翻译的完整性和一致性。
