# 后端开发指南

## 概述

欢迎来到 WHU.sb 后端开发文档！本文档旨在帮助开发者快速理解系统架构、掌握开发流程，并解决实际开发中遇到的问题。

### 文档目标
- **新开发者**: 快速上手项目，理解架构设计
- **维护开发者**: 掌握最佳实践，提高代码质量
- **运维人员**: 了解部署配置，监控系统状态

### 核心价值
- 提供完整的开发环境搭建指南
- 详细说明架构设计思路和实现方案
- 包含大量可运行的代码示例
- 涵盖常见问题的解决方案

## 🚀 快速开始

### 环境要求

#### 核心技术栈
- **Go**: 1.24.6+ (推荐使用最新稳定版)
  - **选择原因**: 优秀的并发性能、丰富的生态系统、强类型安全
  - **实际应用**: 用于构建高性能的HTTP服务和后台任务处理

#### 数据存储
- **MySQL**: 8.0+ 或 **PostgreSQL**: 14+
  - **选择原因**: 成熟的关系型数据库，支持复杂查询和事务处理
  - **实际应用**: 存储用户数据、课程信息、评价记录等核心业务数据
- **Redis**: 6.0+
  - **选择原因**: 高性能的内存数据库，支持多种数据结构
  - **实际应用**: 缓存热点数据、会话存储、分布式锁

#### 开发工具
- **Git**: 2.0+ (版本控制和协作开发)

### 项目初始化

```bash
# 克隆项目
git clone https://github.com/WHU-sb/WHU-sb.git
cd whu.sb/backend

# 安装依赖
go mod download

# 配置环境
cp config/config.example.toml config/config.toml
# 编辑配置文件，设置数据库连接等信息
```

### 配置文件说明

配置文件采用TOML格式，结构清晰，易于维护。以下是详细的配置说明：

```toml
# config/config.toml

[server]
# HTTP服务器配置
port = 8080                    # 服务端口，生产环境建议使用80或443
mode = "debug"                 # 运行模式：debug(开发)、release(生产)、test(测试)
read_timeout = 30              # 读取超时时间(秒)，防止慢客户端攻击
write_timeout = 30             # 写入超时时间(秒)，控制响应时间

[database]
# 数据库连接配置
driver = "mysql"               # 数据库类型：mysql、postgresql、sqlite
host = "localhost"             # 数据库主机地址
port = 3306                    # 数据库端口
username = "whu_sb"            # 数据库用户名
password = "your_password"     # 数据库密码(生产环境使用环境变量)
database = "whu_sb"            # 数据库名称
charset = "utf8mb4"            # 字符集，支持emoji和特殊字符
max_idle_conns = 10            # 最大空闲连接数，减少连接开销
max_open_conns = 100           # 最大打开连接数，控制并发能力
conn_max_lifetime = 3600       # 连接最大生命周期(秒)，避免连接过期

[redis]
# Redis缓存配置
host = "localhost"             # Redis主机地址
port = 6379                    # Redis端口
password = ""                  # Redis密码(生产环境必须设置)
database = 0                   # Redis数据库编号(0-15)
pool_size = 10                 # 连接池大小，根据并发需求调整

[jwt]
# JWT认证配置
secret = "your_jwt_secret_key" # JWT密钥(生产环境使用强密钥)
expire_hours = 24              # Token过期时间(小时)

[log]
# 日志配置
level = "info"                 # 日志级别：debug、info、warn、error
format = "json"                # 日志格式：json(结构化)、text(可读)
output = "stdout"              # 输出目标：stdout、file
file_path = "logs/app.log"     # 日志文件路径(当output=file时)
```

#### 配置最佳实践
1. **环境变量**: 敏感信息(密码、密钥)使用环境变量
2. **连接池**: 根据实际负载调整数据库和Redis连接池大小
3. **超时设置**: 合理设置超时时间，平衡性能和稳定性
4. **日志级别**: 生产环境使用info级别，开发环境使用debug级别

### 数据库初始化

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE whu_sb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 运行迁移
go run cmd/main.go migrate

# 导入初始数据
go run cmd/main.go seed
```

### 启动开发服务器

```bash
# 启动主服务
go run cmd/main.go serve

# 启动 Worker (后台任务处理)
go run cmd/worker.go

# 启动 CLI 工具
go run cmd/cli/cli.go --help
```

## 🏗️ 项目架构

### 架构设计理念

WHU.sb 后端采用**分层架构**和**领域驱动设计**，确保代码的可维护性、可扩展性和可测试性。

#### 设计目标
- **高内聚低耦合**: 每个模块职责单一，模块间依赖清晰
- **可测试性**: 通过依赖注入和接口抽象，便于单元测试
- **可扩展性**: 支持水平扩展和功能模块化扩展
- **高性能**: 通过缓存、连接池等技术优化性能

### 目录结构详解

```
backend/
├── cmd/                    # 应用程序入口点
│   ├── main.go            # HTTP服务主入口
│   ├── worker.go          # 后台任务处理器
│   └── cli/               # 命令行工具集
├── internal/              # 内部包(不对外暴露)
│   ├── config/            # 配置管理和加载
│   ├── database/          # 数据访问层(Repository模式)
│   ├── handlers/          # HTTP请求处理器
│   ├── middleware/        # 中间件(认证、日志、CORS等)
│   ├── models/            # 数据模型和业务实体
│   ├── services/          # 业务逻辑层
│   └── utils/             # 通用工具函数
├── config/                # 配置文件目录
├── proto/                 # Protocol Buffers定义
└── scripts/               # 部署和维护脚本
```

### 架构设计原则

#### 1. 分层架构 (Handler → Service → Repository)
**设计思路**: 每层职责明确，上层依赖下层接口，实现关注点分离

**实际应用**:
- **Handler层**: 处理HTTP请求，参数验证，响应格式化
- **Service层**: 实现业务逻辑，协调多个Repository
- **Repository层**: 数据访问抽象，支持多种数据源

#### 2. 依赖注入
**设计思路**: 通过接口解耦，便于测试和模块替换

**实现方式**:
```go
// 通过构造函数注入依赖
type CourseService struct {
    repo  CourseRepository
    cache CacheService
}

func NewCourseService(repo CourseRepository, cache CacheService) *CourseService {
    return &CourseService{repo: repo, cache: cache}
}
```

#### 3. 统一错误处理
**设计思路**: 标准化错误响应格式，便于前端处理

**实现方式**:
```go
// 统一错误响应结构
type ErrorResponse struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Details string `json:"details,omitempty"`
}
```

#### 4. 配置管理
**设计思路**: 支持多环境配置，敏感信息通过环境变量管理

**实现方式**: TOML配置文件 + 环境变量覆盖

#### 5. 结构化日志
**设计思路**: 便于日志分析和问题排查

**实现方式**: 使用zap日志库，输出JSON格式日志

## 🔧 核心功能开发

### API 开发流程

API开发遵循**RESTful设计原则**和**分层架构模式**，确保代码的可维护性和可测试性。

#### 开发流程概述
1. **数据模型设计**: 定义业务实体和数据结构
2. **Repository层**: 实现数据访问逻辑
3. **Service层**: 实现业务逻辑和缓存策略
4. **Handler层**: 处理HTTP请求和响应
5. **路由注册**: 配置API路由和中间件

#### 1. 定义数据模型

**设计思路**: 数据模型是业务逻辑的基础，需要明确定义字段类型、约束关系和验证规则。

**核心特性**:
- 使用GORM标签定义数据库映射
- 实现软删除支持数据恢复
- 包含业务验证逻辑
- 支持JSON序列化

```go
// internal/models/course.go
package models

import (
    "errors"
    "time"
    "gorm.io/gorm"
)

