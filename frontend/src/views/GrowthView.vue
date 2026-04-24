<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-6">🏆 成长记录</h1>
      
      <div v-if="loading" class="card text-center py-8">
        <div class="text-4xl mb-4">⏳</div>
        <p class="text-gray-600">加载中...</p>
      </div>
      
      <template v-else>
        <div class="card mb-6 text-center">
          <div class="text-6xl mb-4">{{ levelEmoji }}</div>
          <h2 class="text-2xl font-bold text-gray-800">{{ growthStore.currentLevelName }}</h2>
          <p class="text-gray-600">Lv.{{ growthStore.level }}</p>
          <div class="mt-4 bg-white/30 rounded-full h-4 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-green-400 to-yellow-400 h-4 rounded-full transition-all duration-500" 
              :style="{ width: growthStore.progressToNextLevel + '%' }"
            ></div>
          </div>
          <p class="text-sm text-white mt-2">
            {{ growthStore.points }} / {{ nextLevelPoints }} 积分升级
          </p>
          
          <div class="grid grid-cols-3 gap-4 mt-6">
            <div class="bg-white/20 rounded-xl p-3">
              <div class="text-2xl font-bold text-white">{{ growthStore.totalPracticeDays }}</div>
              <div class="text-xs text-white/80">练习天数</div>
            </div>
            <div class="bg-white/20 rounded-xl p-3">
              <div class="text-2xl font-bold text-white">{{ growthStore.totalQuestions }}</div>
              <div class="text-xs text-white/80">总题数</div>
            </div>
            <div class="bg-white/20 rounded-xl p-3">
              <div class="text-2xl font-bold text-white">{{ growthStore.points }}</div>
              <div class="text-xs text-white/80">总积分</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-gray-800 mb-4">🏅 勋章墙</h3>
          
          <div v-if="growthStore.badges.length === 0" class="text-center py-8">
            <div class="text-6xl mb-4">🔒</div>
            <p class="text-gray-600">还没有获得勋章</p>
            <p class="text-sm text-gray-500 mt-2">继续学习，解锁更多成就！</p>
          </div>
          
          <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              v-for="badge in growthStore.badges" 
              :key="badge.id"
              class="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4 text-center animate-bounce-in"
            >
              <div class="text-4xl mb-2">{{ badge.icon || '🏅' }}</div>
              <div class="font-bold text-gray-800 text-sm">{{ badge.name }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ badge.description }}</div>
            </div>
          </div>
          
          <div class="mt-6 border-t pt-4">
            <h4 class="font-bold text-gray-700 mb-3">待解锁勋章</h4>
            <div class="grid grid-cols-4 gap-2">
              <div 
                v-for="i in 8" 
                :key="i"
                class="bg-gray-200 rounded-xl p-3 text-center opacity-50"
              >
                <div class="text-2xl">🔒</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGrowthStore } from '../stores/growth'
import apiClient from '../utils/api'

const authStore = useAuthStore()
const growthStore = useGrowthStore()
const loading = ref(false)

const levelEmoji = computed(() => {
  const emojis = ['🌱', '🌿', '🪴', '🌳', '🌟', '⭐', '✨']
  return emojis[growthStore.level - 1] || emojis[0]
})

const nextLevelPoints = computed(() => {
  const thresholds = [100, 300, 600, 1000, 1500, 2500, 99999]
  return thresholds[growthStore.level - 1] || 99999
})

const loadGrowth = async () => {
  loading.value = true
  try {
    const data = await apiClient.get('/growth', {
      params: { userId: authStore.userId }
    })
    growthStore.setGrowth(data)
  } catch (err) {
    console.error('Load growth error:', err)
    // 使用默认值
    growthStore.setGrowth({ points: 0, level: 1, badges: [], total_practice_days: 0, total_questions: 0 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    return
  }
  loadGrowth()
})
</script>
