import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGrowthStore = defineStore('growth', () => {
  // State
  const points = ref(0)
  const level = ref(1)
  const badges = ref([])
  const totalPracticeDays = ref(0)
  const totalQuestions = ref(0)
  const loading = ref(false)
  const error = ref('')

  // Getters
  const currentLevelName = computed(() => {
    const levels = ['星星学员', '青铜学者', '白银学者', '黄金学者', '钻石学者', '王者学霸', '传奇学神']
    return levels[level.value - 1] || levels[levels.length - 1]
  })

  const progressToNextLevel = computed(() => {
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2500]
    const currentThreshold = thresholds[level.value - 1] || 0
    const nextThreshold = thresholds[level.value] || 999999
    const progress = points.value - currentThreshold
    const range = nextThreshold - currentThreshold
    return Math.min(100, Math.max(0, (progress / range) * 100))
  })

  const hasBadge = (badgeId) => computed(() => badges.value.some(b => b.id === badgeId))

  // Actions
  function setGrowth(data) {
    points.value = data.points || 0
    level.value = data.level || 1
    badges.value = data.badges || []
    totalPracticeDays.value = data.total_practice_days || 0
    totalQuestions.value = data.total_questions || 0
  }

  function addPoints(newPoints) {
    points.value += newPoints
    updateLevel()
  }

  function updateLevel() {
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2500]
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (points.value >= thresholds[i]) {
        level.value = i + 1
        break
      }
    }
  }

  function addBadge(badge) {
    if (!badges.value.some(b => b.id === badge.id)) {
      badges.value.push(badge)
    }
  }

  function setLoading(isLoading) {
    loading.value = isLoading
  }

  function setError(err) {
    error.value = err
  }

  function clearError() {
    error.value = ''
  }

  return {
    points,
    level,
    badges,
    totalPracticeDays,
    totalQuestions,
    loading,
    error,
    currentLevelName,
    progressToNextLevel,
    hasBadge,
    setGrowth,
    addPoints,
    updateLevel,
    addBadge,
    setLoading,
    setError,
    clearError
  }
})
