<template>
  <div class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // 检查本地存储的登录状态
  authStore.checkAuth()
})
</script>

<style>
/* 全局样式已在 style.css 中定义 */
</style>
