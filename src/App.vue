<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

if (auth.isAuthenticated && !auth.user) {
  auth.fetchCurrentUser()
}
</script>

<template>
  <RouterView />
</template>

<style>
/* Global styles are in style.css */
</style>
