<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
    <div class="card w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🌟</div>
        <h1 class="text-3xl font-bold text-gray-800">星星榜</h1>
        <p class="text-gray-600 mt-2">KET/PET 英语打卡学习平台</p>
      </div>

      <!-- 登录/注册切换标签 -->
      <div class="flex mb-6 bg-gray-100 rounded-xl p-1">
        <button 
          @click="isRegister = false"
          class="flex-1 py-2 rounded-lg font-bold transition-all"
          :class="!isRegister ? 'bg-white text-blue-600 shadow' : 'text-gray-500'"
        >
          登录
        </button>
        <button 
          @click="isRegister = true"
          class="flex-1 py-2 rounded-lg font-bold transition-all"
          :class="isRegister ? 'bg-white text-blue-600 shadow' : 'text-gray-500'"
        >
          注册
        </button>
      </div>

      <form @submit.prevent="isRegister ? handleRegister : handleLogin" class="space-y-5">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {{ error }}
        </div>
        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          {{ success }}
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

        <!-- 注册额外字段 -->
        <template v-if="isRegister">
          <div>
            <label class="block text-gray-700 font-bold mb-2">姓名</label>
            <input 
              v-model="name"
              type="text" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              placeholder="请输入姓名"
              required
              :disabled="loading"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">年级</label>
            <select 
              v-model="grade"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              required
              :disabled="loading"
            >
              <option value="" disabled>请选择年级</option>
              <option v-for="g in grades" :key="g" :value="g">{{ g }}年级</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2">家长手机号</label>
            <input 
              v-model="parentPhone"
              type="tel" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              placeholder="请输入家长手机号"
              required
              :disabled="loading"
              pattern="[0-9]{11}"
            />
          </div>
        </template>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <span v-if="loading">{{ isRegister ? '注册中...' : '登录中...' }}</span>
          <span v-else>{{ isRegister ? '注册' : '登录' }}</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600" v-if="!isRegister">
          还没有账号？
          <a href="#" @click.prevent="isRegister = true" class="text-blue-500 font-bold">立即注册</a>
        </p>
        <p class="text-gray-600" v-else>
          已有账号？
          <a href="#" @click.prevent="isRegister = false" class="text-blue-500 font-bold">返回登录</a>
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

const isRegister = ref(false)
const username = ref('')
const password = ref('')
const name = ref('')
const grade = ref('')
const parentPhone = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const grades = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await apiClient.post('/auth/login', {
      username: username.value,
      password: password.value
    })

    authStore.setAuth(response.token, response.user)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || err.message || '登录失败，请检查用户名和密码'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!username.value || !password.value || !name.value || !grade.value || !parentPhone.value) {
    error.value = '请填写所有必填项'
    return
  }
  if (!/^1[3-9]\d{9}$/.test(parentPhone.value)) {
    error.value = '请输入正确的11位手机号'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await apiClient.post('/auth/register', {
      username: username.value,
      password: password.value,
      name: name.value,
      grade: parseInt(grade.value),
      parentPhone: parentPhone.value
    })

    success.value = '注册成功！正在跳转到登录页...'
    // 注册成功后清空表单，切换到登录
    setTimeout(() => {
      isRegister.value = false
      password.value = ''
      name.value = ''
      grade.value = ''
      parentPhone.value = ''
      success.value = ''
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.error || err.message || '注册失败，请稍后重试'
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
}
</script>
