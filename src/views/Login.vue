<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Tour Manager</h1>
      <p class="login-subtitle">Sign in to manage your tours</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading" style="width: 100%; margin-top: 8px">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <div class="register-link">
          Don&apos;t have an account? <router-link to="/register">Register here</router-link>
        </div>
        <div v-if="error" class="error-message" style="margin-top: 16px">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (err: any) {
    error.value = (err as any).response?.data?.message || 'Login failed - check your username and password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2a2520 0%, #362f28 100%);
  padding: 20px;
}

.login-card {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #5a4a38;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
}

.login-title {
  font-family: 'Georgia', serif;
  font-size: 32px;
  color: #e8d9bc;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.login-subtitle {
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 16px;
  color: #a89876;
  text-align: center;
  margin-bottom: 32px;
}

.login-form {
  margin-top: 24px;
}
</style>