// Course 课程模型
// 设计目标: 存储课程基本信息，支持搜索、筛选和统计
type Course struct {
    ID          uint           `json:"id" gorm:"primaryKey"`
    Name        string         `json:"name" gorm:"size:255;not null;index"`           // 课程名称，支持搜索
    Code        string         `json:"code" gorm:"size:50;uniqueIndex;not null"`      // 课程代码，唯一标识
    Teacher     string         `json:"teacher" gorm:"size:100;not null;index"`        // 授课教师，支持筛选
    Credits     int            `json:"credits" gorm:"not null"`                        // 学分
    Description string         `json:"description" gorm:"type:text"`                  // 课程描述
    Rating      float64        `json:"rating" gorm:"default:0;index"`                 // 平均评分，支持排序
    ReviewCount int            `json:"review_count" gorm:"default:0"`                 // 评价数量
    Tags        []string       `json:"tags" gorm:"type:json"`                         // 标签数组，支持分类
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`             // 软删除支持
}

// TableName 指定表名
func (Course) TableName() string {
    return "courses"
}

// BeforeCreate GORM钩子函数，在创建前执行
func (c *Course) BeforeCreate(tx *gorm.DB) error {
    // 确保Tags字段不为nil
    if c.Tags == nil {
        c.Tags = []string{}
    }
    return nil
}

// Validate 业务验证逻辑
// 用途: 在Service层调用，确保数据完整性
func (c *Course) Validate() error {
    if c.Name == "" {
        return errors.New("课程名称不能为空")
    }
    if c.Code == "" {
        return errors.New("课程代码不能为空")
    }
    if c.Teacher == "" {
        return errors.New("授课教师不能为空")
    }
    if c.Credits <= 0 {
        return errors.New("学分必须大于0")
    }
    return nil
}

// GetCacheKey 生成缓存键
// 用途: 统一缓存键生成规则
func (c *Course) GetCacheKey() string {
    return fmt.Sprintf("course:%d", c.ID)
}
```

#### 2. 实现 Repository 层

**设计思路**: Repository层封装数据访问逻辑，提供统一的数据操作接口，支持多种数据源。

**核心职责**:
- 封装数据库操作细节
- 提供类型安全的数据访问方法
- 支持复杂的查询和过滤逻辑
- 处理数据库连接和事务

```go
// internal/database/course_repository.go
package database

import (
    "context"
    "fmt"
    "gorm.io/gorm"
    "whu-sb/internal/models"
)

// CourseRepository 课程数据访问层
// 设计目标: 提供统一的课程数据操作接口
type CourseRepository struct {
    db *gorm.DB
}

// NewCourseRepository 创建课程Repository实例
func NewCourseRepository(db *gorm.DB) *CourseRepository {
    return &CourseRepository{db: db}
}

// Create 创建课程
// 用途: 新增课程信息到数据库
func (r *CourseRepository) Create(ctx context.Context, course *models.Course) error {
    return r.db.WithContext(ctx).Create(course).Error
}

// GetByID 根据ID获取课程
// 用途: 获取单个课程的详细信息
func (r *CourseRepository) GetByID(ctx context.Context, id uint) (*models.Course, error) {
    var course models.Course
    err := r.db.WithContext(ctx).First(&course, id).Error
    if err != nil {
        return nil, fmt.Errorf("获取课程失败: %w", err)
    }
    return &course, nil
}

// GetByCode 根据课程代码获取课程
// 用途: 检查课程代码是否已存在
func (r *CourseRepository) GetByCode(ctx context.Context, code string) (*models.Course, error) {
    var course models.Course
    err := r.db.WithContext(ctx).Where("code = ?", code).First(&course).Error
    if err != nil {
        return nil, err
    }
    return &course, nil
}

// List 获取课程列表
// 用途: 支持分页、搜索、筛选的课程列表查询
func (r *CourseRepository) List(ctx context.Context, filter *models.CourseFilter) ([]*models.Course, int64, error) {
    var courses []*models.Course
    var total int64
    
    // 构建基础查询
    query := r.db.WithContext(ctx).Model(&models.Course{})
    
    // 应用搜索条件
    if filter.Search != "" {
        searchTerm := "%" + filter.Search + "%"
        query = query.Where("name LIKE ? OR code LIKE ? OR description LIKE ?", 
            searchTerm, searchTerm, searchTerm)
    }
    
    // 应用教师筛选
    if filter.Teacher != "" {
        query = query.Where("teacher = ?", filter.Teacher)
    }
    
    // 应用评分筛选
    if filter.MinRating > 0 {
        query = query.Where("rating >= ?", filter.MinRating)
    }
    
    // 获取总数(用于分页)
    if err := query.Count(&total).Error; err != nil {
        return nil, 0, fmt.Errorf("统计课程数量失败: %w", err)
    }
    
    // 应用排序
    if filter.SortBy != "" {
        order := filter.SortBy
        if filter.SortOrder == "desc" {
            order += " DESC"
        }
        query = query.Order(order)
    } else {
        // 默认按创建时间倒序
        query = query.Order("created_at DESC")
    }
    
    // 应用分页
    offset := (filter.Page - 1) * filter.PageSize
    err := query.Offset(offset).Limit(filter.PageSize).Find(&courses).Error
    if err != nil {
        return nil, 0, fmt.Errorf("查询课程列表失败: %w", err)
    }
    
    return courses, total, nil
}

// Update 更新课程
// 用途: 修改课程信息
func (r *CourseRepository) Update(ctx context.Context, course *models.Course) error {
    return r.db.WithContext(ctx).Save(course).Error
}

// Delete 删除课程(软删除)
// 用途: 标记课程为已删除状态
func (r *CourseRepository) Delete(ctx context.Context, id uint) error {
    return r.db.WithContext(ctx).Delete(&models.Course{}, id).Error
}

// GetPopularCourses 获取热门课程
// 用途: 根据评分和评价数量获取热门课程
func (r *CourseRepository) GetPopularCourses(ctx context.Context, limit int) ([]*models.Course, error) {
    var courses []*models.Course
    err := r.db.WithContext(ctx).
        Where("review_count > 0").
        Order("rating DESC, review_count DESC").
        Limit(limit).
        Find(&courses).Error
    return courses, err
}
```

#### 3. 实现 Service 层

**设计思路**: Service层实现核心业务逻辑，协调多个Repository，实现缓存策略和事务管理。

**核心职责**:
- 实现业务规则和验证逻辑
- 协调多个数据源的操作
- 实现缓存策略和性能优化
- 处理事务和错误恢复

```go
// internal/services/course_service.go
package services

import (
    "context"
    "errors"
    "fmt"
    "time"
    "whu-sb/internal/database"
    "whu-sb/internal/models"
)

// CourseService 课程业务逻辑层
// 设计目标: 实现课程相关的业务逻辑，包括缓存、验证、事务等
type CourseService struct {
    repo  *database.CourseRepository
    cache CacheService
}

// NewCourseService 创建课程服务实例
func NewCourseService(repo *database.CourseRepository, cache CacheService) *CourseService {
    return &CourseService{
        repo:  repo,
        cache: cache,
    }
}

// CreateCourse 创建课程
// 业务逻辑: 验证数据 -> 检查重复 -> 创建记录 -> 清除缓存
func (s *CourseService) CreateCourse(ctx context.Context, req *models.CreateCourseRequest) (*models.Course, error) {
    // 1. 业务验证
    if err := req.Validate(); err != nil {
        return nil, fmt.Errorf("请求数据验证失败: %w", err)
    }
    
    // 2. 检查课程代码唯一性
    existing, _ := s.repo.GetByCode(ctx, req.Code)
    if existing != nil {
        return nil, errors.New("课程代码已存在，请使用其他代码")
    }
    
    // 3. 创建课程记录
    course := &models.Course{
        Name:        req.Name,
        Code:        req.Code,
        Teacher:     req.Teacher,
        Credits:     req.Credits,
        Description: req.Description,
        Tags:        req.Tags,
    }
    
    if err := s.repo.Create(ctx, course); err != nil {
        return nil, fmt.Errorf("创建课程失败: %w", err)
    }
    
    // 4. 清除相关缓存(缓存失效策略)
    s.cache.Delete(ctx, "courses:list")
    s.cache.Delete(ctx, "courses:popular")
    
    return course, nil
}

// GetCourses 获取课程列表
// 缓存策略: Cache-Aside模式，先查缓存，未命中则查数据库并更新缓存
func (s *CourseService) GetCourses(ctx context.Context, filter *models.CourseFilter) ([]*models.Course, int64, error) {
    // 1. 尝试从缓存获取
    cacheKey := s.buildCacheKey(filter)
    if cached, err := s.cache.Get(ctx, cacheKey); err == nil {
        if result, ok := cached.(*models.CourseListResult); ok {
            return result.Courses, result.Total, nil
        }
    }
    
    // 2. 缓存未命中，从数据库获取
    courses, total, err := s.repo.List(ctx, filter)
    if err != nil {
        return nil, 0, fmt.Errorf("查询课程列表失败: %w", err)
    }
    
    // 3. 更新缓存(设置5分钟过期时间)
    result := &models.CourseListResult{
        Courses: courses,
        Total:   total,
    }
    s.cache.Set(ctx, cacheKey, result, 5*time.Minute)
    
    return courses, total, nil
}

// 获取课程详情
func (s *CourseService) GetCourseByID(ctx context.Context, id uint) (*models.Course, error) {
    // 尝试从缓存获取
    cacheKey := fmt.Sprintf("course:%d", id)
    if cached, err := s.cache.Get(ctx, cacheKey); err == nil {
        if course, ok := cached.(*models.Course); ok {
            return course, nil
        }
    }
    
    // 从数据库获取
    course, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return nil, err
    }
    
    // 缓存结果
    s.cache.Set(ctx, cacheKey, course, 600) // 缓存10分钟
    
    return course, nil
}

// 更新课程
func (s *CourseService) UpdateCourse(ctx context.Context, id uint, req *models.UpdateCourseRequest) (*models.Course, error) {
    // 获取现有课程
    course, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return nil, err
    }
    
    // 更新字段
    if req.Name != "" {
        course.Name = req.Name
    }
    if req.Teacher != "" {
        course.Teacher = req.Teacher
    }
    if req.Credits > 0 {
        course.Credits = req.Credits
    }
    if req.Description != "" {
        course.Description = req.Description
    }
    if req.Tags != nil {
        course.Tags = req.Tags
    }
    
    // 验证更新后的数据
    if err := course.Validate(); err != nil {
        return nil, err
    }
    
    // 保存到数据库
    if err := s.repo.Update(ctx, course); err != nil {
        return nil, err
    }
    
    // 清除相关缓存
    s.cache.Delete(ctx, fmt.Sprintf("course:%d", id))
    s.cache.Delete(ctx, "courses:list")
    
    return course, nil
}

// 删除课程
func (s *CourseService) DeleteCourse(ctx context.Context, id uint) error {
    // 检查课程是否存在
    if _, err := s.repo.GetByID(ctx, id); err != nil {
        return err
    }
    
    // 删除课程
    if err := s.repo.Delete(ctx, id); err != nil {
        return err
    }
    
    // 清除相关缓存
    s.cache.Delete(ctx, fmt.Sprintf("course:%d", id))
    s.cache.Delete(ctx, "courses:list")
    
    return nil
}

// 构建缓存键
func (s *CourseService) buildCacheKey(filter *models.CourseFilter) string {
    return fmt.Sprintf("courses:list:%s:%s:%d:%d:%d", 
        filter.Search, filter.Teacher, filter.MinRating, filter.Page, filter.PageSize)
}
```

#### 4. 实现 Handler 层

**设计思路**: Handler层处理HTTP请求和响应，负责参数验证、调用Service层、格式化响应。

**核心职责**:
- 解析和验证HTTP请求参数
- 调用Service层执行业务逻辑
- 格式化响应数据
- 处理错误和异常情况

```go
// internal/handlers/course.go
package handlers

import (
    "net/http"
    "strconv"
    "whu-sb/internal/models"
    "whu-sb/internal/response"
    "whu-sb/internal/services"
    "whu-sb/internal/utils"
    
    "github.com/gin-gonic/gin"
)

// CourseHandler 课程HTTP处理器
// 设计目标: 处理课程相关的HTTP请求，提供RESTful API
type CourseHandler struct {
    courseService *services.CourseService
}

// NewCourseHandler 创建课程处理器实例
func NewCourseHandler(courseService *services.CourseService) *CourseHandler {
    return &CourseHandler{
        courseService: courseService,
    }
}

// GetCourses 获取课程列表
// API端点: GET /api/v1/courses
// 功能: 支持分页、搜索、筛选的课程列表查询
func (h *CourseHandler) GetCourses(c *gin.Context) {
    // 1. 解析查询参数
    page := utils.GetIntQuery(c, "page", 1)
    pageSize := utils.GetIntQuery(c, "page_size", 20)
    search := c.Query("search")
    teacher := c.Query("teacher")
    minRating := utils.GetFloatQuery(c, "min_rating", 0)
    sortBy := c.Query("sort_by")
    sortOrder := c.Query("sort_order")
    
    // 2. 参数验证和默认值处理
    if page < 1 {
        page = 1
    }
    if pageSize < 1 || pageSize > 100 {
        pageSize = 20 // 限制最大页面大小，防止性能问题
    }
    
    // 3. 构建过滤条件
    filter := &models.CourseFilter{
        Search:    search,
        Teacher:   teacher,
        MinRating: minRating,
        SortBy:    sortBy,
        SortOrder: sortOrder,
        Page:      page,
        PageSize:  pageSize,
    }
    
    // 4. 调用Service层执行业务逻辑
    courses, total, err := h.courseService.GetCourses(c.Request.Context(), filter)
    if err != nil {
        response.Error(c, http.StatusInternalServerError, "获取课程列表失败", err)
        return
    }
    
    // 5. 构建响应数据
    response.Success(c, gin.H{
        "courses": courses,
        "meta": gin.H{
            "page":        page,
            "page_size":   pageSize,
            "total":       total,
            "total_pages": int((total + int64(pageSize) - 1) / int64(pageSize)),
        },
    })
}

// GetCourse 获取课程详情
// API端点: GET /api/v1/courses/:id
// 功能: 根据课程ID获取详细信息
func (h *CourseHandler) GetCourse(c *gin.Context) {
    // 1. 解析路径参数
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        response.Error(c, http.StatusBadRequest, "无效的课程ID格式", err)
        return
    }
    
    // 2. 调用Service层获取课程详情
    course, err := h.courseService.GetCourseByID(c.Request.Context(), uint(id))
    if err != nil {
        response.Error(c, http.StatusNotFound, "课程不存在或已被删除", err)
        return
    }
    
    // 3. 返回课程详情
    response.Success(c, course)
}

// CreateCourse 创建课程
// API端点: POST /api/v1/admin/courses
// 功能: 创建新课程(需要管理员权限)
func (h *CourseHandler) CreateCourse(c *gin.Context) {
    // 1. 解析请求体
    var req models.CreateCourseRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, http.StatusBadRequest, "请求参数格式错误", err)
        return
    }
    
    // 2. 调用Service层创建课程
    course, err := h.courseService.CreateCourse(c.Request.Context(), &req)
    if err != nil {
        // 根据错误类型返回不同的状态码
        if errors.Is(err, models.ErrCourseCodeExists) {
            response.Error(c, http.StatusConflict, "课程代码已存在", err)
        } else {
            response.Error(c, http.StatusInternalServerError, "创建课程失败", err)
        }
        return
    }
    
    // 3. 返回创建的课程信息
    response.Success(c, course)
}

// 更新课程
func (h *CourseHandler) UpdateCourse(c *gin.Context) {
    // 获取课程ID
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        response.Error(c, http.StatusBadRequest, "无效的课程ID", err)
        return
    }
    
    var req models.UpdateCourseRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, http.StatusBadRequest, "请求参数错误", err)
        return
    }
    
    // 调用服务层
    course, err := h.courseService.UpdateCourse(c.Request.Context(), uint(id), &req)
    if err != nil {
        response.Error(c, http.StatusInternalServerError, "更新课程失败", err)
        return
    }
    
    response.Success(c, course)
}

// 删除课程
func (h *CourseHandler) DeleteCourse(c *gin.Context) {
    // 获取课程ID
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        response.Error(c, http.StatusBadRequest, "无效的课程ID", err)
        return
    }
    
    // 调用服务层
    if err := h.courseService.DeleteCourse(c.Request.Context(), uint(id)); err != nil {
        response.Error(c, http.StatusInternalServerError, "删除课程失败", err)
        return
    }
    
    response.Success(c, gin.H{"message": "课程删除成功"})
}
```

#### 5. 注册路由

**设计思路**: 路由配置采用分组和中间件的方式，实现权限控制和API版本管理。

**路由设计原则**:
- 按功能模块分组
- 使用中间件实现权限控制
- 支持API版本管理
- 遵循RESTful设计规范

```go
// internal/handlers/routes.go
package handlers

import (
    "whu-sb/internal/middleware"
    "github.com/gin-gonic/gin"
)

// SetupRoutes 配置API路由
// 设计目标: 组织API路由结构，实现权限控制和版本管理
func SetupRoutes(r *gin.Engine, handlers *Handlers) {
    // API版本组 - 支持多版本API共存
    v1 := r.Group("/api/v1")
    
    // 公开路由 - 无需认证即可访问
    public := v1.Group("")
    {
        // 课程相关API
        courses := public.Group("/courses")
        {
            courses.GET("", handlers.Course.GetCourses)           // 获取课程列表
            courses.GET("/:id", handlers.Course.GetCourse)        // 获取课程详情
            courses.GET("/popular", handlers.Course.GetPopular)   // 获取热门课程
        }
        
        // 认证相关API
        auth := public.Group("/auth")
        {
            auth.POST("/login", handlers.Auth.Login)              // 用户登录
            auth.POST("/register", handlers.Auth.Register)        // 用户注册
            auth.POST("/refresh", handlers.Auth.RefreshToken)     // 刷新Token
        }
        
        // 搜索相关API
        search := public.Group("/search")
        {
            search.GET("/courses", handlers.Search.SearchCourses) // 课程搜索
        }
    }
    
    // 需要认证的路由 - 需要有效的JWT Token
    authenticated := v1.Group("")
    authenticated.Use(middleware.AuthRequired())
    {
        // 用户相关API
        users := authenticated.Group("/users")
        {
            users.GET("/profile", handlers.User.GetProfile)       // 获取用户资料
            users.PUT("/profile", handlers.User.UpdateProfile)    // 更新用户资料
            users.GET("/reviews", handlers.User.GetUserReviews)   // 获取用户评价
        }
        
        // 评价相关API
        reviews := authenticated.Group("/reviews")
        {
            reviews.POST("", handlers.Review.CreateReview)        // 创建评价
            reviews.PUT("/:id", handlers.Review.UpdateReview)     // 更新评价
            reviews.DELETE("/:id", handlers.Review.DeleteReview)  // 删除评价
        }
        
        // 收藏相关API
        favorites := authenticated.Group("/favorites")
        {
            favorites.POST("/courses/:id", handlers.Favorite.AddFavorite)     // 添加收藏
            favorites.DELETE("/courses/:id", handlers.Favorite.RemoveFavorite) // 取消收藏
            favorites.GET("/courses", handlers.Favorite.GetFavorites)         // 获取收藏列表
        }
    }
    
    // 管理员路由 - 需要管理员权限
    admin := v1.Group("/admin")
    admin.Use(middleware.AuthRequired(), middleware.AdminRequired())
    {
        // 课程管理API
        adminCourses := admin.Group("/courses")
        {
            adminCourses.POST("", handlers.Course.CreateCourse)           // 创建课程
            adminCourses.PUT("/:id", handlers.Course.UpdateCourse)        // 更新课程
            adminCourses.DELETE("/:id", handlers.Course.DeleteCourse)     // 删除课程
            adminCourses.POST("/:id/approve", handlers.Course.ApproveCourse) // 审核课程
        }
        
        // 用户管理API
        adminUsers := admin.Group("/users")
        {
            adminUsers.GET("", handlers.User.GetUsers)                    // 获取用户列表
            adminUsers.PUT("/:id/role", handlers.User.UpdateUserRole)     // 更新用户角色
            adminUsers.PUT("/:id/status", handlers.User.UpdateUserStatus) // 更新用户状态
        }
        
        // 系统管理API
        adminSystem := admin.Group("/system")
        {
            adminSystem.GET("/stats", handlers.Admin.GetSystemStats)      // 获取系统统计
            adminSystem.POST("/cache/clear", handlers.Admin.ClearCache)   // 清除缓存
        }
    }
}
```

## 🔐 认证和权限

### 认证架构设计

WHU.sb 采用**JWT (JSON Web Token)** 实现无状态认证，支持用户登录、权限控制和Token刷新。

#### 认证流程
1. **用户登录**: 验证用户名密码，生成JWT Token
2. **Token验证**: 中间件验证Token有效性
3. **权限检查**: 基于用户角色进行权限控制
4. **Token刷新**: 支持Token自动刷新机制

### JWT 认证实现

**设计思路**: 使用JWT实现无状态认证，支持分布式部署和水平扩展。

```go
// internal/middleware/auth.go
package middleware

import (
    "net/http"
    "strings"
    "whu-sb/internal/utils"
    "github.com/gin-gonic/gin"
)

// AuthRequired JWT认证中间件
// 功能: 验证请求中的JWT Token，提取用户信息到上下文
func AuthRequired() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. 获取Authorization头
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{
                "code":    401,
                "message": "缺少认证信息，请先登录",
            })
            c.Abort()
            return
        }
        
        // 2. 解析Bearer Token格式
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{
                "code":    401,
                "message": "认证格式错误，应为 'Bearer <token>'",
            })
            c.Abort()
            return
        }
        
        token := parts[1]
        
        // 3. 验证JWT Token
        claims, err := utils.ValidateJWT(token)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{
                "code":    401,
                "message": "Token无效或已过期，请重新登录",
            })
            c.Abort()
            return
        }
        
        // 4. 将用户信息存储到Gin上下文
        c.Set("user_id", claims.UserID)
        c.Set("username", claims.Username)
        c.Set("role", claims.Role)
        c.Set("token_exp", claims.ExpiresAt)
        
        c.Next()
    }
}

// AdminRequired 管理员权限中间件
// 功能: 检查用户是否具有管理员权限
func AdminRequired() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. 获取用户角色(由AuthRequired中间件设置)
        role, exists := c.Get("role")
        if !exists {
            c.JSON(http.StatusForbidden, gin.H{
                "code":    403,
                "message": "权限不足，请先登录",
            })
            c.Abort()
            return
        }
        
        // 2. 检查是否为管理员角色
        if role != "admin" {
            c.JSON(http.StatusForbidden, gin.H{
                "code":    403,
                "message": "需要管理员权限，请联系管理员",
            })
            c.Abort()
            return
        }
        
        c.Next()
    }
}

// OptionalAuth 可选认证中间件
// 功能: 如果提供了Token则验证，否则跳过认证
func OptionalAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.Next()
            return
        }
        
        // 复用AuthRequired的逻辑，但不强制要求Token
        parts := strings.Split(authHeader, " ")
        if len(parts) == 2 && parts[0] == "Bearer" {
            if claims, err := utils.ValidateJWT(parts[1]); err == nil {
                c.Set("user_id", claims.UserID)
                c.Set("username", claims.Username)
                c.Set("role", claims.Role)
            }
        }
        
        c.Next()
    }
}
```

## 🗄️ 数据库操作

### 数据库迁移策略

**设计思路**: 使用GORM的自动迁移功能，结合手动迁移脚本，确保数据库结构的一致性和可追溯性。

#### 迁移类型
1. **自动迁移**: 开发环境使用，自动同步模型结构
2. **手动迁移**: 生产环境使用，确保数据安全
3. **种子数据**: 初始化基础数据和测试数据

### 迁移和种子数据实现

```go
// cmd/main.go

// migrate 数据库迁移
// 功能: 自动创建或更新数据库表结构
func migrate() error {
    db, err := database.GetDB()
    if err != nil {
        return fmt.Errorf("获取数据库连接失败: %w", err)
    }
    
    // 自动迁移所有模型
    // 注意: 生产环境建议使用手动迁移脚本
    return db.AutoMigrate(
        &models.User{},      // 用户表
        &models.Course{},    // 课程表
        &models.Review{},    // 评价表
        &models.Tag{},       // 标签表
        &models.Favorite{},  // 收藏表
    )
}

// seed 初始化种子数据
// 功能: 创建基础数据，包括管理员用户和示例课程
func seed() error {
    db, err := database.GetDB()
    if err != nil {
        return fmt.Errorf("获取数据库连接失败: %w", err)
    }
    
    // 1. 创建管理员用户
    admin := &models.User{
        Username: "admin",
        Email:    "admin@whu.sb",
        Password: utils.HashPassword("admin123"), // 生产环境使用强密码
        Role:     "admin",
        Status:   "active",
    }
    
    if err := db.Create(admin).Error; err != nil {
        return fmt.Errorf("创建管理员用户失败: %w", err)
    }
    
    // 2. 创建示例课程数据
    courses := []models.Course{
        {
            Name:        "计算机科学导论",
            Code:        "CS101",
            Teacher:     "张三",
            Credits:     3,
            Description: "计算机科学基础课程，介绍计算机科学的基本概念和原理",
            Tags:        []string{"计算机", "基础", "导论"},
            Rating:      4.5,
            ReviewCount: 10,
        },
        {
            Name:        "数据结构与算法",
            Code:        "CS201",
            Teacher:     "李四",
            Credits:     4,
            Description: "数据结构与算法设计，学习常用的数据结构和算法",
            Tags:        []string{"计算机", "算法", "数据结构"},
            Rating:      4.8,
            ReviewCount: 15,
        },
        {
            Name:        "数据库系统原理",
            Code:        "CS301",
            Teacher:     "王五",
            Credits:     3,
            Description: "数据库系统的基本原理和设计方法",
            Tags:        []string{"计算机", "数据库", "系统"},
            Rating:      4.2,
            ReviewCount: 8,
        },
    }
    
    for _, course := range courses {
        if err := db.Create(&course).Error; err != nil {
            return fmt.Errorf("创建示例课程失败: %w", err)
        }
    }
    
    // 3. 创建示例标签
    tags := []models.Tag{
        {Name: "计算机", Category: "学科"},
        {Name: "数学", Category: "学科"},
        {Name: "物理", Category: "学科"},
        {Name: "基础", Category: "难度"},
        {Name: "进阶", Category: "难度"},
        {Name: "实践", Category: "类型"},
        {Name: "理论", Category: "类型"},
    }
    
    for _, tag := range tags {
        if err := db.Create(&tag).Error; err != nil {
            return fmt.Errorf("创建示例标签失败: %w", err)
        }
    }
    
    return nil
}

// reset 重置数据库
// 功能: 清空所有数据并重新初始化(仅开发环境使用)
func reset() error {
    db, err := database.GetDB()
    if err != nil {
        return err
    }
    
    // 删除所有表
    tables := []string{"users", "courses", "reviews", "tags", "favorites"}
    for _, table := range tables {
        if err := db.Exec(fmt.Sprintf("DROP TABLE IF EXISTS %s", table)).Error; err != nil {
            return err
        }
    }
    
    // 重新迁移和种子数据
    if err := migrate(); err != nil {
        return err
    }
    
    return seed()
}
```

## 🧪 测试

### 测试策略

**设计思路**: 采用分层测试策略，包括单元测试、集成测试和端到端测试，确保代码质量和系统稳定性。

#### 测试类型
1. **单元测试**: 测试单个函数或方法
2. **集成测试**: 测试模块间的交互
3. **端到端测试**: 测试完整的API流程

### 单元测试实现

**测试目标**: 验证Service层的业务逻辑正确性，使用Mock对象隔离依赖。

```go
// internal/services/course_service_test.go
package services

import (
    "context"
    "errors"
    "testing"
    "whu-sb/internal/models"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

// MockCourseRepository Mock课程Repository
type MockCourseRepository struct {
    mock.Mock
}

func (m *MockCourseRepository) Create(ctx context.Context, course *models.Course) error {
    args := m.Called(ctx, course)
    return args.Error(0)
}

func (m *MockCourseRepository) GetByCode(ctx context.Context, code string) (*models.Course, error) {
    args := m.Called(ctx, code)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*models.Course), args.Error(1)
}

// MockCacheService Mock缓存服务
type MockCacheService struct {
    mock.Mock
}

func (m *MockCacheService) Get(ctx context.Context, key string) (interface{}, error) {
    args := m.Called(ctx, key)
    return args.Get(0), args.Error(1)
}

func (m *MockCacheService) Set(ctx context.Context, key string, value interface{}, ttl int) error {
    args := m.Called(ctx, key, value, ttl)
    return args.Error(0)
}

func (m *MockCacheService) Delete(ctx context.Context, key string) error {
    args := m.Called(ctx, key)
    return args.Error(0)
}

// TestCourseService_CreateCourse 测试创建课程功能
func TestCourseService_CreateCourse(t *testing.T) {
    // 准备测试环境
    mockRepo := &MockCourseRepository{}
    mockCache := &MockCacheService{}
    service := NewCourseService(mockRepo, mockCache)
    
    // 定义测试用例
    tests := []struct {
        name        string
        req         *models.CreateCourseRequest
        setupMocks  func()
        wantErr     bool
        expectedErr string
    }{
        {
            name: "成功创建课程",
            req: &models.CreateCourseRequest{
                Name:        "测试课程",
                Code:        "TEST101",
                Teacher:     "测试教师",
                Credits:     3,
                Description: "测试课程描述",
                Tags:        []string{"测试", "课程"},
            },
            setupMocks: func() {
                // 模拟课程代码不存在
                mockRepo.On("GetByCode", mock.Anything, "TEST101").Return(nil, errors.New("not found"))
                // 模拟创建成功
                mockRepo.On("Create", mock.Anything, mock.AnythingOfType("*models.Course")).Return(nil)
                // 模拟清除缓存
                mockCache.On("Delete", mock.Anything, "courses:list").Return(nil)
                mockCache.On("Delete", mock.Anything, "courses:popular").Return(nil)
            },
            wantErr: false,
        },
        {
            name: "课程代码已存在",
            req: &models.CreateCourseRequest{
                Name:    "测试课程",
                Code:    "EXIST101",
                Teacher: "测试教师",
                Credits: 3,
            },
            setupMocks: func() {
                // 模拟课程代码已存在
                existingCourse := &models.Course{ID: 1, Code: "EXIST101"}
                mockRepo.On("GetByCode", mock.Anything, "EXIST101").Return(existingCourse, nil)
            },
            wantErr:     true,
            expectedErr: "课程代码已存在，请使用其他代码",
        },
        {
            name: "课程名称为空",
            req: &models.CreateCourseRequest{
                Name:    "",
                Code:    "TEST102",
                Teacher: "测试教师",
                Credits: 3,
            },
            setupMocks: func() {
                // 不需要设置Mock，因为会在验证阶段失败
            },
            wantErr:     true,
            expectedErr: "课程名称不能为空",
        },
        {
            name: "学分为负数",
            req: &models.CreateCourseRequest{
                Name:    "测试课程",
                Code:    "TEST103",
                Teacher: "测试教师",
                Credits: -1,
            },
            setupMocks: func() {
                // 不需要设置Mock，因为会在验证阶段失败
            },
            wantErr:     true,
            expectedErr: "学分必须大于0",
        },
    }
    
    // 执行测试用例
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // 重置Mock
            mockRepo.ExpectedCalls = nil
            mockCache.ExpectedCalls = nil
            
            // 设置Mock期望
            if tt.setupMocks != nil {
                tt.setupMocks()
            }
            
            // 执行测试
            _, err := service.CreateCourse(context.Background(), tt.req)
            
            // 验证结果
            if tt.wantErr {
                assert.Error(t, err)
                if tt.expectedErr != "" {
                    assert.Contains(t, err.Error(), tt.expectedErr)
                }
            } else {
                assert.NoError(t, err)
                // 验证Mock调用
                mockRepo.AssertExpectations(t)
                mockCache.AssertExpectations(t)
            }
        })
    }
}

// TestCourseService_GetCourses 测试获取课程列表功能
func TestCourseService_GetCourses(t *testing.T) {
    mockRepo := &MockCourseRepository{}
    mockCache := &MockCacheService{}
    service := NewCourseService(mockRepo, mockCache)
    
    filter := &models.CourseFilter{
        Page:     1,
        PageSize: 10,
        Search:   "测试",
    }
    
    expectedCourses := []*models.Course{
        {ID: 1, Name: "测试课程1", Code: "TEST101"},
        {ID: 2, Name: "测试课程2", Code: "TEST102"},
    }
    
    // 测试缓存未命中场景
    t.Run("缓存未命中", func(t *testing.T) {
        // 模拟缓存未命中
        mockCache.On("Get", mock.Anything, mock.AnythingOfType("string")).Return(nil, errors.New("not found"))
        // 模拟数据库查询
        mockRepo.On("List", mock.Anything, filter).Return(expectedCourses, int64(2), nil)
        // 模拟缓存设置
        mockCache.On("Set", mock.Anything, mock.AnythingOfType("string"), mock.Anything, mock.AnythingOfType("int")).Return(nil)
        
        courses, total, err := service.GetCourses(context.Background(), filter)
        
        assert.NoError(t, err)
        assert.Equal(t, int64(2), total)
        assert.Len(t, courses, 2)
        assert.Equal(t, "测试课程1", courses[0].Name)
        
        mockRepo.AssertExpectations(t)
        mockCache.AssertExpectations(t)
    })
    
    // 测试缓存命中场景
    t.Run("缓存命中", func(t *testing.T) {
        cachedResult := &models.CourseListResult{
            Courses: expectedCourses,
            Total:   2,
        }
        
        // 模拟缓存命中
        mockCache.On("Get", mock.Anything, mock.AnythingOfType("string")).Return(cachedResult, nil)
        
        courses, total, err := service.GetCourses(context.Background(), filter)
        
        assert.NoError(t, err)
        assert.Equal(t, int64(2), total)
        assert.Len(t, courses, 2)
        
        // 验证没有调用数据库
        mockRepo.AssertNotCalled(t, "List")
    })
}
```

### 集成测试实现

**测试目标**: 验证API端点的完整功能，包括请求处理、业务逻辑和数据持久化。

```go
// tests/integration/course_test.go
package integration

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
    "whu-sb/internal/models"
    "whu-sb/internal/testutils"
    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/suite"
)

// CourseAPITestSuite 课程API测试套件
type CourseAPITestSuite struct {
    suite.Suite
    router *gin.Engine
    db     *testutils.TestDB
}

// SetupSuite 测试套件初始化
func (suite *CourseAPITestSuite) SetupSuite() {
    // 设置测试模式
    gin.SetMode(gin.TestMode)
    
    // 初始化测试数据库
    suite.db = testutils.NewTestDB()
    suite.db.Setup()
    
    // 创建测试路由
    suite.router = setupTestRouter(suite.db)
}

// TearDownSuite 测试套件清理
func (suite *CourseAPITestSuite) TearDownSuite() {
    suite.db.Cleanup()
}

// SetupTest 每个测试用例初始化
func (suite *CourseAPITestSuite) SetupTest() {
    // 清理测试数据
    suite.db.Cleanup()
    // 重新初始化测试数据
    suite.db.Setup()
}

// TestCreateCourse 测试创建课程API
func (suite *CourseAPITestSuite) TestCreateCourse() {
    tests := []struct {
        name           string
        requestBody    models.CreateCourseRequest
        expectedStatus int
        expectedCode   int
        authToken      string
    }{
        {
            name: "管理员成功创建课程",
            requestBody: models.CreateCourseRequest{
                Name:        "测试课程",
                Code:        "TEST101",
                Teacher:     "测试教师",
                Credits:     3,
                Description: "测试课程描述",
                Tags:        []string{"测试", "课程"},
            },
            expectedStatus: http.StatusOK,
            expectedCode:   200,
            authToken:      testutils.GetAdminToken(),
        },
        {
            name: "普通用户无法创建课程",
            requestBody: models.CreateCourseRequest{
                Name:    "测试课程",
                Code:    "TEST102",
                Teacher: "测试教师",
                Credits: 3,
            },
            expectedStatus: http.StatusForbidden,
            expectedCode:   403,
            authToken:      testutils.GetUserToken(),
        },
        {
            name: "未认证用户无法创建课程",
            requestBody: models.CreateCourseRequest{
                Name:    "测试课程",
                Code:    "TEST103",
                Teacher: "测试教师",
                Credits: 3,
            },
            expectedStatus: http.StatusUnauthorized,
            expectedCode:   401,
            authToken:      "",
        },
        {
            name: "课程代码重复",
            requestBody: models.CreateCourseRequest{
                Name:    "重复课程",
                Code:    "CS101", // 已存在的课程代码
                Teacher: "测试教师",
                Credits: 3,
            },
            expectedStatus: http.StatusConflict,
            expectedCode:   409,
            authToken:      testutils.GetAdminToken(),
        },
    }
    
    for _, tt := range tests {
        suite.Run(tt.name, func() {
            // 准备请求
            body, _ := json.Marshal(tt.requestBody)
            req := httptest.NewRequest("POST", "/api/v1/admin/courses", bytes.NewBuffer(body))
            req.Header.Set("Content-Type", "application/json")
            if tt.authToken != "" {
                req.Header.Set("Authorization", "Bearer "+tt.authToken)
            }
            
            // 执行请求
            w := httptest.NewRecorder()
            suite.router.ServeHTTP(w, req)
            
            // 验证响应
            suite.Equal(tt.expectedStatus, w.Code)
            
            var response map[string]interface{}
            json.Unmarshal(w.Body.Bytes(), &response)
            suite.Equal(float64(tt.expectedCode), response["code"])
            
            // 验证成功创建的数据
            if tt.expectedStatus == http.StatusOK {
                suite.NotNil(response["data"])
                data := response["data"].(map[string]interface{})
                suite.Equal(tt.requestBody.Name, data["name"])
                suite.Equal(tt.requestBody.Code, data["code"])
            }
        })
    }
}

// TestGetCourses 测试获取课程列表API
func (suite *CourseAPITestSuite) TestGetCourses() {
    tests := []struct {
        name           string
        queryParams    string
        expectedStatus int
        expectedCount  int
    }{
        {
            name:           "获取所有课程",
            queryParams:    "",
            expectedStatus: http.StatusOK,
            expectedCount:  3, // 种子数据中的课程数量
        },
        {
            name:           "分页获取课程",
            queryParams:    "?page=1&page_size=2",
            expectedStatus: http.StatusOK,
            expectedCount:  2,
        },
        {
            name:           "搜索课程",
            queryParams:    "?search=计算机",
            expectedStatus: http.StatusOK,
            expectedCount:  1,
        },
        {
            name:           "按教师筛选",
            queryParams:    "?teacher=张三",
            expectedStatus: http.StatusOK,
            expectedCount:  1,
        },
        {
            name:           "按评分筛选",
            queryParams:    "?min_rating=4.5",
            expectedStatus: http.StatusOK,
            expectedCount:  2,
        },
    }
    
    for _, tt := range tests {
        suite.Run(tt.name, func() {
            // 准备请求
            req := httptest.NewRequest("GET", "/api/v1/courses"+tt.queryParams, nil)
            
            // 执行请求
            w := httptest.NewRecorder()
            suite.router.ServeHTTP(w, req)
            
            // 验证响应
            suite.Equal(tt.expectedStatus, w.Code)
            
            var response map[string]interface{}
            json.Unmarshal(w.Body.Bytes(), &response)
            suite.Equal(float64(200), response["code"])
            
            // 验证数据
            data := response["data"].(map[string]interface{})
            courses := data["courses"].([]interface{})
            suite.Len(courses, tt.expectedCount)
            
            // 验证分页信息
            if meta, exists := data["meta"]; exists {
                metaMap := meta.(map[string]interface{})
                suite.NotNil(metaMap["page"])
                suite.NotNil(metaMap["page_size"])
                suite.NotNil(metaMap["total"])
            }
        })
    }
}

// TestGetCourse 测试获取课程详情API
func (suite *CourseAPITestSuite) TestGetCourse() {
    tests := []struct {
        name           string
        courseID       string
        expectedStatus int
        expectedCode   int
    }{
        {
            name:           "获取存在的课程",
            courseID:       "1",
            expectedStatus: http.StatusOK,
            expectedCode:   200,
        },
        {
            name:           "获取不存在的课程",
            courseID:       "999",
            expectedStatus: http.StatusNotFound,
            expectedCode:   404,
        },
        {
            name:           "无效的课程ID",
            courseID:       "invalid",
            expectedStatus: http.StatusBadRequest,
            expectedCode:   400,
        },
    }
    
    for _, tt := range tests {
        suite.Run(tt.name, func() {
            // 准备请求
            req := httptest.NewRequest("GET", "/api/v1/courses/"+tt.courseID, nil)
            
            // 执行请求
            w := httptest.NewRecorder()
            suite.router.ServeHTTP(w, req)
            
            // 验证响应
            suite.Equal(tt.expectedStatus, w.Code)
            
            var response map[string]interface{}
            json.Unmarshal(w.Body.Bytes(), &response)
            suite.Equal(float64(tt.expectedCode), response["code"])
            
            // 验证成功获取的数据
            if tt.expectedStatus == http.StatusOK {
                suite.NotNil(response["data"])
                data := response["data"].(map[string]interface{})
                suite.Equal(float64(1), data["id"])
                suite.Equal("计算机科学导论", data["name"])
            }
        })
    }
}

// TestCourseAPISuite 运行测试套件
func TestCourseAPISuite(t *testing.T) {
    suite.Run(t, new(CourseAPITestSuite))
}
```

## 🚀 部署

### 部署策略

**设计思路**: 采用容器化部署，支持多环境配置和自动化部署流程。

#### 部署环境
1. **开发环境**: 本地Docker Compose，便于开发和测试
2. **测试环境**: 云服务器部署，用于集成测试
3. **生产环境**: 容器编排平台，支持高可用和自动扩缩容

### Docker 部署实现

**多阶段构建**: 使用多阶段Dockerfile优化镜像大小和构建效率。

```dockerfile
# Dockerfile
# 构建阶段
FROM golang:1.24-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache git ca-certificates tzdata

# 复制依赖文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用(静态链接，减小镜像大小)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -a -installsuffix cgo \
    -ldflags="-w -s" \
    -o main ./cmd/main.go

# 运行阶段
FROM alpine:latest

# 安装运行时依赖
RUN apk --no-cache add ca-certificates tzdata

# 创建非root用户
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# 设置工作目录
WORKDIR /app

# 复制二进制文件
COPY --from=builder /app/main .

# 复制配置文件
COPY --from=builder /app/config ./config

# 创建日志目录
RUN mkdir -p /app/logs && \
    chown -R appuser:appgroup /app

# 切换到非root用户
USER appuser

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# 运行应用
CMD ["./main", "serve"]
```

### Docker Compose 配置

**开发环境部署**: 使用Docker Compose快速搭建完整的开发环境。

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 主应用服务
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: whu-sb-backend
    ports:
      - "8080:8080"
    environment:
      # 数据库配置
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=whu_sb
      - DB_PASSWORD=whu_sb_password
      - DB_NAME=whu_sb
      # Redis配置
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      # 应用配置
      - APP_MODE=debug
      - JWT_SECRET=your_jwt_secret_key
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - whu-sb-network
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
  
  # MySQL数据库
  mysql:
    image: mysql:8.0
    container_name: whu-sb-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: whu_sb
      MYSQL_USER: whu_sb
      MYSQL_PASSWORD: whu_sb_password
      MYSQL_CHARACTER_SET_SERVER: utf8mb4
      MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
    volumes:
      - mysql_data:/var/lib/mysql
      - ./scripts/init_mysql.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    restart: unless-stopped
    networks:
      - whu-sb-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p$$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
  
  # Redis缓存
  redis:
    image: redis:6-alpine
    container_name: whu-sb-redis
    command: redis-server --appendonly yes --requirepass redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - whu-sb-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 10s
  
  # Nginx反向代理(可选)
  nginx:
    image: nginx:alpine
    container_name: whu-sb-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - whu-sb-network

# 数据卷
volumes:
  mysql_data:
    driver: local
  redis_data:
    driver: local

# 网络
networks:
  whu-sb-network:
    driver: bridge
```

#### 部署命令

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build

# 清理数据卷
docker-compose down -v
```

## 📊 监控和日志

### 日志系统设计

**设计思路**: 使用结构化日志记录系统运行状态，便于问题排查和性能分析。

#### 日志级别
- **DEBUG**: 详细的调试信息
- **INFO**: 一般信息，如请求处理、业务操作
- **WARN**: 警告信息，如配置问题、性能下降
- **ERROR**: 错误信息，如异常、失败操作
- **FATAL**: 致命错误，系统无法继续运行

### 结构化日志实现

```go
// internal/utils/logger.go
package utils

import (
    "os"
    "go.uber.org/zap"
    "go.uber.org/zap/zapcore"
)

var Logger *zap.Logger

// InitLogger 初始化日志系统
// 功能: 配置结构化日志，支持多级别输出
func InitLogger() {
    // 根据环境配置日志级别
    logLevel := getLogLevel()
    
    // 配置编码器
    encoderConfig := zap.NewProductionEncoderConfig()
    encoderConfig.TimeKey = "timestamp"
    encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
    encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
    encoderConfig.MessageKey = "message"
    encoderConfig.LevelKey = "level"
    
    // 创建配置
    config := zap.Config{
        Level:             zap.NewAtomicLevelAt(logLevel),
        Development:       false,
        DisableCaller:     false,
        DisableStacktrace: false,
        Sampling: &zap.SamplingConfig{
            Initial:    100,
            Thereafter: 100,
        },
        Encoding:         "json",
        EncoderConfig:   encoderConfig,
        OutputPaths:     []string{"stdout", "logs/app.log"},
        ErrorOutputPaths: []string{"stderr", "logs/error.log"},
    }
    
    var err error
    Logger, err = config.Build()
    if err != nil {
        panic("初始化日志失败: " + err.Error())
    }
    
    // 替换全局logger
    zap.ReplaceGlobals(Logger)
}

// getLogLevel 获取日志级别
func getLogLevel() zapcore.Level {
    level := os.Getenv("LOG_LEVEL")
    switch level {
    case "debug":
        return zapcore.DebugLevel
    case "info":
        return zapcore.InfoLevel
    case "warn":
        return zapcore.WarnLevel
    case "error":
        return zapcore.ErrorLevel
    default:
        return zapcore.InfoLevel
    }
}

// LoggingMiddleware HTTP请求日志中间件
// 功能: 记录所有HTTP请求的详细信息
func LoggingMiddleware() gin.HandlerFunc {
    return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
        // 记录请求信息
        Logger.Info("HTTP Request",
            zap.String("method", param.Method),
            zap.String("path", param.Path),
            zap.String("query", param.Request.URL.RawQuery),
            zap.Int("status", param.StatusCode),
            zap.Duration("latency", param.Latency),
            zap.String("client_ip", param.ClientIP),
            zap.String("user_agent", param.Request.UserAgent()),
            zap.Int("body_size", param.BodySize),
        )
        return ""
    })
}

// ErrorLoggingMiddleware 错误日志中间件
// 功能: 记录请求处理过程中的错误
func ErrorLoggingMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()
        
        // 记录错误信息
        if len(c.Errors) > 0 {
            for _, err := range c.Errors {
                Logger.Error("Request Error",
                    zap.String("method", c.Request.Method),
                    zap.String("path", c.Request.URL.Path),
                    zap.String("error", err.Error()),
                    zap.String("client_ip", c.ClientIP()),
                )
            }
        }
    }
}

// BusinessLogger 业务日志记录器
// 功能: 记录业务操作日志
type BusinessLogger struct {
    logger *zap.Logger
}

// NewBusinessLogger 创建业务日志记录器
func NewBusinessLogger() *BusinessLogger {
    return &BusinessLogger{
        logger: Logger.With(zap.String("module", "business")),
    }
}

// LogUserAction 记录用户操作
func (l *BusinessLogger) LogUserAction(userID uint, action, resource string, details map[string]interface{}) {
    l.logger.Info("User Action",
        zap.Uint("user_id", userID),
        zap.String("action", action),
        zap.String("resource", resource),
        zap.Any("details", details),
    )
}

// LogSystemEvent 记录系统事件
func (l *BusinessLogger) LogSystemEvent(event string, details map[string]interface{}) {
    l.logger.Info("System Event",
        zap.String("event", event),
        zap.Any("details", details),
    )
}
```

## 🔧 常用命令

### 开发命令

```bash
# 构建应用
go build -o course-backend ./cmd/main.go
go build -o review-sync-worker ./cmd/worker.go

# 运行应用
go run cmd/main.go serve
go run cmd/worker.go

# 运行测试
go test ./...                    # 运行所有测试
go test -cover ./...             # 运行测试并显示覆盖率
go test -v ./internal/services   # 详细输出服务层测试
go test -race ./...              # 检测竞态条件
go test -bench=. ./...           # 运行性能基准测试

# 代码质量检查
go fmt ./...                     # 格式化代码
go vet ./...                     # 静态代码分析
golint ./...                     # 代码风格检查
golangci-lint run               # 综合代码检查

# 生成文档
swag init -g cmd/main.go         # 生成Swagger API文档
godoc -http=:6060               # 启动Go文档服务器
```

### 数据库操作

```bash
# 数据库迁移
go run cmd/main.go migrate       # 执行数据库迁移
go run cmd/main.go seed          # 初始化种子数据
go run cmd/main.go reset         # 重置数据库(仅开发环境)

# 数据库连接测试
go run cmd/main.go db:test       # 测试数据库连接
go run cmd/main.go db:status     # 查看数据库状态
```

### Docker 操作

```bash
# 构建镜像
docker build -t whu-sb-backend .                    # 构建应用镜像
docker build -f Dockerfile.static -t whu-sb-static . # 构建静态镜像

# 运行容器
docker run -d -p 8080:8080 whu-sb-backend          # 运行应用容器
docker-compose up -d                               # 启动完整环境
docker-compose up -d --build                       # 重新构建并启动

# 查看状态
docker-compose ps                                  # 查看服务状态
docker-compose logs -f app                         # 查看应用日志
docker-compose logs -f mysql                       # 查看数据库日志

# 停止服务
docker-compose down                                # 停止所有服务
docker-compose down -v                             # 停止并清理数据卷
```

### 部署命令

```bash
# 生产环境部署
docker-compose -f docker-compose.prod.yml up -d    # 生产环境部署
docker-compose -f docker-compose.prod.yml down     # 停止生产服务

# 备份和恢复
docker exec whu-sb-mysql mysqldump -u root -p whu_sb > backup.sql  # 备份数据库
docker exec -i whu-sb-mysql mysql -u root -p whu_sb < backup.sql   # 恢复数据库
```

### 监控和调试

```bash
# 性能分析
go tool pprof http://localhost:8080/debug/pprof/profile  # CPU性能分析
go tool pprof http://localhost:8080/debug/pprof/heap     # 内存分析

# 系统监控
docker stats                                        # 查看容器资源使用
docker-compose top                                  # 查看进程信息

# 日志分析
docker-compose logs --tail=100 app                  # 查看最近100行日志
docker-compose logs -f --since=1h app               # 查看最近1小时的日志
```

## 📖 详细文档

### 核心开发指南

#### API 开发
- [RESTful 设计原则](/dev/backend/api-design#restful设计原则) - API设计规范和最佳实践
- [路由配置](/dev/backend/api-design#路由设计) - 路由组织结构和中间件配置
- [请求验证](/dev/backend/api-design#数据验证) - 参数验证和错误处理机制
- [错误处理](/dev/backend/api-design#错误处理) - 统一错误响应格式和处理流程

#### 数据库操作
- [数据模型定义](/dev/backend/database#数据模型) - 实体设计和关系映射
- [GORM 使用指南](/dev/backend/database#gorm-使用) - ORM框架配置和基本操作
- [查询优化技巧](/dev/backend/database#查询优化) - 性能优化和索引策略
- [事务处理](/dev/backend/database#事务处理) - 事务管理和数据一致性

#### 权限管理
- [RBAC 模型](/dev/backend/rbac#权限模型) - 基于角色的访问控制
- [JWT 认证](/dev/backend/rbac#jwt认证) - 无状态认证机制
- [中间件开发](/dev/backend/rbac#认证中间件) - 认证和授权中间件
- [权限检查](/dev/backend/rbac#权限检查工具) - 权限验证工具和最佳实践

#### 缓存系统
- [Redis 配置](/dev/backend/cache-strategy#redis配置) - Redis连接和配置管理
- [缓存策略](/dev/backend/cache-strategy#缓存策略) - 缓存模式和策略选择
- [缓存失效](/dev/backend/cache-strategy#缓存失效) - 缓存失效机制和策略
- [性能优化](/dev/backend/cache-strategy#性能优化) - 缓存性能优化技巧

### 高级主题

#### 系统架构
- [微服务架构](/dev/backend/architecture#微服务设计) - 服务拆分和通信机制
- [消息队列](/dev/backend/architecture#消息队列) - 异步处理和事件驱动
- [分布式缓存](/dev/backend/architecture#分布式缓存) - 缓存集群和一致性
- [负载均衡](/dev/backend/architecture#负载均衡) - 流量分发和故障转移

#### 性能优化
- [数据库优化](/dev/backend/performance#数据库优化) - 查询优化和索引策略
- [缓存优化](/dev/backend/performance#缓存优化) - 缓存命中率和策略优化
- [并发处理](/dev/backend/performance#并发处理) - 并发控制和资源管理
- [监控指标](/dev/backend/performance#监控指标) - 性能监控和告警机制

#### 安全防护
- [认证安全](/dev/backend/security#认证安全) - 密码安全和Token管理
- [数据安全](/dev/backend/security#数据安全) - 数据加密和脱敏处理
- [接口安全](/dev/backend/security#接口安全) - API安全防护和限流
- [审计日志](/dev/backend/security#审计日志) - 操作审计和安全监控

## 🎯 开发最佳实践

### 代码质量

1. **代码规范**: 遵循 Go 官方代码规范和项目编码标准
2. **错误处理**: 统一使用自定义错误类型，提供有意义的错误信息
3. **日志记录**: 使用结构化日志记录关键操作和异常情况
4. **测试覆盖**: 保持高测试覆盖率，单元测试覆盖率不低于80%
5. **文档更新**: 及时更新API文档和代码注释

### 性能优化

1. **数据库优化**: 合理使用索引，避免N+1查询问题
2. **缓存策略**: 根据数据特性选择合适的缓存策略
3. **并发控制**: 使用适当的并发控制机制，避免竞态条件
4. **资源管理**: 及时释放资源，避免内存泄漏

### 安全防护

1. **认证授权**: 实现完善的认证和授权机制
2. **数据验证**: 对所有输入数据进行严格验证
3. **敏感信息**: 避免在日志和错误信息中暴露敏感数据
4. **安全审计**: 定期进行安全审计和漏洞扫描

### 运维监控

1. **健康检查**: 实现应用健康检查接口
2. **性能监控**: 监控关键性能指标和系统资源
3. **告警机制**: 设置合理的告警阈值和通知机制
4. **日志分析**: 定期分析日志，发现潜在问题

### 部署发布

1. **环境隔离**: 严格区分开发、测试、生产环境
2. **配置管理**: 使用环境变量和配置文件管理配置
3. **回滚机制**: 实现快速回滚机制，确保系统稳定性
4. **备份策略**: 定期备份数据库和配置文件

### 团队协作

1. **代码审查**: 所有代码变更必须经过代码审查
2. **版本控制**: 使用语义化版本控制，保持提交信息规范
3. **知识分享**: 定期进行技术分享和文档更新
4. **持续改进**: 根据项目反馈持续改进开发流程

通过遵循本文档中的开发指南和最佳实践，可以构建出高质量、可维护、高性能的后端服务。记住，优秀的代码不仅要能工作，更要易于理解、测试和维护。
