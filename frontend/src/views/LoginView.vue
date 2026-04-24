<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
    <div class="card w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🌟</div>
        <h1 class="text-3xl font-bold text-gray-800">星星榜</h1>
        <p class="text-gray-600 mt-2">KET/PET 英语打卡学习平台</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {{ error }}
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">用户名</label>
          <input 
            v-model="username"
            type="text" 
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            placeholder="请输入用户名"
            required
            :disabled="loading"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">密码</label>
          <input 
            v-model="password"
            type="password" 
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            placeholder="请输入密码"
            required
            :disabled="loading"
          />
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <span v-if="loading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          还没有账号？
          <a href="#" class="text-blue-500 font-bold">联系老师创建</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import apiClient from '../utils/api'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await apiClient.post('/auth/login', {
      username: username.value,
      password: password.value
    })

    authStore.setAuth(response.token, response.user)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || '登录失败，请检查用户名和密码'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>
