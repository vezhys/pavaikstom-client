<template>
  <div class="page-card">
    <div class="page-card-header">
      <h2 class="page-card-title">{{ title }}</h2>
      <div v-if="$slots.actions" class="page-card-actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="page-card-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
});
</script>

<style scoped>
.page-card {
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid #5a4a38;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.page-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #5a4a38;
}

.page-card-title {
  font-family: 'Georgia', serif;
  font-size: 28px;
  font-weight: 600;
  color: #e8d9bc;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.page-card-actions {
  display: flex;
  gap: 12px;
}

.page-card-content {
  color: #d4c4a8;
}
</style>
