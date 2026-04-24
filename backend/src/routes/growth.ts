import { Router, Request, Response } from 'express'
import { query } from '../database.js'

const router = Router()

// 获取用户成长信息
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId
    
    const result = await query(
      `SELECT points, level, badges, total_practice_days, total_questions
       FROM growth
       WHERE user_id = $1`,
      [userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    const data = result.rows[0]
    res.json({
      points: data.points || 0,
      level: data.level || 1,
      badges: data.badges || [],
      total_practice_days: data.total_practice_days || 0,
      total_questions: data.total_questions || 0
    })
  } catch (error: any) {
    console.error('Get growth info error:', error.message)
    res.status(500).json({ error: '获取成长信息失败' })
  }
})

// 获取用户成长信息（旧接口兼容）
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId
    
    const result = await query(
      `SELECT g.*, u.name, u.avatar_url,
              lc.level_name, lc.min_points,
              (SELECT COUNT(*) FROM checkin_calendar WHERE user_id = $1) as total_checkins
       FROM growth g
       JOIN users u ON g.user_id = u.id
       JOIN level_config lc ON g.level = lc.level
       WHERE g.user_id = $1`,
      [userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    res.json(result.rows[0])
  } catch (error: any) {
    console.error('Get growth profile error:', error.message)
    res.status(500).json({ error: '获取成长信息失败' })
  }
})

// 获取打卡日历
router.get('/calendar', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string
    const { month, year } = req.query as { month?: string, year?: string }
    
    const result = await query(
      `SELECT checkin_date, category, points_earned
       FROM checkin_calendar
       WHERE user_id = $1 
         AND EXTRACT(MONTH FROM checkin_date) = $2
         AND EXTRACT(YEAR FROM checkin_date) = $3
       ORDER BY checkin_date DESC`,
      [userId, String(month || 1), String(year || new Date().getFullYear())]
    )
    
    res.json({ calendar: result.rows })
  } catch (error: any) {
    console.error('Get calendar error:', error.message)
    res.status(500).json({ error: '获取日历失败' })
  }
})

// 获取勋章列表
router.get('/badges', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string
    
    const result = await query(
      `SELECT g.badges, g.points
       FROM growth g
       WHERE g.user_id = $1`,
      [userId]
    )
    
    res.json(result.rows[0])
  } catch (error: any) {
    console.error('Get badges error:', error.message)
    res.status(500).json({ error: '获取勋章失败' })
  }
})

export default router
