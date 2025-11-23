<template>
  <AppLayout>
    <PageCard title="Tour Routes">
      <template #actions>
        <button v-if="authStore.canManage" @click="openCreateModal" class="btn btn-primary">
          Create New Route
        </button>
      </template>

      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading routes...</div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Routes Table -->
      <table v-if="!loading && routes.length > 0" class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Points of Interest</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in routes" :key="route.id">
            <td>
              <strong>{{ route.name }}</strong>
            </td>
            <td>{{ route.description }}</td>
            <td>{{ route.poiCount || 0 }}</td>
            <td>
              <div class="table-actions">
                <button @click="viewPOIs(route.id)" class="btn btn-primary btn-sm" v-if="route.poiCount > 0">
                  View POIs
                </button>
                <button v-if="(authStore.canManage && canEdit(route)) || authStore.canManageUsers"
                  @click="openEditModal(route)" class="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button v-if="authStore.canManage" @click="deleteRoute(route.id)" class="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && routes.length === 0" class="empty-state">
        No routes created yet. Create your first tour route!
      </div>
    </PageCard>

    <!-- Modal for Create/Edit -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ isEditing ? 'Edit Route' : 'Create New Route' }}</h2>

        <ModalError v-model="modalError" />

        <form @submit.prevent="saveRoute">
          <div class="form-group">
            <label>Route Name</label>
            <input v-model="form.name" type="text" placeholder="e.g., Historic City Center Tour" maxlength="50"
              required />
            <small>{{ form.name.length }}/15</small>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3" placeholder="Describe this tour route..." maxlength="500"
              required></textarea>
            <small>{{ form.description.length }}/500</small>
          </div>

          <div class="form-group">
            <label>Date</label>
            <input type="date" v-model="form.date" required />
            <span v-if="form.date && new Date(form.date) < new Date()" class="text-danger">
              Date cannot be in the past
            </span>
          </div>
          <div class="form-group">

            <label>Duration (hours)</label>
            <input type="number" v-model.number="form.duration" min="1" max="168" required />
            <span v-if="form.duration && (form.duration < 1 || form.duration > 168)" class="text-danger">
              Duration must be between 1 and 168 hours
            </span>
          </div>
          <ModalError v-model="modalError" />
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Route' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import PageCard from '@/components/PageCard.vue'
import { itemService } from '@/services/itemService'
import ModalError from '@/components/ModalError.vue'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()

const authStore = useAuthStore()
const routes = ref([])
const ownedTours = ref([])
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const modalError = ref('')
const form = ref({
  id: null,
  name: '',
  description: '',
  date: '',
  duration: '',
})
// Fetch all routes
const fetchRoutes = async () => {
  loading.value = true
  error.value = ''
  try {
    routes.value = await itemService.getAll()
  } catch (err) {
    error.value = 'Failed to load routes'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchOwnedRoutes = async () => {
  loading.value = true
  error.value = ''
  try {
    ownedTours.value = await itemService.getOwned()
  } catch (err) {
    error.value = 'Failed to load owned routes'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const canEdit = (tour) => {
  return ownedTours.value.some(t => t.id === tour.id)
}

// Open create modal
const openCreateModal = () => {
  isEditing.value = false
  modalError.value = ''
  form.value = { id: null, name: '', description: '', date: '', duration: 1 }
  showModal.value = true
}

// Open edit modal
const openEditModal = (route) => {
  modalError.value = ''
  isEditing.value = true
  form.value = {
    id: route.id ?? null,
    name: route.name ?? '',
    description: route.description ?? '',
    date: route.date ? route.date.split('T')[0] : '',
    duration: Number(route.duration ?? 1)
  }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  form.value = { id: null, name: '', description: '', date: '', duration: 1 }
  modalError.value = ''
}

// Save route (create or update)
const saveRoute = async () => {
  saving.value = true
  error.value = ''
  try {
    if (isEditing.value) {
      await itemService.update(form.value.id, form.value)
    } else {
      await itemService.create(form.value)
    }
    closeModal()
    await fetchRoutes()
  } catch (err) {
    modalError.value = err.response?.data?.error ?? err.response?.data?.message ?? "Failed to save route."
    console.error(err)
  } finally {
    saving.value = false
  }
}

// View POIs for a route
const viewPOIs = (routeId) => {
  router.push({ path: '/points-of-interest', query: { tourId: routeId } })
}

// Delete route
const deleteRoute = async (id) => {
  if (!confirm('Are you sure you want to delete this route?')) return

  try {
    await itemService.delete(id)
    await fetchRoutes()
  } catch (err) {
    if (err.response?.status === 403)
      error.value = 'You cannot delete tours that you do not own.'
    else
      error.value = 'Failed to delete route'
    console.error(err)
  }
}

// Load routes on mount
onMounted(() => {
  fetchRoutes(),
    fetchOwnedRoutes()
})
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
  width: 45%;
  min-width: 200px;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 15%;
  min-width: 120px;
  text-align: center;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
  width: 20%;
  min-width: 180px;
}

.data-table td {
  word-wrap: break-word;
  overflow-wrap: break-word;
  vertical-align: top;
}

.data-table td:nth-child(2) {
  line-height: 1.5;
  max-width: 1048px;
}
</style>
