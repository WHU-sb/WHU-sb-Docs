# 代码规范

## 概述

WHU.sb 项目建立了统一的代码规范，确保代码质量、可读性和可维护性。本文档详细说明各技术栈的代码规范、工具配置和最佳实践。

## 📋 通用规范

### 代码风格原则

1. **可读性优先**: 代码应该清晰易懂
2. **一致性**: 保持代码风格一致
3. **简洁性**: 避免过度复杂的代码
4. **可维护性**: 便于后续维护和扩展

### 命名规范

#### 通用命名规则

- **使用有意义的名称**: 避免使用缩写或无意义的名称
- **遵循语言约定**: 遵循各编程语言的命名约定
- **保持一致性**: 在整个项目中保持命名风格一致

#### 命名示例

```javascript
// 好的命名
const userProfile = getUserProfile();
const isAuthenticated = checkAuthentication();
const MAX_RETRY_COUNT = 3;

// 不好的命名
const up = getUP();
const auth = checkAuth();
const max = 3;
```

## 🔧 前端代码规范

### JavaScript/TypeScript 规范

#### ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    // 代码风格
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    
    // 变量和函数
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // 函数规范
    'func-style': ['error', 'expression'],
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',
    
    // 对象和数组
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'object-shorthand': 'error',
    
    // 条件语句
    'no-else-return': 'error',
    'prefer-template': 'error',
    'no-console': 'warn',
    
    // TypeScript 特定规则
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};
```

#### Prettier 配置

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### 代码示例

```typescript
// 组件定义
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async (): Promise<void> => {
    try {
      setLoading(true);
      const userData = await api.getUser(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedUser: User): void => {
    setUser(updatedUser);
    onUpdate?.(updatedUser);
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <ErrorMessage message="User not found" />;
  }

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <UserForm user={user} onSubmit={handleUpdate} />
    </div>
  );
};

export default UserProfile;
```

### Vue.js 规范

#### Vue 组件规范

```vue
<template>
  <div class="user-profile">
    <h2>{{ user.name }}</h2>
    <UserForm 
      :user="user" 
      @submit="handleUpdate" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { User } from '@/types/user';
import UserForm from '@/components/UserForm.vue';
import { api } from '@/services/api';

export default defineComponent({
  name: 'UserProfile',
  components: {
    UserForm
  },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const user = ref<User | null>(null);
    const loading = ref<boolean>(false);

    const fetchUser = async (): Promise<void> => {
      try {
        loading.value = true;
        const userData = await api.getUser(props.userId);
        user.value = userData;
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleUpdate = (updatedUser: User): void => {
      user.value = updatedUser;
      emit('update', updatedUser);
    };

    onMounted(() => {
      fetchUser();
    });

    return {
      user,
      loading,
      handleUpdate
    };
  }
});
</script>

<style scoped>
.user-profile {
  padding: 1rem;
}

.user-profile h2 {
  margin-bottom: 1rem;
  color: #333;
}
</style>
```

## 🔧 后端代码规范

### Go 代码规范

#### golangci-lint 配置

```yaml
# .golangci.yml
run:
  timeout: 5m
  modules-download-mode: readonly

linters:
  enable:
    - gofmt
    - golint
    - govet
    - errcheck
    - staticcheck
    - gosimple
    - ineffassign
    - unused
    - misspell
    - gosec
    - prealloc
    - gocritic

linters-settings:
  golint:
    min-confidence: 0.8
  gocritic:
    enabled-tags:
      - diagnostic
      - experimental
      - opinionated
      - performance
      - style

issues:
  exclude-rules:
    - path: _test\.go
      linters:
        - errcheck
```

#### 代码示例

```go
// user.go
package models

import (
	"time"
	"errors"
)

// User 表示用户模型
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"size:100;not null"`
	Email     string    `json:"email" gorm:"size:255;uniqueIndex;not null"`
	Password  string    `json:"-" gorm:"size:255;not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Validate 验证用户数据
func (u *User) Validate() error {
	if u.Name == "" {
		return errors.New("name is required")
	}
	
	if u.Email == "" {
		return errors.New("email is required")
	}
	
	if !isValidEmail(u.Email) {
		return errors.New("invalid email format")
	}
	
	return nil
}

// isValidEmail 检查邮箱格式
func isValidEmail(email string) bool {
	// 实现邮箱验证逻辑
	return true
}
```

```go
// user_service.go
package services

import (
	"context"
	"fmt"
	"log"
	
	"whu.sb/internal/models"
	"whu.sb/internal/repository"
)

// UserService 用户服务接口
type UserService interface {
	GetUser(ctx context.Context, id uint) (*models.User, error)
	CreateUser(ctx context.Context, user *models.User) error
	UpdateUser(ctx context.Context, user *models.User) error
	DeleteUser(ctx context.Context, id uint) error
}

// userService 用户服务实现
type userService struct {
	userRepo repository.UserRepository
}

// NewUserService 创建用户服务实例
func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{
		userRepo: userRepo,
	}
}

