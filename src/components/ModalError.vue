<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal-error-message">
      {{ modelValue }}
    </div>
  </transition>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.modal-error-message {
  background: rgba(185, 28, 28, 0.15);
  border: 2px solid #b91c1c;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  color: #fca5a5;
  font-size: 14px;
  line-height: 1.5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
