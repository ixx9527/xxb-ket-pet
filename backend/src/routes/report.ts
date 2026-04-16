import { Router } from 'express'
import { query } from '../database.js'
import dayjs from 'dayjs'

const router = Router()

// 获取学习报告（周报/月报）
router.get('/summary', async (req, res) => {
  try {
    const userId = req.query.userId
    const { type = 'weekly' } = req.query // weekly or monthly
    
    const now = dayjs()
    const startDate = type === 'weekly' 
      ? now.startOf('week') 
      : now.startOf('month')
    const endDate = now.endOf(type === 'weekly' ? 'week' : 'month')
    
    // 获取练习统计
    const practiceStats = await query(
      `SELECT 
         COUNT(*) as total_practices,
         COALESCE(SUM(correct_count), 0) as total_correct,
         COALESCE(SUM(total_questions), 0) as total_questions,
         COALESCE(AVG(correct_count::float / NULLIF(total_questions, 0) * 100), 0) as avg_correct_rate
       FROM daily_practice
       WHERE user_id = $1 
         AND practice_date BETWEEN $2 AND $3
         AND completed = TRUE`,
      [userId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    )
    
    // 获取打卡天数
    const checkinDays = await query(
      `SELECT COUNT(DISTINCT checkin_date) as days
       FROM checkin_calendar
       WHERE user_id = $1 
         AND checkin_date BETWEEN $2 AND $3`,
      [userId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    )
    
    // 获取薄弱点（错误率最高的题目类型）
    const weakPoints = await query(
      `SELECT q.category, q.part, 
              COUNT(*) as total, 
              SUM(CASE WHEN a.is_correct THEN 0 ELSE 1 END) as wrong_count
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.user_id = $1 
         AND a.answered_at BETWEEN $2 AND $3
       GROUP BY q.category, q.part
       HAVING COUNT(*) >= 3
       ORDER BY wrong_count::float / COUNT(*) DESC
       LIMIT 3`,
      [userId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    )
    
    // 生成建议
    const suggestions = generateSuggestions(weakPoints.rows, practiceStats.rows[0])
    
    res.json({
      type,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      stats: {
        totalPractices: parseInt(practiceStats.rows[0].total_practices),
        totalCorrect: parseInt(practiceStats.rows[0].total_correct),
        totalQuestions: parseInt(practiceStats.rows[0].total_questions),
        avgCorrectRate: parseFloat(practiceStats.rows[0].avg_correct_rate).toFixed(1),
        checkinDays: parseInt(checkinDays.rows[0].days)
      },
      weakPoints: weakPoints.rows,
      suggestions
    })
  } catch (error) {
    console.error('Get report summary error:', error)
    res.status(500).json({ error: '获取报告失败' })
  }
})

// 获取打卡日历（按月）
router.get('/calendar', async (req, res) => {
  try {
    const userId = req.query.userId
    const { year, month } = req.query
    
    const result = await query(
      `SELECT 
         checkin_date, 
         category, 
         points_earned,
         EXTRACT(DAY FROM checkin_date) as day
       FROM checkin_calendar
       WHERE user_id = $1 
         AND EXTRACT(YEAR FROM checkin_date) = $2
         AND EXTRACT(MONTH FROM checkin_date) = $3
       ORDER BY checkin_date DESC`,
      [userId, year, month]
    )
    
    // 按日期分组
    const calendarMap = {}
    result.rows.forEach(row => {
      const day = row.day
      if (!calendarMap[day]) {
        calendarMap[day] = {
          day,
          completed: false,
          categories: []
        }
      }
      calendarMap[day].completed = true
      calendarMap[day].categories.push({
        category: row.category,
        points: row.points_earned
      })
    })
    
    // 获取当月总天数
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth()
    const calendar = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      return calendarMap[day] || { day, completed: false, categories: [] }
    })
    
    res.json({ calendar })
  } catch (error) {
    console.error('Get calendar error:', error)
    res.status(500).json({ error: '获取日历失败' })
  }
})

// 获取排行榜
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'week', limit = 10 } = req.query
    
    const now = dayjs()
    const startDate = type === 'week' 
      ? now.startOf('week').format('YYYY-MM-DD')
      : now.startOf('month').format('YYYY-MM-DD')
    
    const result = await query(
      `SELECT 
         u.id, u.name, u.avatar_url,
         g.points, g.level, g.level_name,
         COUNT(DISTINCT c.checkin_date) as checkin_days
       FROM users u
       JOIN growth g ON u.id = g.user_id
       LEFT JOIN checkin_calendar c ON u.id = c.user_id 
         AND c.checkin_date >= $1
       GROUP BY u.id, g.points, g.level, g.level_name
       ORDER BY checkin_days DESC, g.points DESC
       LIMIT $2`,
      [startDate, parseInt(limit)]
    )
    
    res.json({
      type,
      leaderboard: result.rows.map((row, index) => ({
        rank: index + 1,
        ...row
      }))
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({ error: '获取排行榜失败' })
  }
})

// 获取勋章列表
router.get('/badges', async (req, res) => {
  try {
    const userId = req.query.userId
    
    // 获取用户勋章
    const userBadges = await query(
      `SELECT badges FROM growth WHERE user_id = $1`,
      [userId]
    )
    
    // 获取所有勋章配置
    const allBadges = await query(
      `SELECT * FROM badge_config ORDER BY points_reward DESC`,
      []
    )
    
    // 合并信息
    const userBadgeIds = userBadges.rows[0]?.badges?.map(b => b.id) || []
    
    const badges = allBadges.rows.map(badge => ({
      ...badge,
      earned: userBadgeIds.includes(badge.badge_id),
      earnedAt: userBadges.rows[0]?.badges?.find(b => b.id === badge.badge_id)?.earned_at
    }))
    
    res.json({ badges })
  } catch (error) {
    console.error('Get badges error:', error)
    res.status(500).json({ error: '获取勋章失败' })
  }
})

// 生成学习建议
function generateSuggestions(weakPoints, stats) {
  const suggestions = []
  
  if (weakPoints.length > 0) {
    const weakest = weakPoints[0]
    suggestions.push(`你的${weakest.part}正确率较低，建议多做相关练习。`)
  }
  
  if (stats.avg_correct_rate < 60) {
    suggestions.push('正确率有待提高，建议先复习基础知识再做题。')
  } else if (stats.avg_correct_rate > 90) {
    suggestions.push('太棒了！正确率很高，可以尝试更高难度的题目。')
  }
  
  if (stats.total_practices < 5) {
    suggestions.push('本周练习次数较少，坚持每天练习进步更快哦！')
  }
  
  return suggestions
}

export default router
