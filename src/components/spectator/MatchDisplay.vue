<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{ match.name }}</h2>
      <div class="flex items-center">
        <span class="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 mr-4">
          Code: <span class="font-mono">{{ match.code }}</span>
        </span>
        <span class="flex items-center text-green-500 text-sm">
          <span class="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span> En direct
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div
          v-for="(team, index) in sortedTeams"
          :key="team.id"
          :class="`bg-white dark:bg-gray-700 p-4 rounded-lg ${isLeader(index) ? 'border-2 border-primary' : ''}`"
      >
        <div class="flex justify-between items-center">
          <div>
            <div class="flex items-center">
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ team.name }}</h3>
              <span
                  v-if="isLeader(index)"
                  class="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full"
              >
                En tête
              </span>
            </div>
          </div>
          <div :class="`text-3xl font-bold ${isLeader(index) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`">
            {{ team.score }}
            <span class="text-sm text-gray-500 dark:text-gray-400">pts</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import {useMatchesStore} from "../../stores/matches.store.ts";

const props = defineProps({
  matchCode: {
    type: String,
    required: true
  }
})

const matchesStore = useMatchesStore()

const match = computed(() => matchesStore.currentMatch!)
const sortedTeams = computed(() => {
  return [...match.value.teams].sort((a, b) => b.score - a.score)
})

const isLeader = (index: number) => {
  return index === 0 && sortedTeams.value.length > 1
}

// Gestion des mises à jour en temps réel
let unsubscribe: () => void

onMounted(() => {
  unsubscribe = matchesStore.subscribeToMatchUpdates(props.matchCode)
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>