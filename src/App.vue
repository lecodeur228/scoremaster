<template>
  <div id="app" class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <router-view />
    <div class="fixed top-4 right-4">
      <dark-mode-toggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import DarkModeToggle from "./components/common/DarkModeToggle.vue";
import { auth } from './services/firebase'
import {useAuthStore} from "./stores/auth.store.ts";

const authStore = useAuthStore()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    authStore.setUser(user)
  })
})
</script>