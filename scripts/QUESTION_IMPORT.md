# 📚 星星榜题库导入指南

## 📋 目录

1. [导入方式](#导入方式)
2. [JSON 格式说明](#json-格式说明)
3. [CSV 格式说明](#csv-格式说明)
4. [使用命令行导入](#使用命令行导入)
5. [使用 API 导入](#使用-api-导入)
6. [题目字段说明](#题目字段说明)
7. [示例数据](#示例数据)

---

## 🚀 导入方式

### 方式一：命令行导入（推荐）

适合一次性批量导入大量题目。

### 方式二：API 导入

适合通过网页界面上传导入。

---

## 📄 JSON 格式说明

### 完整示例

```json
[
  {
    "category": "KET",
    "part": "Reading Part 1",
    "question_type": "single_choice",
    "content": "What does this sign say? [图片：NO SMOKING]",
    "options": [
      {"key": "A", "text": "You can smoke here."},
      {"key": "B", "text": "You cannot smoke here."},
      {"key": "C", "text": "Smoking area"}
    ],
    "answer": "B",
    "explanation": "NO SMOKING 意思是\"禁止吸烟\"。",
    "difficulty": 1,
    "source": "2023 年真题",
    "tags": ["标志识别", "词汇"],
    "audio_url": null,
    "image_url": "https://example.com/images/no-smoking.png"
  },
  {
    "category": "PET",
    "part": "Reading Part 2",
    "question_type": "single_choice",
    "content": "Complete the sentence: If I ___ enough money, I would buy a new car.",
    "options": [
      {"key": "A", "text": "have"},
      {"key": "B", "text": "had"},
      {"key": "C", "text": "have had"}
    ],
    "answer": "B",
    "explanation": "虚拟语气：If I had...I would...（与现在事实相反）",
    "difficulty": 3,
    "source": "2023 年真题",
    "tags": ["语法", "虚拟语气"]
  }
]
```

---

## 📊 CSV 格式说明

### CSV 表头

```csv
category,part,question_type,content,options,answer,explanation,difficulty,source,tags,audio_url,image_url
```

### 示例数据

```csv
KET,Reading Part 1,single_choice,"What does this sign say?","[{""key"":""A"",""text"":""Yes""},{""key"":""B"",""text"":""No""}]",B,"Simple sign recognition",1,2023 年真题，"[""标志识别""]",,
PET,Reading Part 2,single_choice,"Complete the sentence","[{""key"":""A"",""text"":""have""},{""key"":""B"",""text"":""had""}]",B,"Subjunctive mood",3,2023 年真题，"[""语法"",""虚拟语气""]",,
```

### CSV 注意事项

1. **options 字段**：必须是 JSON 字符串，双引号需要转义（`""`）
2. **tags 字段**：必须是 JSON 数组字符串
3. **content 字段**：如果包含逗号，需要用双引号包裹
4. **空字段**：可以留空，默认为 null

---

## 💻 使用命令行导入

### 1. 准备数据文件

将题目保存为 `questions.json` 或 `questions.csv`

### 2. 进入后端目录

```bash
cd /home/www/xxb-ket-pet/backend
```

### 3. 安装依赖（首次使用）

```bash
npm install
```

### 4. 执行导入

```bash
# 导入 JSON 文件
npm run import-questions -- --file=./questions.json

# 导入 CSV 文件
npm run import-questions -- --file=./questions.csv

# 只导入 KET 题目
npm run import-questions -- --file=./questions.json --category=KET

# 只导入 PET 题目
npm run import-questions -- --file=./questions.json --category=PET
```

### 5. 查看结果

导入完成后会显示：
- ✅ 成功导入的题目数量
- ❌ 失败的题目数量及原因
- 📊 当前题库统计（KET/PET 各多少题）

---

## 🌐 使用 API 导入

### 接口地址

```
POST /api/questions/import
```

### 请求格式

- **Content-Type**: `multipart/form-data`
- **参数**: `file` (JSON 文件)

### 使用 curl 示例

```bash
curl -X POST http://localhost:3001/api/questions/import \
  -F "file=@questions.json"
```

### 使用 JavaScript 示例

```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])

const response = await fetch('/api/questions/import', {
  method: 'POST',
  body: formData
})

const result = await response.json()
console.log(`成功：${result.successCount} 题`)
console.log(`失败：${result.failCount} 题`)
```

### 响应示例

```json
{
  "success": true,
  "message": "导入完成",
  "successCount": 48,
  "failCount": 2,
  "errors": [
    {"index": 5, "error": "缺少字段：answer"},
    {"index": 12, "error": "category 必须是 KET 或 PET"}
  ]
}
```

---

## 📝 题目字段说明

### 必需字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `category` | string | 类别 | `"KET"` 或 `"PET"` |
| `part` | string | 部分 | `"Reading Part 1"` |
| `question_type` | string | 题型 | `"single_choice"`, `"multiple_choice"`, `"fill_blank"`, `"matching"` |
| `content` | string | 题目内容 | `"What does this sign say?"` |
| `options` | array/object | 选项 | `[{"key":"A","text":"..."}]` |
| `answer` | string | 正确答案 | `"B"` 或 `["A","C"]` |

### 可选字段

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `explanation` | string | null | 答案解析 |
| `difficulty` | number | 1 | 难度（1-5） |
| `source` | string | "导入数据" | 题目来源 |
| `tags` | array/string | [] | 标签数组 |
| `audio_url` | string | null | 听力音频 URL |
| `image_url` | string | null | 题目图片 URL |

### 题型说明

- `single_choice`: 单选题
- `multiple_choice`: 多选题
- `fill_blank`: 填空题
- `matching`: 匹配题
- `word_formation`: 词形转换题

### 难度级别

- `1`: 简单
- `2`: 中等
- `3`: 较难
- `4`: 困难
- `5`: 专家

---

## 📦 示例数据

### 示例 1：KET 阅读题

```json
{
  "category": "KET",
  "part": "Reading Part 1",
  "question_type": "single_choice",
  "content": "What does this sign say? [图片：NO PARKING]",
  "options": [
    {"key": "A", "text": "You can park here."},
    {"key": "B", "text": "You cannot park here."},
    {"key": "C", "text": "Free parking."}
  ],
  "answer": "B",
  "explanation": "NO PARKING 意思是\"禁止停车\"。",
  "difficulty": 1,
  "source": "2023 年真题",
  "tags": ["标志识别", "词汇"]
}
```

### 示例 2：PET 语法题

```json
{
  "category": "PET",
  "part": "Use of English Part 2",
  "question_type": "fill_blank",
  "content": "Complete with the correct form: She has been working here ___ 2015.",
  "options": [
    {"key": "A", "text": "since"},
    {"key": "B", "text": "for"},
    {"key": "C", "text": "from"}
  ],
  "answer": "A",
  "explanation": "现在完成进行时 + since + 时间点。",
  "difficulty": 2,
  "source": "2023 年真题",
  "tags": ["语法", "介词", "完成时"]
}
```

### 示例 3：听力题（带音频）

```json
{
  "category": "KET",
  "part": "Listening Part 1",
  "question_type": "single_choice",
  "content": "You will hear: \"What time is it?\" \"It's half past three.\"\n\nWhat time is it?",
  "options": [
    {"key": "A", "text": "3:00"},
    {"key": "B", "text": "3:30"},
    {"key": "C", "text": "4:30"}
  ],
  "answer": "B",
  "explanation": "half past three 是 3:30。",
  "difficulty": 1,
  "source": "2023 年真题",
  "tags": ["听力", "时间"],
  "audio_url": "https://example.com/audio/ket-listening-01.mp3"
}
```

---

## 🔧 常见问题

### Q: 导入失败怎么办？

A: 检查以下几点：
1. JSON 格式是否正确（可以用 JSON 验证工具）
2. 必需字段是否完整
3. category 是否为 KET 或 PET
4. difficulty 是否在 1-5 之间
5. options 是否为有效的 JSON 数组

### Q: 如何更新已有题目？

A: 使用 API 的 PUT 接口：
```
PUT /api/questions/:id
```

### Q: 如何删除题目？

A: 使用 API 的 DELETE 接口：
```
DELETE /api/questions/:id
```

### Q: 如何查看已导入的题目？

A: 使用 API 的 GET 接口：
```
GET /api/questions/list
GET /api/questions/list?category=KET
GET /api/questions/list?page=1&limit=20
```

---

## 📞 技术支持

遇到问题？检查以下内容：

1. ✅ 数据库连接是否正常
2. ✅ 题目格式是否正确
3. ✅ 查看导入日志获取详细错误信息

---

**最后更新**: 2026-04-17
