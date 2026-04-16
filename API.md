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
