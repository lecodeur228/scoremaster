
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-bold mb-2">{{ title }}</h3>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-4">
        <button @click="$emit('cancel')" class="px-4 py-2 rounded-lg border">
          Annuler
        </button>
        <button @click="$emit('confirm')" class="px-4 py-2 bg-red-500 text-white rounded-lg">
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: Boolean,
  title: String,
  message: String
})

defineEmits(['confirm', 'cancel'])
</script>