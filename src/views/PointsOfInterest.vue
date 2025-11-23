<template>
  <AppLayout>
    <PageCard title="Points of Interest">
      <template #actions>
        <button v-if="route.query.tourId" @click="clearFilter" class="btn btn-secondary" style="margin-right: 8px">
          Show All
        </button>
        <button @click="openCreateModal" class="btn btn-primary">
          Create New Point of Interest
        </button>
      </template>

      <div v-if="route.query.tourId" class="filter-indicator">
        Showing POIs for route: <strong>{{ getRouteName(route.query.tourId) }}</strong>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading points of interest...</div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- POIs Table -->
      <table v-if="!loading && pois.length > 0" class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Route</th>
            <th>Information Cards</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="poi in pois" :key="poi.id">
            <td>
              <strong>{{ poi.name }}</strong>
            </td>
            <td>{{ getRouteName(poi.tourId) }}</td>
            <td>{{ poi.infoCardCount || 0 }}</td>
            <td>
              <div class="table-actions">
                <button @click="viewCards(poi.id)" class="btn btn-primary btn-sm" v-if="poi.cardCount > 0">
                  View Cards
                </button>
                <button v-if="canEditButton(poi)" @click="openEditModal(poi)"
                  class="btn btn-secondary btn-sm">Edit</button>
                <button v-if="canEditButton(poi)" @click="deletePoi(poi.id)"
                  class="btn btn-danger btn-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && pois.length === 0" class="empty-state">
        No points of interest created yet. Create your first point of interest!
      </div>
    </PageCard>

    <!-- Modal for Create/Edit -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ isEditing ? 'Edit Point of Interest' : 'Create New Point of Interest' }}</h2>
        <form @submit.prevent="savePoi">
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" type="text" placeholder="e.g., Historic Cathedral" required />
          </div>
          <div class="form-group">
            <label>Route</label>
            <select v-model="form.tourId" required>
              <option value="">Select a route...</option>
              <option v-for="route in myRoutes" :key="route.id" :value="route.id">
                {{ route.name }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Point of Interest' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import PageCard from '@/components/PageCard.vue'
import { poiService } from '@/services/poiService'
import { itemService } from '@/services/itemService'

const router = useRouter()
const route = useRoute()

const pois = ref([])
const routes = ref([])
const myRoutes = ref([])
const myPois = ref([])
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const form = ref({
  id: null,
  name: '',
  tourId: '',
})

// Fetch all POIs
const fetchPois = async () => {
  loading.value = true
  error.value = ''
  try {
    const tourId = route.query.tourId
    if (tourId) {
      // Filter by route if tourId is in query
      const allPois = await poiService.getAll()
      pois.value = allPois.filter((poi) => poi.tourId == tourId)
    } else {
      pois.value = await poiService.getAll()
    }
  } catch (err) {
    error.value = 'Failed to load points of interest'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchOwnedPois = async () => {
  loading.value = true
  error.value = ''
  try {
    const tourId = route.query.tourId
    if (tourId) {
      // Filter by route if tourId is in query
      const allPois = await poiService.getAll()
      pois.value = allPois.filter((poi) => poi.tourId == tourId)
    } else {
      myPois.value = await poiService.getOwned()
    }
  } catch (err) {
    error.value = 'Failed to load points of interest'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function canEdit(poi) {
  return myPois.value.some(t => t.id === poi.id)
}


const canEditButton = (poi) => {
  return canEdit(poi)

}

// View info cards for a POI
const viewCards = (poiId) => {
  router.push({ path: '/information-cards', query: { poiId: poiId } })
}

// Clear filter
const clearFilter = () => {
  router.push({ path: '/points-of-interest' })
}

// Fetch owned routes for dropdown
const fetcMyRoutes = async () => {
  try {
    myRoutes.value = await itemService.getOwned()
  } catch (err) {
    console.error('Failed to load routes', err)
  }
}

// Fetch all routes for dropdown
const fetchRoutes = async () => {
  try {
    routes.value = Object.values(await itemService.getAll())
  } catch (err) {
    console.error('Failed to load routes', err)
  }
}

// Get route name by ID
const getRouteName = (routeId) => {
  const route = routes.value.find((r) => r.id === Number(routeId))
  return route ? route.name : 'No Route Assigned'
}

// Open create modal
const openCreateModal = () => {
  isEditing.value = false
  form.value = { id: null, name: '', tourId: '' }
  showModal.value = true
}

// Open edit modal
const openEditModal = (poi) => {
  isEditing.value = true
  form.value = { ...poi }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  form.value = { id: null, name: '', tourId: '' }
}

// Save POI (create or update)
const savePoi = async () => {
  saving.value = true
  error.value = ''
  try {
    if (isEditing.value) {
      await poiService.update(form.value.id, form.value)
    } else {
      await poiService.create(form.value)
    }
    closeModal()
    await fetchOwnedPois()
    await fetchPois()
  } catch (err) {
    error.value = 'Failed to save point of interest'
    console.error(err)
  } finally {
    saving.value = false
  }
}

// Delete POI
const deletePoi = async (id) => {
  if (!confirm('Are you sure you want to delete this point of interest?')) return

  try {
    await poiService.delete(id)
    await fetchPois()
  } catch (err) {
    error.value = 'Failed to delete point of interest'
    console.error(err)
  }
}

// Load data on mount
onMounted(() => {
  fetchRoutes()
  fetcMyRoutes()
  fetchPois()
  fetchOwnedPois()
})

// Watch for route query changes
watch(
  () => route.query.tourId,
  () => {
    fetchPois()
  },
)
</script>

<style scoped>
.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  min-width: 70px;
}

/* Column width distribution */
.data-table th:nth-child(1),
.data-table td:nth-child(1) {
  width: 20%;
  min-width: 150px;
}

.data-table th:nth-child(2),
.data-table td:nth-child(2) {
  width: 30%;
  min-width: 200px;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 15%;
  min-width: 120px;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
  width: 10%;
  min-width: 100px;
  text-align: center;
}

.data-table th:nth-child(5),
.data-table td:nth-child(5) {
  width: 25%;
  min-width: 180px;
}

.data-table td {
  word-wrap: break-word;
  overflow-wrap: break-word;
  vertical-align: top;
}

.data-table td:nth-child(2) {
  line-height: 1.5;
  max-width: 400px;
}

.filter-indicator {
  background: rgba(139, 109, 76, 0.2);
  border: 2px solid #8b6d4c;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  color: #e8d9bc;
  font-size: 14px;
}

.filter-indicator strong {
  color: #f4ead5;
}
</style>
