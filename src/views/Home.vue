<template>
  <AppLayout>
    <PageCard title="Tour Management Dashboard">
      <div class="dashboard-content">
        <!-- Hero Section with Image -->
        <div class="hero-section">
          <div class="hero-image-wrapper">
          <img
            src="@/assets/kaunas.jpg"
            alt="Tour landscape"
            class="hero-image"
          />
            <div class="hero-overlay">
              <h2 class="hero-title">Welcome to the Tour Management System</h2>
            </div>
          </div>
        </div>

        <p class="subtitle">
          <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <template v-if="!authStore.canManage">
            You have guest access. You can view tours and points of interest but cannot create or
            edit anything.
          </template>
          <template v-else>
            Manage your tour routes, points of interest, and information cards
          </template>
          <button @click="showInfoModal = true" class="info-link">
            Learn more about this system
          </button>
        </p>

        <template v-if="authStore.canManage">
          <div class="stats-grid">
            <div class="stat-card">
              <Map class="stat-icon" stroke-width="2" />
              <div class="stat-value">{{ routeCount }}</div>
              <div class="stat-label">Your Tour Routes</div>
            </div>
            <div class="stat-card">
            <Pin class="stat-icon" stroke-width="2" />
              <div class="stat-value">{{ poiCount }}</div>
              <div class="stat-label">Your Points of Interest</div>
            </div>
            <div class="stat-card">
              <FileText class="stat-icon" stroke-width="2" />
              <div class="stat-value">{{ cardCount }}</div>
              <div class="stat-label">Your Information Cards</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="stats-grid">
            <div class="stat-card">
              <Map class="stat-icon" stroke-width="2" />
              <div class="stat-value">{{ routeCount }}</div>
              <div class="stat-label">Overall Tour Routes</div>
            </div>
            <div class="stat-card">
              <Pin class="stat-icon" stroke-width="2" />
              <div class="stat-value">{{ poiCount }}</div>
              <div class="stat-label">Overall Points of Interest</div>
            </div>
          </div>
        </template>
      </div>
    </PageCard>

    <!-- Information Modal -->
    <div v-if="showInfoModal" class="modal-overlay" @click="showInfoModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            About Tour Management System
          </h2>
          <button @click="showInfoModal = false" class="close-btn">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="info-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=300&fit=crop" 
              alt="Tour guide system"
              class="info-image"
            />
          </div>

          <div class="info-section">
            <h3>
              <Map class="icon-small" stroke-width="2" />
              Tour Routes
            </h3>
            <p>Create and manage comprehensive tour routes with multiple stops. Define the path, duration, and key highlights of your tours.</p>
          </div>

          <div class="info-section">
            <h3>
              <Pin class="icon-small" stroke-width="2" />
              Points of Interest
            </h3>
            <p>Mark important locations along your routes. Add descriptions, images, and historical information about each point.</p>
          </div>

          <div class="info-section">
            <h3>
              <FileText class="icon-small" stroke-width="2" />
              Information Cards
            </h3>
            <p>Create detailed information cards with rich content about landmarks, historical events, or local culture.</p>
          </div>

          <div class="info-section access-info">
            <h3>
              <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Access Levels
            </h3>
            <p><strong>Guides:</strong> Can create, edit, and delete all owned content.</p>
            <p><strong>Guests:</strong> Can view all public tours, and points of interest but cannot make changes.</p>
          </div>

          <div class="info-footer">
            <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>Start by creating your first tour route or exploring existing ones!</p>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="showInfoModal = false" class="btn btn-primary">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Got it!
          </button>
        </div>
      </div>
    </div>
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
import { Map, Pin, FileText } from 'lucide-vue-next'

const authStore = useAuthStore()

const routeCount = ref(0)
const poiCount = ref(0)
const cardCount = ref(0)
const loading = ref(true)
const showInfoModal = ref(false)

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
/* SVG Icon Styles */
.icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
}

.icon-small {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  opacity: 0.7;
}

.action-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Hero Section with Responsive Image */
.hero-section {
  margin: -28px -28px 32px -28px;
}

.hero-image-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%; /* Prevents image from overflowing */
  display: block;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 24px;
}

.hero-title {
  font-family: 'Georgia', serif;
  font-size: 28px;
  color: #f4ead5;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.dashboard-content {
  font-family: 'Georgia', serif;
}

.subtitle {
  font-size: 16px;
  color: #a89876;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.info-link {
  background: none;
  border: none;
  color: #8b6d4c;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: 8px;
}

.info-link:hover {
  color: #a89068;
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
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: #8b6d4c;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  display: flex;
  align-items: center;
  gap: 8px;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: linear-gradient(135deg, #4a3f32 0%, #3d342a 100%);
  border: 3px solid #5a4a38;
  border-radius: 16px;
  padding: 0;
  width: 700px;
  max-width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 2px solid #5a4a38;
  background: rgba(0, 0, 0, 0.15);
}

.modal-header h2 {
  font-family: 'Georgia', serif;
  font-size: 24px;
  color: #e8d9bc;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-btn {
  background: none;
  border: none;
  color: #a89876;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(139, 109, 76, 0.2);
  color: #d4c4a8;
}

.modal-body {
  padding: 28px;
}

.info-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 2px solid #5a4a38;
}

.info-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%; /* Prevents overflow */
  display: block;
}

.info-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #5a4a38;
}

.info-section:last-of-type {
  border-bottom: none;
}

.info-section h3 {
  font-family: 'Georgia', serif;
  font-size: 18px;
  color: #e8d9bc;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-section p {
  color: #c4b59d;
  line-height: 1.6;
  margin: 0 0 8px 0;
  font-size: 15px;
}

.access-info {
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #5a4a38;
}

.access-info strong {
  color: #e8d9bc;
}

.info-footer {
  margin-top: 24px;
  padding: 16px;
  background: rgba(139, 109, 76, 0.15);
  border-radius: 8px;
  border: 2px solid #6b5744;
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-footer p {
  margin: 0;
  color: #d4c4a8;
  font-style: italic;
  font-size: 15px;
}

.modal-actions {
  padding: 20px 28px;
  border-top: 2px solid #5a4a38;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.15);
}

.btn {
  padding: 10px 20px;
  border: 2px solid;
  border-radius: 10px;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #6b5744 0%, #8b6d4c 100%);
  border-color: #5a4a38;
  color: #f4ead5;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #7a6653 0%, #9a7d5b 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 109, 76, 0.4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-image-wrapper {
    height: 180px;
  }

  .hero-title {
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
  }
}
</style>