import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Query executed:', { text, duration, rows: result.rowCount })
    return result
  } catch (error: any) {
    console.error('Database query error:', error.message)
    throw error
  }
}

export const initDatabase = async () => {
  try {
    const result = await query('SELECT NOW()', [])
    console.log('✅ 数据库连接成功:', result.rows[0].now)
  } catch (error: any) {
    console.error('❌ 数据库连接失败:', error.message)
    throw error
  }
}

export default pool
