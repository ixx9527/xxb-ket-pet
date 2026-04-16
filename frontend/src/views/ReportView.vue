<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 safe-area-top safe-area-bottom">
    <div class="max-w-4xl mx-auto pb-24">
      <h1 class="text-3xl font-bold text-white mb-4">📊 学习报告</h1>
      
      <!-- 时间选择 -->
      <div class="card mb-4">
        <div class="flex gap-2">
          <button 
            @click="reportType = 'weekly'"
            :class="['flex-1 py-3 rounded-xl font-bold transition-all', reportType === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600']"
          >
            本周
          </button>
          <button 
            @click="reportType = 'monthly'"
            :class="['flex-1 py-3 rounded-xl font-bold transition-all', reportType === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600']"
          >
            本月
          </button>
        </div>
      </div>
      
      <!-- 统计概览 -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div class="card text-center card-hover">
          <div class="text-3xl mb-2">📚</div>
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalPractices }}</div>
          <div class="text-sm text-gray-600">练习次数</div>
        </div>
        
        <div class="card text-center card-hover">
          <div class="text-3xl mb-2">✅</div>
          <div class="text-2xl font-bold text-green-600">{{ stats.avgCorrectRate }}%</div>
          <div class="text-sm text-gray-600">平均正确率</div>
        </div>
        
        <div class="card text-center card-hover">
          <div class="text-3xl mb-2">🔥</div>
          <div class="text-2xl font-bold text-orange-600">{{ stats.checkinDays }}</div>
          <div class="text-sm text-gray-600">打卡天数</div>
        </div>
      </div>
      
      <!-- 薄弱点 -->
      <div class="card mb-4">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>💪</span>
          <span>需要加强</span>
        </h3>
        
        <div v-if="weakPoints.length > 0" class="space-y-3">
          <div 
            v-for="(point, index) in weakPoints" 
            :key="index"
            class="bg-orange-50 rounded-xl p-4 border-2 border-orange-200"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-bold text-gray-800">{{ point.part }}</span>
              <span class="text-orange-600 font-bold">错误 {{ point.wrong_count }} 次</span>
            </div>
            <div class="text-sm text-gray-600">
              共 {{ point.total }} 题，正确率 {{ ((point.total - point.wrong_count) / point.total * 100).toFixed(0) }}%
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <div class="text-5xl mb-3">🎉</div>
          <p class="text-green-600 font-bold">没有明显薄弱点，继续加油！</p>
        </div>
      </div>
      
      <!-- 学习建议 -->
      <div class="card">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>学习建议</span>
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="(suggestion, index) in suggestions" 
            :key="index"
            class="flex items-start gap-3 bg-blue-50 rounded-xl p-4"
          >
            <span class="text-xl flex-shrink-0">{{ index === 0 ? '🎯' : '✨' }}</span>
            <p class="text-gray-700">{{ suggestion }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const reportType = ref('weekly')

// 模拟数据（后续从 API 获取）
const stats = reactive({
  totalPractices: 5,
  totalCorrect: 22,
  totalQuestions: 25,
  avgCorrectRate: 88.0,
  checkinDays: 5
})

const weakPoints = ref([
  { part: 'Reading Part 2', total: 8, wrong_count: 3 },
  { part: 'Listening Part 1', total: 5, wrong_count: 1 }
])

const suggestions = ref([
  '你的 Reading Part 2 正确率较低，建议多做相关练习。',
  '太棒了！正确率很高，可以尝试更高难度的题目。',
  '本周练习次数较少，坚持每天练习进步更快哦！'
])
</script>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
