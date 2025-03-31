<template>
  <div id="app" class="min-h-screen bg-white dark:bg-gray-900">
    <router-view />

    <!-- Signature -->
    <div class="text-center text-gray-500 text-sm my-4">
      <p>© 2024 • Made by LECODEUR</p>
      <a href="https://github.com/lecodeur228" target="_blank" class="inline-flex items-center mt-1 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-4 h-4 mr-1">
          <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.54 5.47 7.59.4.07.54-.17.54-.4v-1.5c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .22.14.47.55.39A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        GitHub
      </a>
      <p class="text-xs text-gray-400 mt-1">All rights reserved.</p>
    </div>

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
import { useAuthStore } from "./stores/auth.store.ts";

const authStore = useAuthStore()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    authStore.setUser(user)
  })
})
</script>