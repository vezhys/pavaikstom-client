<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Tour Manager</h1>
      <p class="register-subtitle">Create your account</p>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>Username</label>
          <input v-model="userName" type="text" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password" required />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select v-model="role" required>
            <option value="Guest">Guest</option>
            <option value="Guide">Guide</option>
          </select>
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
          style="width: 100%; margin-top: 8px"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
        <div v-if="error" class="error-message" style="margin-top: 16px">
          {{ error }}
        </div>
        <div class="login-link">
          Already have an account? <router-link to="/login">Login here</router-link>
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

const userName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('User')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.register(userName.value, email.value, password.value, role.value)
    router.push('/')
  } catch (err: any) {
    const errors = err.response?.data?.errors
    if (errors && Array.isArray(errors)) {
      error.value = errors.map((e: any) => e.description || e).join(', ')
    } else {
      error.value = err.response?.data?.message || 'Registration failed'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2a2520 0%, #362f28 100%);
  padding: 20px;
}

.register-card {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #5a4a38;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
}

.register-title {
  font-family: 'Georgia', serif;
  font-size: 32px;
  color: #e8d9bc;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.register-subtitle {
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 16px;
  color: #a89876;
  text-align: center;
  margin-bottom: 32px;
}

.register-form {
  margin-top: 24px;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 14px;
  color: #a89876;
}

.login-link a {
  color: #e8d9bc;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
