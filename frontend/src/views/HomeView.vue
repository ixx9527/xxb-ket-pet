<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
    <!-- 顶部状态栏 -->
    <header class="bg-white/20 backdrop-blur-sm safe-area-top">
      <div class="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-3xl animate-float">🌟</span>
          <h1 class="text-xl font-bold text-white">星星榜</h1>
        </div>
        <div class="flex gap-3">
          <div class="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <span class="text-lg">🔥</span>
            <span class="text-white font-bold">{{ streakDays }}天</span>
          </div>
          <div class="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <span class="text-lg">⭐</span>
            <span class="text-white font-bold">{{ points }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 pb-24">
      <!-- 欢迎卡片 -->
      <div class="card mb-6 text-center card-hover animate-bounce-in">
        <div class="text-6xl mb-3 animate-float">👋</div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          你好，{{ userName }}！
        </h2>
        <p class="text-gray-600 mb-6">今天也要加油学习英语哦～</p>
        
        <!-- 快速入口 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <router-link to="/practice" class="option-card text-center py-6 card-hover">
            <div class="text-5xl mb-3">📚</div>
            <div class="font-bold text-gray-700 text-lg">每日练习</div>
            <div class="text-sm text-gray-500 mt-1">开始今天的学习</div>
          </router-link>
          
          <router-link to="/mistakes" class="option-card text-center py-6 card-hover">
            <div class="text-5xl mb-3">❌</div>
            <div class="font-bold text-gray-700 text-lg">错题本</div>
            <div class="text-sm text-gray-500 mt-1">复习薄弱环节</div>
          </router-link>
          
          <router-link to="/growth" class="option-card text-center py-6 card-hover">
            <div class="text-5xl mb-3">🏆</div>
            <div class="font-bold text-gray-700 text-lg">成长记录</div>
            <div class="text-sm text-gray-500 mt-1">查看等级勋章</div>
          </router-link>
          
          <router-link to="/report" class="option-card text-center py-6 card-hover">
            <div class="text-5xl mb-3">📊</div>
            <div class="font-bold text-gray-700 text-lg">学习报告</div>
            <div class="text-sm text-gray-500 mt-1">学习情况分析</div>
          </router-link>
        </div>
      </div>

      <!-- 今日任务 -->
      <div class="card card-hover">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">📅</span>
          <h3 class="text-xl font-bold text-gray-800">今日任务</h3>
        </div>
        
        <div v-if="!todayCompleted" class="text-center py-6">
          <div class="text-7xl mb-4 animate-float">🎯</div>
          <p class="text-gray-600 mb-6 text-lg">今天还没有练习哦</p>
          <router-link to="/practice" class="btn-primary inline-block">
            <span class="flex items-center justify-center gap-2">
              <span>🚀</span>
              <span>开始练习</span>
            </span>
          </router-link>
        </div>
        
        <div v-else class="text-center py-6">
          <div class="text-7xl mb-4">✅</div>
          <p class="text-green-600 font-bold text-xl mb-2">今日练习已完成！</p>
          <div class="flex justify-center gap-4 text-gray-600">
            <span class="bg-green-100 px-4 py-2 rounded-full">
              得分：<span class="font-bold text-green-600">{{ todayScore }}</span> / {{ todayTotal }}
            </span>
            <span class="bg-yellow-100 px-4 py-2 rounded-full">
              +<span class="font-bold text-yellow-600">{{ todayPoints }}</span> 积分
            </span>
          </div>
        </div>
      </div>

      <!-- 等级进度 -->
      <div class="card mt-6 card-hover">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🌱</span>
            <div>
              <div class="font-bold text-gray-800">{{ levelName }}</div>
              <div class="text-sm text-gray-500">Lv.{{ level }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-600">升级还需</div>
            <div class="font-bold text-blue-600">{{ nextLevelPoints - points }} 积分</div>
          </div>
        </div>
        <div class="progress-bar h-4">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="text-right text-sm text-gray-500 mt-1">
          {{ points }} / {{ nextLevelPoints }}
        </div>
      </div>
    </main>

    <!-- 底部导航 -->
    <nav class="bg-white border-t shadow-lg safe-area-bottom">
      <div class="max-w-4xl mx-auto flex justify-around py-2">
        <router-link to="/" class="flex flex-col items-center p-2 text-blue-500">
          <span class="text-2xl">🏠</span>
          <span class="text-xs mt-1 font-medium">首页</span>
        </router-link>
        
        <router-link to="/practice" class="flex flex-col items-center p-2 text-gray-500 hover:text-blue-500">
          <span class="text-2xl">📚</span>
          <span class="text-xs mt-1 font-medium">练习</span>
        </router-link>
        
        <router-link to="/mistakes" class="flex flex-col items-center p-2 text-gray-500 hover:text-blue-500">
          <span class="text-2xl">❌</span>
          <span class="text-xs mt-1 font-medium">错题</span>
        </router-link>
        
        <router-link to="/growth" class="flex flex-col items-center p-2 text-gray-500 hover:text-blue-500">
          <span class="text-2xl">🏆</span>
          <span class="text-xs mt-1 font-medium">成长</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟数据（后续从 API 获取）
const userName = ref('小朋友')
const streakDays = ref(12)
const points = ref(240)
const todayCompleted = ref(false)
const todayScore = ref(5)
const todayTotal = ref(5)
const todayPoints = ref(70)
const level = ref(1)
const levelName = ref('英语小苗')
const nextLevelPoints = ref(300)

const progressPercent = computed(() => {
  return Math.min((points.value / nextLevelPoints.value) * 100, 100)
})
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
