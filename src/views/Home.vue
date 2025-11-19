<template>
  <AppLayout>
    <PageCard title="Tour Management Dashboard">
      <div class="dashboard-content">
        <p class="welcome-text">Welcome to the Tour Management System</p>
        <p class="subtitle">
          <template v-if="!authStore.canManage">
            You have guest access. You can view tours and points of interest but cannot create or
            edit anything.
          </template>
          <template v-else>
            Manage your tour routes, points of interest, and information cards
          </template>
        </p>

        <template v-if="authStore.canManage">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ routeCount }}</div>
              <div class="stat-label">Your Tour Routes</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ poiCount }}</div>
              <div class="stat-label">Your Points of Interest</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ cardCount }}</div>
              <div class="stat-label">Your Information Cards</div>
            </div>
          </div>

          <div class="quick-actions">
            <h3 class="section-title">Quick Actions</h3>
            <div class="actions-grid">
              <router-link to="/routes" class="action-card">
                <span class="action-text">Create New Route</span>
              </router-link>
              <router-link to="/points-of-interest" class="action-card">
                <span class="action-text">Add Point of Interest</span>
              </router-link>
              <router-link to="/information-cards" class="action-card">
                <span class="action-text">Create Information Card</span>
              </router-link>
            </div>
          </div>
        </template>
        <template v-if="!authStore.canManage">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ routeCount }}</div>
              <div class="stat-label">Overall Tour Routes</div>
            </div>
          </div>
        </template>
      </div>
    </PageCard>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import PageCard from '@/components/PageCard.vue'
import { useAuthStore } from '@/stores/auth'
import { itemService } from '@/services/itemService'
import { poiService } from '@/services/poiService'
import { informationCardService } from '@/services/informationCardService'

const authStore = useAuthStore()

const routeCount = ref(0)
const poiCount = ref(0)
const cardCount = ref(0)
const loading = ref(true)

// Fetch counts
const fetchCounts = async () => {
  loading.value = true
  try {
    if (authStore.canManage) {
      const [routes, pois, cards] = await Promise.all([
        itemService.getOwned().catch(() => []),
        poiService.getOwned().catch(() => []),
        informationCardService.getOwned().catch(() => []),
      ])
      routeCount.value = Array.isArray(routes) ? routes.length : 0
      poiCount.value = Array.isArray(pois) ? pois.length : 0
      cardCount.value = Array.isArray(cards) ? cards.length : 0
    } else {
      const [routes, pois, cards] = await Promise.all([
        itemService.getAll().catch(() => []),
        poiService.getAll().catch(() => []),
        informationCardService.getAll().catch(() => []),
      ])
      routeCount.value = routes.length
      poiCount.value = pois.length
      cardCount.value = cards.length
    }
  } catch (err) {
    console.error('Failed to load counts', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCounts()
})
</script>

<style scoped>
.dashboard-content {
  font-family: 'Georgia', serif;
}

.welcome-text {
  font-size: 24px;
  color: #e8d9bc;
  margin-bottom: 8px;
  font-weight: 600;
}

.subtitle {
  font-size: 16px;
  color: #a89876;
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(0, 0, 0, 0.2);
  padding: 24px;
  border-radius: 12px;
  border: 2px solid #5a4a38;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: #8b6d4c;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #e8d9bc;
  margin-bottom: 4px;
}

.stat-label {
  color: #a89876;
  font-size: 14px;
}

.quick-actions {
  margin-top: 32px;
}

.section-title {
  font-family: 'Georgia', serif;
  font-size: 20px;
  color: #e8d9bc;
  margin-bottom: 16px;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid #5a4a38;
  border-radius: 12px;
  text-decoration: none;
  color: #d4c4a8;
  transition: all 0.3s ease;
}

.action-card:hover {
  background: rgba(139, 109, 76, 0.2);
  border-color: #8b6d4c;
  transform: translateX(4px);
}

.action-text {
  font-size: 15px;
  font-weight: 500;
}
</style>
