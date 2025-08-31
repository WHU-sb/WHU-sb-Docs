# API设计规范

WHU.sb 后端API采用RESTful设计原则，提供统一、可预测的接口。本文档详细说明API设计规范、实现方法和最佳实践。

## 设计目标

### 核心原则
- **RESTful设计**: 遵循REST架构风格，使用标准HTTP方法和状态码
- **一致性**: 统一的请求/响应格式和错误处理机制
- **可预测性**: 清晰的URL结构和参数命名规范
- **可扩展性**: 支持版本控制和向后兼容

### 技术选型
- **Web框架**: Gin - 高性能、轻量级的Go Web框架
- **数据验证**: 内置验证器 + 自定义验证规则
- **响应格式**: 统一的JSON响应结构
- **错误处理**: 标准化的错误码和错误信息

## API实现示例

### 课程管理API

课程管理API展示了完整的CRUD操作实现，包括参数验证、业务逻辑处理和响应格式化。

#### 获取课程列表

**功能说明**: 支持分页、搜索、筛选和排序的课程列表查询

**设计思路**: 
- 使用查询参数进行灵活的数据过滤
- 实现分页机制避免大量数据返回
- 支持多字段搜索和排序
- 返回标准化的分页元数据

**路由定义**:
```go
// internal/handlers/course.go
func (h *CourseHandler) GetCourses(c *gin.Context) {
    // 获取查询参数
    page := utils.GetIntQuery(c, "page", 1)
    pageSize := utils.GetIntQuery(c, "page_size", 20)
    search := c.Query("search")
    category := c.Query("category")
    sortBy := c.Query("sort_by")
    sortOrder := c.Query("sort_order")
    
    // 参数验证
    if page < 1 {
        page = 1
    }
    if pageSize < 1 || pageSize > 100 {
        pageSize = 20
    }
    
    // 构建查询条件
    filter := &models.CourseFilter{
        Search:    search,
        Category:  category,
        SortBy:    sortBy,
        SortOrder: sortOrder,
        Page:      page,
        PageSize:  pageSize,
    }
    
    // 调用服务层
    courses, total, err := h.courseService.GetCourses(c.Request.Context(), filter)
    if err != nil {
        response.Error(c, http.StatusInternalServerError, "获取课程列表失败", err)
        return
    }
    
    // 构建响应
    response.Success(c, gin.H{
        "courses": courses,
        "meta": gin.H{
            "page":       page,
            "page_size":  pageSize,
            "total":      total,
            "total_pages": int(math.Ceil(float64(total) / float64(pageSize))),
        },
    })
}
```

**服务层实现**：
```go
// internal/services/course.go
func (s *CourseService) GetCourses(ctx context.Context, filter *models.CourseFilter) ([]*models.Course, int64, error) {
    // 构建查询
    query := s.db.Model(&models.Course{})
    
    // 搜索条件
    if filter.Search != "" {
        searchTerm := "%" + filter.Search + "%"
        query = query.Where("name LIKE ? OR code LIKE ? OR description LIKE ?", 
            searchTerm, searchTerm, searchTerm)
    }
    
    // 分类过滤
    if filter.Category != "" {
        query = query.Where("category = ?", filter.Category)
    }
    
    // 获取总数
    var total int64
    if err := query.Count(&total).Error; err != nil {
        return nil, 0, err
    }
    
    // 排序
    if filter.SortBy != "" {
        order := filter.SortBy
        if filter.SortOrder == "desc" {
            order += " DESC"
        }
        query = query.Order(order)
    } else {
        query = query.Order("created_at DESC")
    }
    
    // 分页
    offset := (filter.Page - 1) * filter.PageSize
    query = query.Offset(offset).Limit(filter.PageSize)
    
    // 执行查询
    var courses []*models.Course
    if err := query.Preload("Teacher").Find(&courses).Error; err != nil {
        return nil, 0, err
    }
    
    return courses, total, nil
}
```

