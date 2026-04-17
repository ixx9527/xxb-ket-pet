# 📡 星星榜 API 文档

## 基础信息

- **Base URL**: `/api`
- **认证方式**: JWT Token（在 Header 中携带 `Authorization: Bearer <token>`）

---

## 🔐 认证接口

### POST /auth/login

用户登录

**请求体**:
```json
{
  "username": "student001",
  "password": "password123"
}
```

**响应**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "student001"
  }
}
```

### POST /auth/register

注册用户（通常需要老师操作）

**请求体**:
```json
{
  "username": "student001",
  "password": "password123",
  "name": "张三",
  "grade": 3,
  "parentPhone": "13800138000"
}
```

### GET /middleware/verify

验证 Token 是否有效

**Header**: `Authorization: Bearer <token>`

**响应**:
```json
{
  "valid": true,
  "user": {
    "userId": 1,
    "username": "student001"
  }
}
```

### POST /middleware/refresh

刷新 Token

**Header**: `Authorization: Bearer <token>`

**响应**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": 1,
    "username": "student001"
  }
}
```

---

## 👤 用户管理接口

### GET /user/profile

获取用户详细信息

**参数**:
- `userId`: 用户 ID

**响应**:
```json
{
  "user": {
    "id": 1,
    "username": "student001",
    "name": "张三",
    "nickname": "小明",
    "grade": 3,
    "avatar_url": "https://...",
    "parent_phone": "13800138000",
    "parent_wechat": "wx123456",
    "is_active": true,
    "last_login_at": "2026-04-17T08:00:00Z",
    "created_at": "2026-01-01T00:00:00Z"
  },
  "growth": {
    "points": 240,
    "level": 3,
    "level_name": "英语小树",
    "badges": [
      {"id": "badge_001", "name": "坚持小能手", "earned_at": "2026-04-10"}
    ],
    "streak_days": 12,
    "longest_streak": 15,
    "total_practice_days": 20,
    "total_questions": 100
  }
}
```

### PUT /user/profile

更新用户资料

**参数**:
- `userId`: 用户 ID

**请求体** (所有字段可选):
```json
{
  "name": "张三",
  "nickname": "小明",
  "grade": 4,
  "avatar_url": "https://...",
  "parent_phone": "13800138000",
  "parent_wechat": "wx123456"
}
```

**响应**:
```json
{
  "success": true,
  "message": "资料更新成功"
}
```

### PUT /user/change-password

修改密码

**参数**:
- `userId`: 用户 ID

**请求体**:
```json
{
  "oldPassword": "old123",
  "newPassword": "new123"
}
```

**响应**:
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

### GET /user/list

获取用户列表（老师/管理员用）

**参数**:
- `grade`: 年级（可选）
- `page`: 页码（默认 1）
- `limit`: 每页数量（默认 20）

**响应**:
```json
{
  "users": [
    {
      "id": 1,
      "name": "张三",
      "nickname": "小明",
      "grade": 3,
      "avatar_url": "https://...",
      "username": "student001",
      "is_active": true,
      "last_login_at": "2026-04-17T08:00:00Z",
      "points": 240,
      "level": 3,
      "level_name": "英语小树"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

## 📚 练习接口

### GET /practice/daily

获取每日练习题目

**参数**:
- `userId`: 用户 ID
- `category`: KET 或 PET（默认 KET）

**响应**:
```json
{
  "completed": false,
  "questions": [
    {
      "id": 1,
      "category": "KET",
      "part": "Reading Part 1",
      "question_type": "single_choice",
      "content": "What does this sign say?",
      "options": [
        {"key": "A", "text": "You can park here."},
        {"key": "B", "text": "You cannot park here."},
        {"key": "C", "text": "Free parking."}
      ],
      "difficulty": 1,
      "audio_url": null,
      "image_url": null
    }
  ],
  "timeLimit": 900
}
```

### POST /practice/submit

提交练习答案

**请求体**:
```json
{
  "userId": 1,
  "category": "KET",
  "answers": [
    {
      "questionId": 1,
      "selectedAnswer": "B",
      "timeSpent": 30
    }
  ]
}
```

**响应**:
```json
{
  "success": true,
  "score": 5,
  "total": 5,
  "pointsEarned": 70,
  "practiceId": 123
}
```

---

## ❌ 错题接口

### GET /mistakes

获取错题列表

**参数**:
- `userId`: 用户 ID

**响应**:
```json
{
  "mistakes": [
    {
      "id": 1,
      "question_id": 10,
      "wrong_count": 3,
      "last_wrong_at": "2026-04-16T10:30:00Z",
      "mastered": false,
      "content": "题目内容...",
      "options": [...],
      "answer": "B",
      "explanation": "解析...",
      "category": "KET"
    }
  ]
}
```

### PUT /mistakes/:questionId/master

标记错题已掌握

**参数**:
- `questionId`: 题目 ID
- `userId`: 用户 ID（query 参数）

**响应**:
```json
{
  "success": true
}
```

---

## 🏆 成长接口

### GET /growth/profile

获取用户成长信息

**参数**:
- `userId`: 用户 ID

**响应**:
```json
{
  "id": 1,
  "user_id": 1,
  "name": "张三",
  "avatar_url": null,
  "points": 240,
  "level": 1,
  "level_name": "英语小苗",
  "min_points": 0,
  "badges": [],
  "streak_days": 12,
  "longest_streak": 15,
  "total_practice_days": 20,
  "total_questions": 100,
  "total_checkins": 20
}
```

### GET /growth/calendar

获取打卡日历

**参数**:
- `userId`: 用户 ID
- `year`: 年份
- `month`: 月份

**响应**:
```json
{
  "calendar": [
    {
      "checkin_date": "2026-04-16",
      "category": "KET",
      "points_earned": 70
    }
  ]
}
```

### GET /growth/badges

获取勋章列表

**参数**:
- `userId`: 用户 ID

**响应**:
```json
{
  "badges": [
    {"id": "badge_001", "name": "坚持小能手", "earned_at": "2026-04-10"}
  ],
  "points": 240
}
```

---

## 📊 错误响应

所有接口错误时返回统一格式：

```json
{
  "error": "错误信息"
}
```

**常见错误码**:
- `400`: 请求参数错误
- `401`: 未授权（Token 无效或过期）
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 🔑 认证示例

```javascript
// 登录后保存 Token
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  const data = await response.json()
  localStorage.setItem('token', data.token)
}

// 请求时携带 Token
const fetchWithAuth = async (url) => {
  const token = localStorage.getItem('token')
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.json()
}
```
