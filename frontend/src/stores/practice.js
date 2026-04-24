import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePracticeStore = defineStore('practice', () => {
  // State
  const todayQuestions = ref([])
  const isCompleted = ref(false)
  const practiceResult = ref(null)
  const loading = ref(false)
  const error = ref('')

  // Getters
  const questionCount = computed(() => todayQuestions.value.length)
  const hasError = computed(() => !!error.value)

  // Actions
  function setQuestions(questions) {
    todayQuestions.value = questions
  }

  function setCompleted(completed, result = null) {
    isCompleted.value = completed
    practiceResult.value = result
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

  function reset() {
    todayQuestions.value = []
    isCompleted.value = false
    practiceResult.value = null
    loading.value = false
    error.value = ''
  }

  return {
    todayQuestions,
    isCompleted,
    practiceResult,
    loading,
    error,
    questionCount,
    hasError,
    setQuestions,
    setCompleted,
    setLoading,
    setError,
    clearError,
    reset
  }
})