**API响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "courses": [
      {
        "id": "1",
        "name": "数据结构与算法",
        "code": "CS101",
        "credits": 4,
        "description": "本课程介绍基本的数据结构和算法...",
        "category": "计算机科学",
        "rating": 4.5,
        "review_count": 128,
        "teacher": {
          "id": "1",
          "name": "张三",
          "title": "教授"
        },
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "page_size": 20,
      "total": 156,
      "total_pages": 8
    }
  }
}
```

#### 创建课程评价

**路由定义**：
```go
// internal/handlers/review.go
func (h *ReviewHandler) CreateReview(c *gin.Context) {
    // 获取用户信息
    userID := middleware.GetUserID(c)
    if userID == "" {
        response.Error(c, http.StatusUnauthorized, "用户未登录", nil)
        return
    }
    
    // 解析请求体
    var req models.CreateReviewRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, http.StatusBadRequest, "请求参数错误", err)
        return
    }
    
    // 验证课程是否存在
    course, err := h.courseService.GetCourseByID(c.Request.Context(), req.CourseID)
    if err != nil {
        response.Error(c, http.StatusNotFound, "课程不存在", err)
        return
    }
    
    // 检查用户是否已经评价过该课程
    exists, err := h.reviewService.HasUserReviewed(c.Request.Context(), userID, req.CourseID)
    if err != nil {
        response.Error(c, http.StatusInternalServerError, "检查评价状态失败", err)
        return
    }
    if exists {
        response.Error(c, http.StatusConflict, "您已经评价过该课程", nil)
        return
    }
    
    // 创建评价
    review := &models.Review{
        UserID:    userID,
        CourseID:  req.CourseID,
        Rating:    req.Rating,
        Content:   req.Content,
        Difficulty: req.Difficulty,
        Workload:  req.Workload,
        Tags:      req.Tags,
    }
    
    if err := h.reviewService.CreateReview(c.Request.Context(), review); err != nil {
        response.Error(c, http.StatusInternalServerError, "创建评价失败", err)
        return
    }
    
    // 更新课程评分
    if err := h.courseService.UpdateCourseRating(c.Request.Context(), req.CourseID); err != nil {
        // 记录错误但不影响主流程
        log.Error("更新课程评分失败", "course_id", req.CourseID, "error", err)
    }
    
    response.Success(c, gin.H{
        "review": review,
        "message": "评价创建成功",
    })
}
```

**请求验证**：
```go
// internal/models/review.go
type CreateReviewRequest struct {
    CourseID   string   `json:"course_id" binding:"required"`
    Rating     int      `json:"rating" binding:"required,min=1,max=5"`
    Content    string   `json:"content" binding:"required,min=10,max=2000"`
    Difficulty int      `json:"difficulty" binding:"required,min=1,max=5"`
    Workload   int      `json:"workload" binding:"required,min=1,max=5"`
    Tags       []string `json:"tags" binding:"max=10"`
}

func (r *CreateReviewRequest) Validate() error {
    if r.Rating < 1 || r.Rating > 5 {
        return errors.New("评分必须在1-5之间")
    }
    
    if len(r.Content) < 10 {
        return errors.New("评价内容至少10个字符")
    }
    
    if len(r.Tags) > 10 {
        return errors.New("标签数量不能超过10个")
    }
    
    return nil
}
```

### 中间件实现示例

#### 认证中间件

```go
// internal/middleware/auth.go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 获取Authorization头
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            response.Error(c, http.StatusUnauthorized, "缺少认证信息", nil)
            c.Abort()
            return
        }
        
        // 解析Bearer token
        tokenParts := strings.Split(authHeader, " ")
        if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
            response.Error(c, http.StatusUnauthorized, "认证格式错误", nil)
            c.Abort()
            return
        }
        
        token := tokenParts[1]
        
        // 验证JWT token
        claims, err := utils.ValidateJWT(token)
        if err != nil {
            response.Error(c, http.StatusUnauthorized, "Token无效", err)
            c.Abort()
            return
        }
        
        // 检查token是否过期
        if time.Now().Unix() > claims.ExpiresAt {
            response.Error(c, http.StatusUnauthorized, "Token已过期", nil)
            c.Abort()
            return
        }
        
        // 将用户信息存储到上下文中
        c.Set("user_id", claims.UserID)
        c.Set("user_role", claims.Role)
        c.Set("user_permissions", claims.Permissions)
        
        c.Next()
    }
}
```

#### 限流中间件

```go
// internal/middleware/rate_limit.go
func RateLimitMiddleware(limit int, window time.Duration) gin.HandlerFunc {
    limiter := rate.NewLimiter(rate.Every(window/time.Duration(limit)), limit)
    
    return func(c *gin.Context) {
        if !limiter.Allow() {
            response.Error(c, http.StatusTooManyRequests, "请求过于频繁，请稍后再试", nil)
            c.Abort()
            return
        }
        c.Next()
    }
}

