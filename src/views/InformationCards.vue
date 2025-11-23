<template>
  <AppLayout>
    <PageCard title="Information Cards">
      <template #actions>
        <button v-if="route.query.pointId" @click="clearFilter" class="btn btn-secondary" style="margin-right: 8px">
          Show All
        </button>
        <button @click="openCreateModal" class="btn btn-primary">
          Create New Information Card
        </button>
      </template>

      <div v-if="route.query.pointId" class="filter-indicator">
        Showing cards for POI: <strong>{{ getPoiName(route.query.pointId) }}</strong>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading information cards...</div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Cards Table -->
      <table v-if="!loading && cards.length > 0" class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Point of Interest</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in cards" :key="card.id">
            <td>
              <strong>{{ card.title }}</strong>
            </td>
            <td>{{ card.text }}</td>
            <td>{{ getPoiName(card.pointId) }}</td>
            <td>
              <div class="table-actions">
                <button v-if="(canEdit(card))" @click="openEditModal(card)"
                  class="btn btn-secondary btn-sm">Edit</button>
                <button v-if="(canEdit(card))" @click="deleteCard(card.id)"
                  class="btn btn-danger btn-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && cards.length === 0" class="empty-state">
        No information cards created yet. Create your first information card!
      </div>
    </PageCard>

    <!-- Modal for Create/Edit -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ isEditing ? 'Edit Information Card' : 'Create New Information Card' }}</h2>
        <form @submit.prevent="saveCard">
          <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" type="text" placeholder="e.g., Historical Background" required />
          </div>
          <div class="form-group">
            <label>Content</label>
            <textarea v-model="form.text" rows="5" placeholder="Enter the information card content..."
              required></textarea>
          </div>
          <div class="form-group">
            <label>Point of Interest</label>
            <select v-model="form.pointId" required>
              <option value="">Select a point of interest...</option>
              <option v-for="poi in myPois" :key="poi.id" :value="poi.id">
                {{ poi.name }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Information Card' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import PageCard from '@/components/PageCard.vue'
import { informationCardService } from '@/services/informationCardService'
import { poiService } from '@/services/poiService'

const router = useRouter()

const route = useRoute()

const cards = ref([])
const pois = ref([])
const myPois = ref([])
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const myCards = ref([])
const form = ref({
  id: null,
  title: '',
  text: '',
  pointId: '',
})

// Fetch all cards
const fetchCards = async () => {
  loading.value = true
  error.value = ''
  try {
    const pointId = route.query.pointId
    if (pointId) {
      // Filter by POI if poiId is in query
      cards.value = await informationCardService.getByPoiId(pointId)
    } else {
      cards.value = await informationCardService.getAll()
    }
  } catch (err) {
    error.value = 'Failed to load information cards'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchOwnedCards = async () => {
  loading.value = true
  error.value = ''
  try {
    const pointId = route.query.pointId
    if (pointId) {
      // Filter by POI if poiId is in query
      myCards.value = await informationCardService.getByPoiId(pointId)
    } else {
      myCards.value = await informationCardService.getOwned()
    }
  } catch (err) {
    error.value = 'Failed to load information cards'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const canEdit = (card) => {
  return myCards.value.some(t => t.id === card.id)
}

// Fetch all POIs for dropdown
const fetchPois = async () => {
  try {
    pois.value = await poiService.getAll()
  } catch (err) {
    console.error('Failed to load points of interest', err)
  }
}

const fetchMyPois = async () => {
  try {
    myPois.value = await poiService.getOwned()
  } catch (err) {
    console.error('Failed to load points of interest', err)
  }
}

// Get POI name by ID
const getPoiName = (pointId) => {
  const poi = pois.value.find((p) => p.id === pointId)
  return poi ? poi.name : 'Unknown POI'
}

const getPoiId = (name) => {
  const poi = pois.value.find((p) => p.name === name)
  return poi ? poi.name : 'Unknown POI'
}

// Open create modal
const openCreateModal = () => {
  isEditing.value = false
  form.value = { id: null, title: '', text: '', pointId: null }
  showModal.value = true
}

// Open edit modal
const openEditModal = (card) => {
  isEditing.value = true
  form.value = { ...card }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  form.value = { id: null, title: '', text: '', pointId: '' }
}

// Save card (create or update)
const saveCard = async () => {
  saving.value = true
  error.value = ''
  try {
    if (isEditing.value) {
      await informationCardService.update(form.value.id, form.value)
    } else {
      await informationCardService.create(form.value)
    }
    closeModal()
    await fetchCards()
  } catch (err) {
    error.value = 'Failed to save information card'
    console.error(err)
  } finally {
    saving.value = false
  }
}

// Delete card
const deleteCard = async (id) => {
  if (!confirm('Are you sure you want to delete this information card?')) return

  try {
    await informationCardService.delete(id)
    await fetchCards()
  } catch (err) {
    error.value = 'Failed to delete information card'
    console.error(err)
  }
}

// Load data on mount
onMounted(() => {
  fetchPois()
  fetchCards()
  fetchMyPois()
  fetchOwnedCards()
})

// Clear filter
const clearFilter = () => {
  router.push({ path: '/information-cards' })
}

// Watch for route query changes
watch(
  () => route.query.pointId,
  () => {
    fetchCards()
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
  width: 45%;
  min-width: 250px;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 20%;
  min-width: 150px;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
  width: 15%;
  min-width: 180px;
}

.data-table td {
  word-wrap: break-word;
  overflow-wrap: break-word;
  vertical-align: top;
}

.data-table td:nth-child(2) {
  line-height: 1.5;
  max-width: 500px;
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
