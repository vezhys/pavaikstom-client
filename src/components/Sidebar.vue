<template>
  <aside class="sidebar" :class="{ collapsed: !isOpen }">
    <div class="sidebar-header">
      <h1 class="app-title" v-show="isOpen">Tour Manager</h1>
      <button
        @click="toggle"
        class="toggle-btn"
        :title="isOpen ? 'Collapse sidebar' : 'Expand sidebar'"
      >
        <span v-if="isOpen">←</span>
        <span v-else>→</span>
      </button>
    </div>

    <nav class="nav-menu" v-show="isOpen">
      <router-link to="/" class="nav-item" active-class="active">
        <span>Dashboard</span>
      </router-link>
      <router-link to="/routes" class="nav-item" active-class="active">
        <span>Routes</span>
      </router-link>
      <router-link
        v-if="authStore.canManage"
        to="/points-of-interest"
        class="nav-item"
        active-class="active"
      >
        <span>Points of Interest</span>
      </router-link>
      <router-link
        v-if="authStore.canManage"
        to="/information-cards"
        class="nav-item"
        active-class="active"
      >
        <span>Information Cards</span>
      </router-link>

      <router-link
        v-if="authStore.canManageUsers"
        to="/users"
        class="nav-item"
        active-class="active"
      >
        <span>Users</span>
      </router-link>
    </nav>

    <div class="user-section" v-show="isOpen">
      <div class="user-info">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-details">
          <div class="user-name">{{ username }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </div>
      <button @click="handleLogout" class="logout-btn">Sign Out</button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSidebar } from '@/composables/useSidebar'

const router = useRouter()
const authStore = useAuthStore()
const { isOpen, toggle } = useSidebar()

const username = computed(() => authStore.user?.username || 'User')
const userInitial = computed(() => username.value.charAt(0).toUpperCase())
const userRole = computed(() => {
  const role = authStore.user?.role || 'guest'
  return role.charAt(0).toUpperCase() + role.slice(1)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, #3d342a 0%, #2d2620 100%);
  border-right: 3px solid #5a4a38;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.4);
  transition: width 0.3s ease;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 2px solid #5a4a38;
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.toggle-btn {
  background: rgba(139, 109, 76, 0.3);
  border: 2px solid #5a4a38;
  border-radius: 8px;
  color: #e8d9bc;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: rgba(139, 109, 76, 0.5);
  border-color: #8b6d4c;
  transform: scale(1.05);
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 24px 10px;
}

.app-title {
  font-family: 'Georgia', serif;
  font-size: 22px;
  font-weight: 600;
  color: #d4c4a8;
  text-align: center;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.nav-menu {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: #c4b59d;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
}

.nav-item:hover {
  background: rgba(139, 109, 76, 0.2);
  border-color: #6b5744;
  transform: translateX(4px);
}

.nav-item.active {
  background: rgba(139, 109, 76, 0.3);
  border-color: #8b6d4c;
  color: #e8d9bc;
  font-weight: 600;
}

.user-section {
  padding: 20px;
  border-top: 2px solid #5a4a38;
  background: rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b5744 0%, #8b6d4c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #f4ead5;
  border: 2px solid #5a4a38;
}

.user-details {
  flex: 1;
}

.user-name {
  font-family: 'Georgia', serif;
  font-size: 16px;
  font-weight: 600;
  color: #e8d9bc;
  margin-bottom: 2px;
}

.user-role {
  font-size: 13px;
  color: #a89876;
  font-style: italic;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background: rgba(139, 69, 52, 0.4);
  border: 2px solid #6b4534;
  border-radius: 10px;
  color: #d4c4a8;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(139, 69, 52, 0.6);
  border-color: #8b4534;
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
}
</style>
