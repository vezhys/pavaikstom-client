<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main-content" :class="{ 'sidebar-collapsed': !isOpen }">
      <button v-if="!isOpen" @click="open" class="sidebar-toggle-btn" title="Open sidebar">
        →
      </button>
      <slot />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import { useSidebar } from '@/composables/useSidebar';

const { isOpen, open } = useSidebar();
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #2a2520;
}

.main-content {
  flex: 1;
  padding: 32px;
  margin-left: 280px;
  background: linear-gradient(135deg, #2a2520 0%, #362f28 100%);
  transition: margin-left 0.3s ease;
  position: relative;
}

.main-content.sidebar-collapsed {
  margin-left: 60px;
}

.sidebar-toggle-btn {
  position: fixed;
  left: 10px;
  top: 20px;
  background: rgba(139, 109, 76, 0.4);
  border: 2px solid #5a4a38;
  border-radius: 8px;
  color: #e8d9bc;
  cursor: pointer;
  padding: 12px 16px;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.sidebar-toggle-btn:hover {
  background: rgba(139, 109, 76, 0.6);
  border-color: #8b6d4c;
  transform: scale(1.05);
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>