import { ref } from 'vue'

export function useModal() {
  const showModal = ref(false)
  const modalError = ref('')
  const saving = ref(false)

  const openModal = () => {
    showModal.value = true
    modalError.value = ''
  }

  const closeModal = () => {
    showModal.value = false
    modalError.value = ''
  }

  const setError = (error: any) => {
    if (error?.response?.data?.message) {
      modalError.value = error.response.data.message
    } else if (typeof error === 'string') {
      modalError.value = error
    } else {
      modalError.value = 'An error occurred'
    }
  }

  const clearError = () => {
    modalError.value = ''
  }

  const handleSave = async (saveFunction: any) => {
    saving.value = true
    modalError.value = ''
    try {
      await saveFunction()
      closeModal()
      return true
    } catch (error) {
      setError(error)
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    showModal,
    modalError,
    saving,
    openModal,
    closeModal,
    setError,
    clearError,
    handleSave,
  }
}
