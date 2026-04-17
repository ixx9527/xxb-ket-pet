#!/usr/bin/env node

/**
 * 题库导入工具
 * 支持从 Excel/CSV 导入 KET/PET 题目
 * 
 * 用法：
 *   npm run import-questions -- --file=./questions.xlsx
 *   npm run import-questions -- --file=./questions.csv --category=KET
 */

import { readFileSync } from 'fs'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import { parse } from 'csv-parse/sync'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
})

interface Question {
  category: string
  part: string
  question_type: string
  content: string
  options: string
  answer: string
  explanation?: string
  difficulty?: number
  source?: string
  tags?: string
  audio_url?: string
  image_url?: string
}

// 从 CSV 导入
async function importFromCSV(filePath: string) {
  console.log(`📖 读取 CSV 文件：${filePath}`)
  
  const content = readFileSync(filePath, 'utf-8')
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })
  
  return records as Question[]
}

// 从 JSON 导入
async function importFromJSON(filePath: string) {
  console.log(`📖 读取 JSON 文件：${filePath}`)
  
  const content = readFileSync(filePath, 'utf-8')
  const data = JSON.parse(content)
  
  return Array.isArray(data) ? data : [data]
}

// 验证题目数据
function validateQuestion(question: any): boolean {
  const required = ['category', 'part', 'question_type', 'content', 'options', 'answer']
  
  for (const field of required) {
    if (!question[field]) {
      console.error(`❌ 题目缺少必需字段：${field}`)
      console.log(question)
      return false
    }
  }
  
  // 验证 category
  if (!['KET', 'PET'].includes(question.category)) {
    console.error(`❌ 无效的 category: ${question.category}，只能是 KET 或 PET`)
    return false
  }
  
  // 验证 difficulty
  if (question.difficulty && (question.difficulty < 1 || question.difficulty > 5)) {
    console.error(`❌ difficulty 必须在 1-5 之间`)
    return false
  }
  
  return true
}

// 导入题目到数据库
async function importQuestions(questions: Question[]) {
  console.log(`📊 准备导入 ${questions.length} 道题目...`)
  
  let successCount = 0
  let failCount = 0
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    
    if (!validateQuestion(q)) {
      failCount++
      continue
    }
    
    try {
      // 解析 options JSON
      const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      
      await pool.query(
        `INSERT INTO questions (
          category, part, question_type, content, options, answer, 
          explanation, difficulty, source, tags, audio_url, image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT DO NOTHING`,
        [
          q.category,
          q.part,
          q.question_type,
          q.content,
          JSON.stringify(options),
          q.answer,
          q.explanation || null,
          q.difficulty || 1,
          q.source || '导入数据',
          q.tags ? (typeof q.tags === 'string' ? q.tags : JSON.stringify(q.tags)) : '[]',
          q.audio_url || null,
          q.image_url || null
        ]
      )
      
      successCount++
      console.log(`✅ [${i + 1}/${questions.length}] 导入成功：${q.category} - ${q.part}`)
    } catch (error: any) {
      failCount++
      console.error(`❌ [${i + 1}/${questions.length}] 导入失败：${error.message}`)
      console.log(q)
    }
  }
  
  console.log(`\n📊 导入完成！`)
  console.log(`✅ 成功：${successCount} 题`)
  console.log(`❌ 失败：${failCount} 题`)
}

// 统计题目数量
async function countQuestions() {
  const result = await pool.query(
    `SELECT category, COUNT(*) as count 
     FROM questions 
     GROUP BY category 
     ORDER BY category`
  )
  
  console.log('\n📊 当前题库统计：')
  result.rows.forEach((row: any) => {
    console.log(`   ${row.category}: ${row.count} 题`)
  })
  
  const total = result.rows.reduce((sum: number, row: any) => sum + row.count, 0)
  console.log(`   总计：${total} 题`)
}

// 主函数
const main = async () => {
  const args = process.argv.slice(2)
  const fileArg = args.find(arg => arg.startsWith('--file='))
  const categoryArg = args.find(arg => arg.startsWith('--category='))
  const formatArg = args.find(arg => arg.startsWith('--format='))
  
  if (!fileArg) {
    console.log('❌ 请指定文件路径：--file=./questions.csv')
    console.log('\n用法：')
    console.log('  npm run import-questions -- --file=./questions.csv')
    console.log('  npm run import-questions -- --file=./questions.json')
    console.log('\n可选参数：')
    console.log('  --category=KET  只导入 KET 题目')
    console.log('  --format=csv    指定格式（csv 或 json，默认根据文件扩展名判断）')
    process.exit(1)
  }
  
  const filePath = fileArg.split('=')[1]
  const format = formatArg ? formatArg.split('=')[1] : filePath.endsWith('.json') ? 'json' : 'csv'
  const category = categoryArg ? categoryArg.split('=')[1] : null
  
  try {
    // 连接数据库
    await pool.query('SELECT NOW()')
    console.log('✅ 数据库连接成功\n')
    
    // 导入题目
    let questions: Question[]
    
    if (format === 'json') {
      questions = await importFromJSON(filePath)
    } else {
      questions = await importFromCSV(filePath)
    }
    
    // 过滤 category
    if (category) {
      questions = questions.filter(q => q.category === category)
      console.log(`📝 过滤后剩余 ${questions.length} 道 ${category} 题目\n`)
    }
    
    await importQuestions(questions)
    
    // 统计
    await countQuestions()
    
    await pool.end()
    console.log('\n✅ 导入完成！')
  } catch (error: any) {
    console.error('❌ 导入失败:', error.message)
    await pool.end()
    process.exit(1)
  }
}

main()