// GetUser 获取用户信息
func (s *userService) GetUser(ctx context.Context, id uint) (*models.User, error) {
	user, err := s.userRepo.FindByID(ctx, id)
	if err != nil {
		log.Printf("Failed to get user %d: %v", id, err)
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	
	return user, nil
}

// CreateUser 创建用户
func (s *userService) CreateUser(ctx context.Context, user *models.User) error {
	if err := user.Validate(); err != nil {
		return fmt.Errorf("invalid user data: %w", err)
	}
	
	if err := s.userRepo.Create(ctx, user); err != nil {
		log.Printf("Failed to create user: %v", err)
		return fmt.Errorf("failed to create user: %w", err)
	}
	
	return nil
}
```

## 🧪 测试规范

### 前端测试规范

#### Jest 配置

```javascript
// jest.config.js
module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.ts',
    '!src/router/index.ts',
    '!**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
```

#### 测试示例

```typescript
// UserProfile.test.ts
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import UserProfile from '@/components/UserProfile.vue';
import { api } from '@/services/api';

// Mock API
jest.mock('@/services/api');

describe('UserProfile', () => {
  let wrapper: any;
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    const pinia = createPinia();
    wrapper = mount(UserProfile, {
      props: { userId: '1' },
      global: {
        plugins: [pinia]
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  it('should render user information', async () => {
    (api.getUser as jest.Mock).mockResolvedValue(mockUser);
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('h2').text()).toBe('John Doe');
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    (api.getUser as jest.Mock).mockRejectedValue(error);
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('.error-message').exists()).toBe(true);
  });
});
```

### 后端测试规范

#### Go 测试示例

```go
// user_service_test.go
package services

import (
	"context"
	"testing"
	"time"
	
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	
	"whu.sb/internal/models"
	"whu.sb/internal/repository/mocks"
)

func TestUserService_GetUser(t *testing.T) {
	tests := []struct {
		name    string
		userID  uint
		setup   func(*mocks.UserRepository)
		want    *models.User
		wantErr bool
	}{
		{
			name:   "successful get user",
			userID: 1,
			setup: func(repo *mocks.UserRepository) {
				user := &models.User{
					ID:        1,
					Name:      "John Doe",
					Email:     "john@example.com",
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}
				repo.On("FindByID", mock.Anything, uint(1)).Return(user, nil)
			},
			want: &models.User{
				ID:        1,
				Name:      "John Doe",
				Email:     "john@example.com",
			},
			wantErr: false,
		},
		{
			name:   "user not found",
			userID: 999,
			setup: func(repo *mocks.UserRepository) {
				repo.On("FindByID", mock.Anything, uint(999)).Return(nil, repository.ErrUserNotFound)
			},
			want:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(mocks.UserRepository)
			tt.setup(mockRepo)
			
			service := NewUserService(mockRepo)
			got, err := service.GetUser(context.Background(), tt.userID)
			
			if tt.wantErr {
				assert.Error(t, err)
				assert.Nil(t, got)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.want.ID, got.ID)
				assert.Equal(t, tt.want.Name, got.Name)
				assert.Equal(t, tt.want.Email, got.Email)
			}
			
			mockRepo.AssertExpectations(t)
		})
	}
}
```

## 📊 代码质量检查

### 自动化检查

#### 前端质量检查

```json
// package.json
{
  "scripts": {
    "lint": "eslint src --ext .js,.ts,.vue",
    "lint:fix": "eslint src --ext .js,.ts,.vue --fix",
    "format": "prettier --write src/**/*.{js,ts,vue,css,scss}",
    "format:check": "prettier --check src/**/*.{js,ts,vue,css,scss}",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "type-check": "vue-tsc --noEmit"
  }
}
```

#### 后端质量检查

```bash
# Makefile
.PHONY: lint test coverage

lint:
	golangci-lint run

lint-fix:
	golangci-lint run --fix

test:
	go test -v ./...

test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

format:
	go fmt ./...
	goimports -w .

vet:
	go vet ./...
```

### 预提交检查

#### Git Hooks 配置

```bash
#!/bin/bash
# .git/hooks/pre-commit

set -e

echo "🔍 运行代码质量检查..."

# 前端代码检查
if [ -f "frontend/package.json" ]; then
    echo "📝 检查前端代码..."
    cd frontend
    
    # 运行 ESLint
    if ! npm run lint; then
        echo "❌ ESLint 检查失败"
        exit 1
    fi
    
    # 运行类型检查
    if ! npm run type-check; then
        echo "❌ TypeScript 类型检查失败"
        exit 1
    fi
    
    cd ..
fi

# 后端代码检查
if [ -f "backend/go.mod" ]; then
    echo "📝 检查后端代码..."
    cd backend
    
    # 运行 golangci-lint
    if ! golangci-lint run; then
        echo "❌ Go 代码检查失败"
        exit 1
    fi
    
    # 运行测试
    if ! go test ./...; then
        echo "❌ Go 测试失败"
        exit 1
    fi
    
    cd ..
fi

echo "✅ 代码质量检查通过"
```

## 📈 代码质量监控

### 质量指标

1. **代码覆盖率**: 测试覆盖率目标 80%
2. **代码复杂度**: 圈复杂度不超过 10
3. **重复代码**: 重复代码比例不超过 5%
4. **技术债务**: 技术债务比例不超过 10%

### 定期审查

1. **每周**: 代码质量检查
2. **每月**: 代码复杂度分析
3. **每季度**: 技术债务评估

---

通过遵循本文档中的代码规范，可以建立高质量、可维护的代码库，提高开发效率和代码质量。
