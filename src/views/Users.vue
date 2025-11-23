<template>
  <AppLayout>
    <PageCard title="Users">
      <template #actions>
        <button
          v-if="route.query.pointId"
          @click="clearFilter"
          class="btn btn-secondary"
          style="margin-right: 8px"
        >
          Show All
        </button>
        <button @click="openCreateModal" class="btn btn-primary">
          Create New User
        </button>
      </template>
      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading users...</div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- User Table -->
      <table v-if="!loading && users.length > 0" class="data-table">
        <thead>
          <tr>
            <th>User name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <strong>{{ user.userName }}</strong>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <div class="table-actions">
                <button @click="openEditModal(user)" class="btn btn-secondary btn-sm">Edit</button>
                <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && users.length === 0" class="empty-state">
        No users created yet.
      </div>
    </PageCard>

    <!-- Modal for Create/Edit -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ isEditing ? 'Edit User info' : 'Create New User' }}</h2>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>Name</label>
            <input
              v-model="form.userName"
              type="text"
              placeholder="e.g., Best Guide"
              required
            />
          </div>
          <div class="form-group">
            <label>Email</label>
            <textarea
              v-model="form.email"
              placeholder="Enter email"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="form.role" required>
              <option value="">Select role</option>
                <option v-for="role in roles" :key="role" :value="role">
                        {{ role }}
                </option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save User' }}
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
import { manageUsersService } from '../services/manageUsersService'

const router = useRouter()

const route = useRoute()

const users = ref([])
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const form = ref({
    id: null,
  userName: '',
  email: '',
  role: '',
})
const roles = ref( ['Admin', 'Guide', 'Guest'])

// Fetch all POIs for dropdown
const fetchUsers = async () => {
  try {
    users.value = await manageUsersService.getAll()
  } catch (err) {
    console.error('Failed to load users', err)
  }
}


// Open create modal
const openCreateModal = () => {
  isEditing.value = false
  form.value = { 
    id: null,
    userName: '',
  email: '',
  role: '', }
  showModal.value = true
}

// Open edit modal
const openEditModal = (user) => {
  isEditing.value = true
  form.value = { ...user }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  form.value = {
    id: null, 
    userName: '',
  email: '',
  role: '' }
}

// Save user (create or update)
const saveUser = async () => {
  saving.value = true
  error.value = ''
  try {
    if (isEditing.value) {
      await manageUsersService.update(form.value.id, form.value)
    } else {
      await manageUsersService.create(form.value)
    }
    closeModal()
    await fetchUsers()
  } catch (err) {
    error.value = 'Failed to save user'
    console.error(err)
  } finally {
    saving.value = false
  }
}

// Delete user
const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await manageUsersService.delete(id)
    await fetchUsers()
  } catch (err) {
    error.value = 'Failed to delete user.'
    console.error(err)
  }
}

// Load data on mount
onMounted(() => {
  fetchUsers()
})


const clearFilter = () => {
  router.push({ path: '/users' })
}


watch(
  () => route.query.userId,
  () => {
    fetchUsers()
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
