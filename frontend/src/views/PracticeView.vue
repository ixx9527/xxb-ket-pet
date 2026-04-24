<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 safe-area-top safe-area-bottom">
    <div class="max-w-2xl mx-auto pb-24">
      <!-- 顶部进度栏 -->
      <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
        <div class="flex justify-between items-center mb-3">
          <span class="text-white font-bold text-lg">
            题目 {{ currentQuestion + 1 }} / {{ totalQuestions }}
          </span>
          <div class="flex items-center gap-2 bg-white/30 rounded-full px-3 py-1">
            <span class="text-xl">⏰</span>
            <span class="text-white font-bold font-mono">{{ formatTime(timeRemaining) }}</span>
          </div>
        </div>
        <div class="progress-bar h-3 bg-white/30">
          <div 
            class="progress-fill bg-gradient-to-r from-yellow-400 to-orange-400"
            :style="{ width: ((currentQuestion + 1) / totalQuestions) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- 题目类型标签 -->
      <div class="text-center mb-4">
        <span class="bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          📖 KET Reading Part 1
        </span>
      </div>

      <!-- 题目卡片 -->
      <div class="card mb-4 animate-bounce-in">
        <!-- 题目内容 -->
        <div class="mb-6">
          <p class="text-xl text-gray-800 leading-relaxed font-medium">
            What does this sign say?
          </p>
          <div class="mt-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-center border-2 border-gray-200">
            <p class="text-3xl font-bold text-gray-800">NO PARKING</p>
          </div>
        </div>

        <!-- 选项 -->
        <div class="space-y-3">
          <div 
            v-for="option in options" 
            :key="option.key"
            @click="selectOption(option.key)"
            :class="['option-card', getOptionClass(option.key)]"
          >
            <div class="flex items-center">
              <span 
                class="w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold text-lg transition-colors"
                :class="getOptionKeyClass(option.key)"
              >
                {{ option.key }}
              </span>
              <span class="text-lg font-medium">{{ option.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button 
        @click="submitAnswer"
        :disabled="!selectedAnswer"
        class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="flex items-center justify-center gap-2">
          <span>✅</span>
          <span>提交答案</span>
        </span>
      </button>

      <!-- 解析（答题后显示） -->
      <div v-if="showExplanation" class="card mt-4 animate-bounce-in" :class="explanationCardClass">
        <div class="flex items-center mb-3">
          <span class="text-3xl mr-3">{{ isCorrect ? '🎉' : '💪' }}</span>
          <div>
            <span class="font-bold text-xl" :class="isCorrect ? 'text-green-600' : 'text-orange-600'">
              {{ isCorrect ? '回答正确！' : '再加油！' }}
            </span>
            <p class="text-sm text-gray-500">正确答案：{{ correctAnswer }}</p>
          </div>
        </div>
        <div class="bg-white/50 rounded-xl p-4 mb-4">
          <p class="text-gray-700 leading-relaxed">{{ explanation }}</p>
        </div>
        <button @click="nextQuestion" class="btn-success w-full" v-if="!isLastQuestion">
          <span class="flex items-center justify-center gap-2">
            <span>➡️</span>
            <span>下一题</span>
          </span>
        </button>
        <button @click="finishPractice" class="btn-success w-full" v-else>
          <span class="flex items-center justify-center gap-2">
            <span>🏁</span>
            <span>完成练习</span>
          </span>
        </button>
      </div>
    </div>

    <!-- 完成弹窗 -->
    <div v-if="showResult" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="card max-w-md w-full text-center animate-bounce-in">
        <div class="text-7xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">练习完成！</h2>
        <div class="flex justify-center gap-4 my-6">
          <div class="bg-green-100 rounded-2xl p-4 flex-1">
            <div class="text-3xl font-bold text-green-600">{{ score }}/{{ totalQuestions }}</div>
            <div class="text-sm text-gray-600">得分</div>
          </div>
          <div class="bg-yellow-100 rounded-2xl p-4 flex-1">
            <div class="text-3xl font-bold text-yellow-600">+{{ pointsEarned }}</div>
            <div class="text-sm text-gray-600">积分</div>
          </div>
        </div>
        <button @click="goHome" class="btn-primary w-full">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'
import apiClient from '../utils/api'

const router = useRouter()
const authStore = useAuthStore()
const practiceStore = usePracticeStore()

const currentQuestion = ref(0)
const timeRemaining = ref(900)
const selectedAnswer = ref(null)
const showExplanation = ref(false)
const isCorrect = ref(false)
const showResult = ref(false)
const score = ref(0)
const answers = ref([])
let timer = null

const questions = computed(() => practiceStore.todayQuestions)
const totalQuestions = computed(() => questions.value.length || 5)
const currentQ = computed(() => questions.value[currentQuestion.value] || {})
const options = computed(() => {
  const q = currentQ.value
  if (!q.options) return []
  try {
    return typeof q.options === 'string' ? JSON.parse(q.options) : q.options
  } catch {
    return []
  }
})
const correctAnswer = computed(() => currentQ.value?.answer)
const explanation = computed(() => currentQ.value?.explanation || '')

const isLastQuestion = computed(() => currentQuestion.value >= totalQuestions.value - 1)

const explanationCardClass = computed(() => {
  return isCorrect.value ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
})

const getOptionKeyClass = (key) => {
  if (!showExplanation.value) {
    return selectedAnswer.value === key 
      ? 'bg-blue-500 text-white' 
      : 'bg-gray-200 text-gray-700'
  }
  if (key === correctAnswer.value) return 'bg-green-500 text-white'
  if (selectedAnswer.value === key) return 'bg-red-500 text-white'
  return 'bg-gray-200 text-gray-700'
}

const getOptionClass = (key) => {
  if (!showExplanation.value) {
    return selectedAnswer.value === key ? 'selected' : ''
  }
  if (key === correctAnswer.value) return 'correct'
  if (selectedAnswer.value === key) return 'wrong'
  return ''
}

const selectOption = (key) => {
  if (showExplanation.value) return
  selectedAnswer.value = key
}

const submitAnswer = () => {
  isCorrect.value = selectedAnswer.value === correctAnswer.value
  if (isCorrect.value) {
    score.value++
  }
  answers.value.push({
    questionId: currentQ.value.id,
    selectedAnswer: selectedAnswer.value,
    timeSpent: 0
  })
  showExplanation.value = true
}

const nextQuestion = () => {
  currentQuestion.value++
  selectedAnswer.value = null
  showExplanation.value = false
  
  if (currentQuestion.value >= totalQuestions.value) {
    finishPractice()
  }
}

const finishPractice = async () => {
  try {
    await apiClient.post('/practice/submit', {
      userId: authStore.userId,
      category: 'KET',
      answers: answers.value
    })
    showResult.value = true
  } catch (err) {
    console.error('Submit error:', err)
    showResult.value = true
  }
}

const goHome = () => {
  practiceStore.reset()
  router.push('/')
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const pointsEarned = computed(() => score.value * 10 + (score.value === totalQuestions.value ? 20 : 0))

const loadQuestions = async () => {
  practiceStore.setLoading(true)
  try {
    const data = await apiClient.get('/practice/daily', {
      params: { category: 'KET', userId: authStore.userId }
    })
    
    if (data.completed) {
      practiceStore.setCompleted(true, data.practice)
      showResult.value = true
      return
    }
    
    practiceStore.setQuestions(data.questions || [])
    timeRemaining.value = data.timeLimit || 900
  } catch (err) {
    console.error('Load questions error:', err)
    practiceStore.setError('加载题目失败')
  } finally {
    practiceStore.setLoading(false)
  }
}

const startTimer = () => {
  timer = setInterval(() => {
    if (timeRemaining.value > 0 && !showResult.value) {
      timeRemaining.value--
    } else if (timeRemaining.value <= 0 && !showResult.value) {
      finishPractice()
    }
  }, 1000)
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  if (questions.value.length === 0) {
    loadQuestions()
  }
  startTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
