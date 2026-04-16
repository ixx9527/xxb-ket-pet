import { Router, Request, Response } from 'express'
import { query } from '../database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

interface RegisterBody {
  username: string
  password: string
  name: string
  grade: number
  parentPhone: string
}

interface LoginBody {
  username: string
  password: string
}

// 登录
router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { username, password } = req.body
    
    const result = await query(
      'SELECT * FROM user_accounts WHERE username = $1',
      [username]
    )
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    
    const user = result.rows[0]
    const isValid = await bcrypt.compare(password, user.password_hash)
    
    if (!isValid) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    
    // 生成 JWT
    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    // 更新最后登录时间
    await query(
      'UPDATE user_accounts SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    )
    
    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username
      }
    })
  } catch (error: any) {
    console.error('Login error:', error.message)
    res.status(500).json({ error: '登录失败' })
  }
})

// 注册
router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { username, password, name, grade, parentPhone } = req.body
    
    // 检查用户名是否存在
    const existing = await query(
      'SELECT * FROM user_accounts WHERE username = $1',
      [username]
    )
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: '用户名已存在' })
    }
    
    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10)
    
    // 创建用户
    const userResult = await query(
      `INSERT INTO users (name, grade, parent_phone) 
       VALUES ($1, $2, $3) RETURNING id`,
      [name, grade, parentPhone]
    )
    
    const userId = userResult.rows[0].id
    
    // 创建账号
    await query(
      `INSERT INTO user_accounts (user_id, username, password_hash) 
       VALUES ($1, $2, $3) RETURNING id`,
      [userId, username, passwordHash]
    )
    
    // 初始化成长记录
    await query(
      'INSERT INTO growth (user_id) VALUES ($1)',
      [userId]
    )
    
    res.json({ success: true, userId })
  } catch (error: any) {
    console.error('Register error:', error.message)
    res.status(500).json({ error: '注册失败' })
  }
})

export default router
