import { Router, Request, Response } from 'express'
import { query } from '../database.js'

const router = Router()

// 获取错题列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId
    
    const result = await query(
      `SELECT m.*, q.content, q.options, q.answer, q.explanation, q.category
       FROM mistakes m
       JOIN questions q ON m.question_id = q.id
       WHERE m.user_id = $1 AND m.mastered = FALSE
       ORDER BY m.last_wrong_at DESC`,
      [userId]
    )
    
    res.json({ mistakes: result.rows })
  } catch (error: any) {
    console.error('Get mistakes error:', error.message)
    res.status(500).json({ error: '获取错题失败' })
  }
})

// 标记错题已掌握
router.put('/:questionId/master', async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params
    const userId = req.query.userId
    
    await query(
      `UPDATE mistakes SET mastered = TRUE, mastered_at = NOW()
       WHERE user_id = $1 AND question_id = $2`,
      [userId, questionId]
    )
    
    res.json({ success: true })
  } catch (error: any) {
    console.error('Mark mistake as mastered error:', error.message)
    res.status(500).json({ error: '操作失败' })
  }
})

export default router
