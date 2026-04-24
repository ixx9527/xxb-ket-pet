import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMistakeStore = defineStore('mistake', () => {
  // State
  const mistakes = ref([])
  const loading = ref(false)
  const error = ref('')

  // Getters
  const mistakeCount = computed(() => mistakes.value.length)
  const hasError = computed(() => !!error.value)

  // Actions
  function setMistakes(mistakeList) {
    mistakes.value = mistakeList
  }

  function addMistake(mistake) {
    mistakes.value.unshift(mistake)
  }

  function removeMistake(questionId) {
    mistakes.value = mistakes.value.filter(m => m.question_id !== questionId)
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
    mistakes.value = []
    loading.value = false
    error.value = ''
  }

  return {
    mistakes,
    loading,
    error,
    mistakeCount,
    hasError,
    setMistakes,
    addMistake,
    removeMistake,
    setLoading,
    setError,
    clearError,
    reset
  }
})
