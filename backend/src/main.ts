import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDatabase } from './database.js'
import authRoutes from './routes/auth.js'
import practiceRoutes from './routes/practice.js'
import mistakeRoutes from './routes/mistakes.js'
import growthRoutes from './routes/growth.js'
import reportRoutes from './routes/report.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// 健康检查
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/practice', practiceRoutes)
app.use('/api/mistakes', mistakeRoutes)
app.use('/api/growth', growthRoutes)
app.use('/api/report', reportRoutes)

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

// 错误处理
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

// 启动服务器
const start = async () => {
  try {
    // 初始化数据库连接
    await initDatabase()
    
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 服务器启动成功：http://0.0.0.0:${PORT}`)
    })
  } catch (error: any) {
    console.error('启动失败:', error.message)
    process.exit(1)
  }
}

start()