// 使用Redis实现的分布式限流
func RedisRateLimitMiddleware(limit int, window time.Duration) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 获取客户端IP
        clientIP := c.ClientIP()
        key := fmt.Sprintf("rate_limit:%s", clientIP)
        
        // 检查Redis中的计数
        count, err := redis.Client.Get(c.Request.Context(), key).Int()
        if err != nil && err != redis.Nil {
            log.Error("Redis限流检查失败", "error", err)
            c.Next()
            return
        }
        
        if count >= limit {
            response.Error(c, http.StatusTooManyRequests, "请求过于频繁，请稍后再试", nil)
            c.Abort()
            return
        }
        
        // 增加计数
        pipe := redis.Client.Pipeline()
        pipe.Incr(c.Request.Context(), key)
        pipe.Expire(c.Request.Context(), key, window)
        _, err = pipe.Exec(c.Request.Context())
        
        if err != nil {
            log.Error("Redis限流更新失败", "error", err)
        }
        
        c.Next()
    }
}
```

### 错误处理示例

```go
// internal/response/response.go
type Response struct {
    Code    int         `json:"code"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
    Error   string      `json:"error,omitempty"`
}

func Success(c *gin.Context, data interface{}) {
    c.JSON(http.StatusOK, Response{
        Code:    http.StatusOK,
        Message: "success",
        Data:    data,
    })
}

func Error(c *gin.Context, code int, message string, err error) {
    response := Response{
        Code:    code,
        Message: message,
    }
    
    // 在开发环境下返回详细错误信息
    if gin.Mode() == gin.DebugMode && err != nil {
        response.Error = err.Error()
    }
    
    c.JSON(code, response)
}

// 自定义错误类型
type AppError struct {
    Code    int
    Message string
    Err     error
}

func (e *AppError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%s: %v", e.Message, e.Err)
    }
    return e.Message
}

func NewAppError(code int, message string, err error) *AppError {
    return &AppError{
        Code:    code,
        Message: message,
        Err:     err,
    }
}
```

## 设计原则

### RESTful架构原则

**资源导向设计**：API以资源为中心，每个资源都有唯一的URI标识。资源应该是名词而非动词，例如使用 `/courses` 而不是 `/getCourses`。

**HTTP方法语义化**：充分利用HTTP方法的语义，GET用于获取资源，POST用于创建，PUT用于完整更新，PATCH用于部分更新，DELETE用于删除。

**状态码规范化**：使用标准HTTP状态码表达请求结果，200表示成功，4xx表示客户端错误，5xx表示服务器错误。

**无状态设计**：每个请求都包含完整的信息，不依赖服务器端的状态。

### 版本控制策略

**URL版本控制**：在URL中包含版本号，如 `/api/v1/courses`。这种方式简单直观，便于客户端选择版本。

**向后兼容性**：新版本应该保持向后兼容，废弃的API需要标记deprecated并提供迁移指南。

**版本生命周期管理**：制定明确的版本废弃和删除时间表，给客户端足够的迁移时间。

## 路由设计规范

### 路由结构设计

路由结构应该反映资源的层次关系，遵循以下原则：

1. **资源层次化**：主资源在前，子资源在后，如 `/courses/{id}/reviews`
2. **操作明确化**：使用HTTP方法区分操作，避免在URL中使用动词
3. **版本隔离**：不同版本的API使用不同的路径前缀
4. **权限分组**：按权限要求对路由进行分组，便于中间件管理

### 路由命名规范

- 使用小写字母和连字符分隔单词
- 资源名称使用复数形式
- 避免使用缩写，保持可读性
- 特殊操作使用明确的路径，如 `/auth/login`

## 请求处理规范

### 请求头规范

**必需头信息**：
- `Content-Type`: 指定请求体格式，通常为 `application/json`
- `Authorization`: 包含认证信息，格式为 `Bearer <token>`
- `Accept`: 指定期望的响应格式

**可选头信息**：
- `Accept-Language`: 指定语言偏好
- `User-Agent`: 客户端标识信息
- `X-Request-ID`: 请求追踪标识

### 参数验证规范

**查询参数验证**：
- 分页参数必须有合理的默认值和上限
- 搜索参数需要长度限制和特殊字符过滤
- 排序参数必须限制在预定义的字段范围内
- 所有参数都需要类型验证和格式检查

**请求体验证**：
- 使用结构体标签进行验证，如 `binding:"required,min=1,max=100"`
- 自定义验证器处理业务逻辑验证
- 敏感字段需要特殊处理，如密码强度检查
- 数组和嵌套对象需要递归验证

### 数据格式规范

**JSON格式要求**：
- 使用驼峰命名法
- 避免使用null值，使用omitempty标签
- 时间格式统一使用ISO 8601标准
- 数字类型明确，避免字符串表示数字

## 响应设计规范

### 统一响应结构

所有API响应都应该遵循统一的格式，包含以下字段：

- `code`: 状态码，与HTTP状态码保持一致
- `message`: 响应消息，提供人类可读的描述
- `data`: 响应数据，可以是对象、数组或null
- `meta`: 元数据，用于分页、统计等信息

### 分页响应规范

分页响应需要包含完整的元数据信息：

- `page`: 当前页码，从1开始
- `page_size`: 每页数量
- `total`: 总记录数
- `total_pages`: 总页数

分页参数应该有合理的默认值和上限，避免过大的查询影响性能。

### 错误响应规范

错误响应应该提供足够的信息帮助客户端和开发者理解问题：

- 错误码应该具有明确的含义
- 错误消息应该简洁明了
- 对于验证错误，应该提供具体的字段错误信息
- 避免在错误响应中暴露敏感信息

## 认证和授权规范

### JWT认证规范

**Token结构**：JWT应该包含用户ID、角色、过期时间等必要信息，避免存储敏感数据。

**Token管理**：实现access token和refresh token机制，access token短期有效，refresh token长期有效。

**Token安全**：使用强密钥，设置合理的过期时间，实现token黑名单机制。

### 权限控制规范

**RBAC模型**：基于角色的访问控制，定义角色和权限的映射关系。

**权限粒度**：细粒度的权限控制，支持资源级别的权限检查。

**权限缓存**：缓存用户权限信息，避免频繁的数据库查询。

## 性能优化规范

### 缓存策略

**响应缓存**：对频繁访问的数据实现缓存，设置合理的过期时间。

**缓存键设计**：使用有意义的缓存键，包含版本信息和参数信息。

**缓存失效**：实现智能的缓存失效策略，确保数据一致性。

### 查询优化

**分页查询**：使用数据库的分页功能，避免全表扫描。

**索引优化**：为常用查询字段创建合适的索引。

**查询限制**：限制查询结果的数量，避免过大的响应。

## 安全规范

### 输入验证

**参数验证**：对所有输入参数进行严格的验证，防止注入攻击。

**内容过滤**：对用户输入的内容进行过滤，防止XSS攻击。

**文件上传**：限制文件类型和大小，验证文件内容。

### 访问控制

**权限检查**：在每个需要权限的接口中进行权限验证。

**资源隔离**：确保用户只能访问自己的资源。

**审计日志**：记录重要的操作日志，便于安全审计。

## 监控和日志规范

### 请求日志

**结构化日志**：使用结构化格式记录请求日志，便于分析。

**敏感信息过滤**：在日志中过滤敏感信息，如密码、token等。

**性能指标**：记录请求处理时间、响应大小等性能指标。

### 错误监控

**错误分类**：对错误进行分类，区分客户端错误和服务器错误。

**错误统计**：统计错误频率，及时发现系统问题。

**告警机制**：对关键错误设置告警，及时通知相关人员。

## API文档规范

### 文档结构

**接口描述**：每个接口都应该有清晰的描述，说明用途和功能。

**参数说明**：详细说明每个参数的类型、格式、是否必需等信息。

**响应示例**：提供成功和失败的响应示例。

**错误码说明**：列出所有可能的错误码和对应的含义。

### 文档维护

**自动生成**：使用工具自动生成API文档，如Swagger。

**版本同步**：确保文档与代码版本保持同步。

**示例更新**：定期更新示例，确保示例的有效性。

## 测试规范

### 单元测试

**接口测试**：为每个API接口编写单元测试，覆盖正常和异常情况。

**参数测试**：测试各种参数组合，包括边界值和异常值。

**权限测试**：测试不同权限用户的访问控制。

### 集成测试

**端到端测试**：测试完整的业务流程。

**性能测试**：测试接口的性能表现。

**安全测试**：测试接口的安全性，如权限绕过、注入攻击等。

---

**总结**：API设计应该遵循RESTful原则，提供统一的接口格式，实现完善的认证授权机制，注重性能优化和安全性，并提供清晰的文档和充分的测试覆盖。
