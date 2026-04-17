import { Router, Request, Response } from 'express'
import { query } from '../database.js'
import bcrypt from 'bcryptjs'

const router = Router()

// 获取当前用户信息
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string)
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户 ID' })
    }
    
    // 获取用户基本信息
    const userResult = await query(
      `SELECT u.id, u.name, u.nickname, u.grade, u.avatar_url, 
              u.parent_phone, u.parent_wechat, u.created_at,
              ua.username, ua.is_active, ua.last_login_at
       FROM users u
       LEFT JOIN user_accounts ua ON u.id = ua.user_id
       WHERE u.id = $1`,
      [userId]
    )
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    // 获取成长信息
    const growthResult = await query(
      `SELECT points, level, level_name, badges, streak_days, 
              longest_streak, total_practice_days, total_questions
       FROM growth WHERE user_id = $1`,
      [userId]
    )
    
    const user = userResult.rows[0]
    const growth = growthResult.rows[0] || {
      points: 0,
      level: 1,
      level_name: '英语小苗',
      badges: [],
      streak_days: 0,
      longest_streak: 0,
      total_practice_days: 0,
      total_questions: 0
    }
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        nickname: user.nickname,
        grade: user.grade,
        avatar_url: user.avatar_url,
        parent_phone: user.parent_phone,
        parent_wechat: user.parent_wechat,
        is_active: user.is_active,
        last_login_at: user.last_login_at,
        created_at: user.created_at
      },
      growth: {
        points: growth.points,
        level: growth.level,
        level_name: growth.level_name,
        badges: growth.badges || [],
        streak_days: growth.streak_days,
        longest_streak: growth.longest_streak,
        total_practice_days: growth.total_practice_days,
        total_questions: growth.total_questions
      }
    })
  } catch (error: any) {
    console.error('Get user profile error:', error.message)
    res.status(500).json({ error: '获取用户信息失败' })
  }
})

// 更新用户资料
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string)
    const { name, nickname, grade, avatar_url, parent_phone, parent_wechat } = req.body
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户 ID' })
    }
    
    // 更新用户信息
    await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           nickname = COALESCE($2, nickname),
           grade = COALESCE($3, grade),
           avatar_url = COALESCE($4, avatar_url),
           parent_phone = COALESCE($5, parent_phone),
           parent_wechat = COALESCE($6, parent_wechat),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [name, nickname, grade, avatar_url, parent_phone, parent_wechat, userId]
    )
    
    res.json({ success: true, message: '资料更新成功' })
  } catch (error: any) {
    console.error('Update user profile error:', error.message)
    res.status(500).json({ error: '更新资料失败' })
  }
})

// 修改密码
router.put('/change-password', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string)
    const { oldPassword, newPassword } = req.body
    
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: '参数不完整' })
    }
    
    // 获取当前密码
    const result = await query(
      'SELECT password_hash FROM user_accounts WHERE user_id = $1',
      [userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用户账号不存在' })
    }
    
    const isValid = await bcrypt.compare(oldPassword, result.rows[0].password_hash)
    
    if (!isValid) {
      return res.status(401).json({ error: '原密码错误' })
    }
    
    // 加密新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    
    // 更新密码
    await query(
      'UPDATE user_accounts SET password_hash = $1 WHERE user_id = $2',
      [newPasswordHash, userId]
    )
    
    res.json({ success: true, message: '密码修改成功' })
  } catch (error: any) {
    console.error('Change password error:', error.message)
    res.status(500).json({ error: '修改密码失败' })
  }
})

// 获取用户列表（老师/管理员用）
router.get('/list', async (req: Request, res: Response) => {
  try {
    const { grade, page = '1', limit = '20' } = req.query
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const offset = (pageNum - 1) * limitNum
    
    let sql = `
      SELECT u.id, u.name, u.nickname, u.grade, u.avatar_url,
             ua.username, ua.is_active, ua.last_login_at,
             g.points, g.level, g.level_name
      FROM users u
      LEFT JOIN user_accounts ua ON u.id = ua.user_id
      LEFT JOIN growth g ON u.id = g.user_id
      WHERE 1=1
    `
    
    const params: any[] = []
    
    if (grade) {
      sql += ` AND u.grade = $${params.length + 1}`
      params.push(grade)
    }
    
    sql += ` ORDER BY u.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limitNum, offset)
    
    const result = await query(sql, params)
    
    // 获取总数
    const countSql = `
      SELECT COUNT(*) as total FROM users u
      LEFT JOIN user_accounts ua ON u.id = ua.user_id
      WHERE 1=1 ${grade ? 'AND u.grade = $1' : ''}
    `
    const countResult = await query(countSql, grade ? [grade] : [])
    
    res.json({
      users: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limitNum)
      }
    })
  } catch (error: any) {
    console.error('Get user list error:', error.message)
    res.status(500).json({ error: '获取用户列表失败' })
  }
})

export default router
