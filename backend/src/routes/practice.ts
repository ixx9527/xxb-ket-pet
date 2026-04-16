import { Router, Request, Response } from 'express'
import { query } from '../database.js'

const router = Router()

interface PracticeAnswer {
  questionId: number
  selectedAnswer: string
  timeSpent?: number
}

interface PracticeSubmit {
  userId: number
  category: string
  answers: PracticeAnswer[]
}

// 获取今日练习题目
router.get('/daily', async (req: Request, res: Response) => {
  try {
    const { category = 'KET', userId } = req.query
    const today = new Date().toISOString().split('T')[0]
    
    if (userId) {
      const existing = await query(
        'SELECT * FROM daily_practice WHERE user_id = $1 AND practice_date = $2 AND category = $3',
        [userId, today, category]
      )
      
      if (existing.rows.length > 0 && existing.rows[0].completed) {
        return res.json({ completed: true, practice: existing.rows[0] })
      }
    }
    
    // 获取随机 5 道题
    const result = await query(
      `SELECT id, category, part, question_type, content, options, difficulty, audio_url, image_url
       FROM questions 
       WHERE category = $1 AND is_active = TRUE 
       ORDER BY RANDOM() 
       LIMIT 5`,
      [category]
    )
    
    res.json({
      completed: false,
      questions: result.rows,
      timeLimit: 900
    })
  } catch (error: any) {
    console.error('Get daily practice error:', error.message)
    res.status(500).json({ error: '获取题目失败' })
  }
})

// 提交练习答案
router.post('/submit', async (req: Request<{}, {}, PracticeSubmit>, res: Response) => {
  try {
    const { userId, category, answers } = req.body
    const today = new Date().toISOString().split('T')[0]
    let correctCount = 0
    let totalTimeSpent = 0
    
    await query('BEGIN', [])
    
    const practiceResult = await query(
      `INSERT INTO daily_practice (user_id, practice_date, category)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, practice_date, category) 
       DO UPDATE SET started_at = NOW()
       RETURNING id`,
      [userId, today, category]
    )
    
    const practiceId = practiceResult.rows[0].id
    
    for (const answer of answers) {
      const questionResult = await query(
        'SELECT answer FROM questions WHERE id = $1',
        [answer.questionId]
      )
      
      const isCorrect = questionResult.rows[0].answer === answer.selectedAnswer
      if (isCorrect) correctCount++
      totalTimeSpent += answer.timeSpent || 0
      
      await query(
        `INSERT INTO answers (user_id, question_id, daily_practice_id, selected_answer, is_correct, time_spent)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, answer.questionId, practiceId, answer.selectedAnswer, isCorrect, answer.timeSpent || 0]
      )
      
      if (!isCorrect) {
        await query(
          `INSERT INTO mistakes (user_id, question_id, wrong_count, last_wrong_at)
           VALUES ($1, $2, 1, NOW())
           ON CONFLICT (user_id, question_id) 
           DO UPDATE SET wrong_count = mistakes.wrong_count + 1, last_wrong_at = NOW()`,
          [userId, answer.questionId]
        )
      }
    }
    
    await query(
      `UPDATE daily_practice 
       SET score = $1, total_questions = $2, correct_count = $3, time_spent = $4, 
           completed = TRUE, completed_at = NOW()
       WHERE id = $5`,
      [correctCount, answers.length, correctCount, totalTimeSpent, practiceId]
    )
    
    const pointsEarned = correctCount * 10 + (correctCount === answers.length ? 20 : 0)
    await query(
      `UPDATE growth 
       SET points = points + $1, total_practice_days = total_practice_days + 1, 
           total_questions = total_questions + $2
       WHERE user_id = $3`,
      [pointsEarned, answers.length, userId]
    )
    
    await query(
      `INSERT INTO checkin_calendar (user_id, checkin_date, category, points_earned)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, checkin_date, category) DO NOTHING`,
      [userId, today, category, pointsEarned]
    )
    
    await query('COMMIT', [])
    
    res.json({
      success: true,
      score: correctCount,
      total: answers.length,
      pointsEarned,
      practiceId
    })
  } catch (error: any) {
    await query('ROLLBACK', [])
    console.error('Submit practice error:', error.message)
    res.status(500).json({ error: '提交失败' })
  }
})

export default router
