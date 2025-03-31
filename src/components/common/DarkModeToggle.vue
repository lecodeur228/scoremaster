<template>
  <button
      @click="handleToggle"
      class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
      aria-label="Toggle dark mode"
  >
    <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" class="h-5 w-5" />
  </button>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { watch } from 'vue'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  storageKey: 'color-scheme'
})

const toggleDarkMode = useToggle(isDark)

// Fonction intermédiaire pour éviter les problèmes de typage
const handleToggle = () => {
  toggleDarkMode()
}

// Observer les changements et forcer la mise à jour des classes
watch(isDark, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>