import { Router, Request, Response } from 'express'
import { query } from '../database.js'
import multer from 'multer'

const router = Router()

// 配置 multer 处理文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true)
    } else {
      cb(new Error('只支持 JSON 格式文件'))
    }
  }
})

// 获取题目列表
router.get('/list', async (req: Request, res: Response) => {
  try {
    const { category, part, difficulty, page = '1', limit = '20' } = req.query
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const offset = (pageNum - 1) * limitNum
    
    let sql = 'SELECT * FROM questions WHERE is_active = TRUE'
    const params: any[] = []
    
    if (category) {
      params.push(category)
      sql += ` AND category = $${params.length}`
    }
    
    if (part) {
      params.push(part)
      sql += ` AND part = $${params.length}`
    }
    
    if (difficulty) {
      params.push(parseInt(difficulty as string))
      sql += ` AND difficulty = $${params.length}`
    }
    
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limitNum, offset)
    
    const result = await query(sql, params)
    
    // 获取总数
    const countSql = 'SELECT COUNT(*) as total FROM questions WHERE is_active = TRUE'
    const countResult = await query(countSql, [])
    
    res.json({
      questions: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limitNum)
      }
    })
  } catch (error: any) {
    console.error('Get questions error:', error.message)
    res.status(500).json({ error: '获取题目列表失败' })
  }
})

// 获取单道题目
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id)
    
    const result = await query(
      'SELECT * FROM questions WHERE id = $1 AND is_active = TRUE',
      [questionId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '题目不存在' })
    }
    
    res.json({ question: result.rows[0] })
  } catch (error: any) {
    console.error('Get question error:', error.message)
    res.status(500).json({ error: '获取题目失败' })
  }
})

// 批量导入题目（JSON 格式）
router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文件' })
    }
    
    const content = req.file.buffer.toString('utf-8')
    const questions = JSON.parse(content)
    
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'JSON 必须是数组格式' })
    }
    
    let successCount = 0
    let failCount = 0
    const errors: any[] = []
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      
      // 验证必需字段
      const required = ['category', 'part', 'question_type', 'content', 'options', 'answer']
      const missingFields = required.filter(field => !q[field])
      
      if (missingFields.length > 0) {
        failCount++
        errors.push({ index: i, error: `缺少字段：${missingFields.join(', ')}` })
        continue
      }
      
      // 验证 category
      if (!['KET', 'PET'].includes(q.category)) {
        failCount++
        errors.push({ index: i, error: 'category 必须是 KET 或 PET' })
        continue
      }
      
      try {
        await query(
          `INSERT INTO questions (
            category, part, question_type, content, options, answer,
            explanation, difficulty, source, tags, audio_url, image_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            q.category,
            q.part,
            q.question_type,
            q.content,
            JSON.stringify(typeof q.options === 'string' ? JSON.parse(q.options) : q.options),
            q.answer,
            q.explanation || null,
            q.difficulty || 1,
            q.source || '导入数据',
            typeof q.tags === 'string' ? q.tags : JSON.stringify(q.tags || []),
            q.audio_url || null,
            q.image_url || null
          ]
        )
        
        successCount++
      } catch (error: any) {
        failCount++
        errors.push({ index: i, error: error.message })
      }
    }
    
    res.json({
      success: true,
      message: `导入完成`,
      successCount,
      failCount,
      errors: errors.slice(0, 10) // 只显示前 10 个错误
    })
  } catch (error: any) {
    console.error('Import questions error:', error.message)
    res.status(500).json({ error: '导入失败：' + error.message })
  }
})

// 删除题目
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id)
    
    await query(
      'UPDATE questions SET is_active = FALSE WHERE id = $1',
      [questionId]
    )
    
    res.json({ success: true, message: '题目已删除' })
  } catch (error: any) {
    console.error('Delete question error:', error.message)
    res.status(500).json({ error: '删除题目失败' })
  }
})

// 更新题目
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id)
    const {
      category, part, question_type, content, options, answer,
      explanation, difficulty, source, tags, audio_url, image_url
    } = req.body
    
    await query(
      `UPDATE questions SET
        category = COALESCE($1, category),
        part = COALESCE($2, part),
        question_type = COALESCE($3, question_type),
        content = COALESCE($4, content),
        options = COALESCE($5, options),
        answer = COALESCE($6, answer),
        explanation = COALESCE($7, explanation),
        difficulty = COALESCE($8, difficulty),
        source = COALESCE($9, source),
        tags = COALESCE($10, tags),
        audio_url = COALESCE($11, audio_url),
        image_url = COALESCE($12, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13`,
      [
        category, part, question_type, content,
        options ? JSON.stringify(options) : null,
        answer, explanation, difficulty, source,
        tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
        audio_url, image_url, questionId
      ]
    )
    
    res.json({ success: true, message: '题目已更新' })
  } catch (error: any) {
    console.error('Update question error:', error.message)
    res.status(500).json({ error: '更新题目失败' })
  }
})

// 获取题目统计
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT 
        category,
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active,
        AVG(difficulty) as avg_difficulty
       FROM questions
       GROUP BY category
       ORDER BY category`
    )
    
    res.json({ stats: result.rows })
  } catch (error: any) {
    console.error('Get stats error:', error.message)
    res.status(500).json({ error: '获取统计失败' })
  }
})

export default router
