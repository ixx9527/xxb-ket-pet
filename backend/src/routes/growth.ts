import { Router } from 'express'
import { query } from '../database.js'

const router = Router()

// 获取用户成长信息
router.get('/profile', async (req, res) => {
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
  } catch (error) {
    console.error('Get growth profile error:', error)
    res.status(500).json({ error: '获取成长信息失败' })
  }
})

// 获取打卡日历
router.get('/calendar', async (req, res) => {
  try {
    const userId = req.query.userId
    const { month, year } = req.query
    
    const result = await query(
      `SELECT checkin_date, category, points_earned
       FROM checkin_calendar
       WHERE user_id = $1 
         AND EXTRACT(MONTH FROM checkin_date) = $2
         AND EXTRACT(YEAR FROM checkin_date) = $3
       ORDER BY checkin_date DESC`,
      [userId, month, year]
    )
    
    res.json({ calendar: result.rows })
  } catch (error) {
    console.error('Get calendar error:', error)
    res.status(500).json({ error: '获取日历失败' })
  }
})

// 获取勋章列表
router.get('/badges', async (req, res) => {
  try {
    const userId = req.query.userId
    
    const result = await query(
      `SELECT g.badges, g.points
       FROM growth g
       WHERE g.user_id = $1`,
      [userId]
    )
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Get badges error:', error)
    res.status(500).json({ error: '获取勋章失败' })
  }
})

export default router
