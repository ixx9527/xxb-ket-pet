import { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: number
  username: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

const router = Router()

// JWT 验证中间件
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未授权，请先登录' })
    }
    
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    
    req.user = decoded
    next()
  } catch (error: any) {
    console.error('JWT verification error:', error.message)
    return res.status(401).json({ error: 'Token 无效或已过期' })
  }
}

// 验证 Token 是否有效
router.get('/verify', authMiddleware, (req: Request, res: Response) => {
  res.json({
    valid: true,
    user: req.user
  })
})

// 刷新 Token
router.post('/refresh', authMiddleware, (req: Request, res: Response) => {
  try {
    const { userId, username } = req.user!
    
    // 生成新的 Token
    const newToken = jwt.sign(
      { userId, username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    res.json({
      token: newToken,
      user: { userId, username }
    })
  } catch (error: any) {
    console.error('Token refresh error:', error.message)
    res.status(500).json({ error: '刷新 Token 失败' })
  }
})

export default router
