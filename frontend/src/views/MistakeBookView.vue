<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-6">❌ 错题本</h1>
      
      <div v-if="loading" class="card text-center py-8">
        <div class="text-4xl mb-4">⏳</div>
        <p class="text-gray-600">加载中...</p>
      </div>
      
      <div v-else-if="mistakeStore.mistakes.length === 0" class="card text-center py-8">
        <div class="text-6xl mb-4">🎉</div>
        <p class="text-gray-600 text-lg">太棒了！目前没有错题</p>
        <p class="text-gray-500 text-sm mt-2">继续加油，保持全对记录！</p>
      </div>
      
      <div v-else class="space-y-4">
        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white">
          <div class="flex justify-between items-center">
            <span class="font-bold">共 {{ mistakeStore.mistakes.length }} 道错题</span>
            <button @click="loadMistakes" class="bg-white/30 hover:bg-white/40 px-4 py-2 rounded-xl text-sm transition">
              🔄 刷新
            </button>
          </div>
        </div>
        
        <div 
          v-for="(mistake, index) in mistakeStore.mistakes" 
          :key="mistake.question_id"
          class="card animate-bounce-in"
        >
          <div class="flex justify-between items-start mb-4">
            <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
              {{ mistake.category }}
            </span>
            <span class="text-gray-500 text-sm">错{{ mistake.wrong_count }}次</span>
          </div>
          
          <p class="text-gray-800 font-medium mb-4">{{ mistake.content }}</p>
          
          <div class="space-y-2 mb-4">
            <div 
              v-for="opt in parseOptions(mistake.options)" 
              :key="opt.key"
              :class="['px-4 py-2 rounded-xl text-sm', 
                opt.key === mistake.answer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700']"
            >
              <span class="font-bold mr-2">{{ opt.key }}.</span>
              {{ opt.text }}
            </div>
          </div>
          
          <div v-if="mistake.explanation" class="bg-blue-50 rounded-xl p-4 mb-4">
            <p class="text-gray-700 text-sm">{{ mistake.explanation }}</p>
          </div>
          
          <button 
            @click="markAsMastered(mistake.question_id)"
            class="btn-success w-full"
          >
            ✅ 我已掌握
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useMistakeStore } from '../stores/mistake'
import apiClient from '../utils/api'

const authStore = useAuthStore()
const mistakeStore = useMistakeStore()
const loading = ref(false)

const parseOptions = (options) => {
  if (!options) return []
  try {
    return typeof options === 'string' ? JSON.parse(options) : options
  } catch {
    return []
  }
}

const loadMistakes = async () => {
  loading.value = true
  mistakeStore.clearError()
  
  try {
    const data = await apiClient.get('/mistakes', {
      params: { userId: authStore.userId }
    })
    mistakeStore.setMistakes(data.mistakes || [])
  } catch (err) {
    console.error('Load mistakes error:', err)
    mistakeStore.setError('加载错题失败')
  } finally {
    loading.value = false
  }
}

const markAsMastered = async (questionId) => {
  try {
    await apiClient.put(`/mistakes/${questionId}/master`, null, {
      params: { userId: authStore.userId }
    })
    mistakeStore.removeMistake(questionId)
  } catch (err) {
    console.error('Mark mastered error:', err)
    alert('操作失败，请重试')
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    return
  }
  loadMistakes()
})
</script>
