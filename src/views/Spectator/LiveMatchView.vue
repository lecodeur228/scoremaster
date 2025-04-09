<template>
  <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex justify-center items-center">
    <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    <p class="ml-2 text-gray-700 dark:text-gray-300">Chargement du match...</p>
  </div>

  <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex items-center mb-4 text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{{ error }}</p>
    </div>
    <button
        @click="goHome"
        class="mt-4 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
    >
      Retour à l'accueil
    </button>
  </div>

  <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{ matchData.name }}</h2>
      <div class="flex items-center">
        <span class="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 mr-4">
          Code: <span class="font-mono">{{ matchData.code }}</span>
        </span>
        <span class="flex items-center text-green-500 text-sm">
          <span class="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span> En direct
        </span>
      </div>
    </div>
    <!-- Updated grid layout with enhanced score display -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="(team, index) in sortedTeams"
          :key="team.id"
          :class="`bg-white dark:bg-gray-700 p-6 rounded-lg ${isLeader(index) ? 'border-2 border-primary' : ''} transition-all hover:shadow-lg`"
      >
        <div class="flex flex-col">
          <div class="flex justify-between items-start mb-4">
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

          <div class="flex justify-center mt-2">
            <div :class="`text-5xl font-bold ${isLeader(index) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`">
              {{ team.score }}
              <span class="text-base text-gray-500 dark:text-gray-400 ml-1">pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMatchesStore } from "../../stores/matches.store.ts";

const route = useRoute()
const router = useRouter()
const matchesStore = useMatchesStore()

const loading = ref(true)
const error = ref('')
const unsubscribe = ref<(() => void) | null>(null)

// Données réactives avec valeur par défaut sécurisée
const matchData = computed(() => {
  return matchesStore.currentMatch || {
    name: '',
    code: '',
    teams: [],
    id: ''
  }
})

const sortedTeams = computed(() => {
  if (!matchData.value.teams || !matchData.value.teams.length) {
    return []
  }
  return [...matchData.value.teams].sort((a, b) => b.score - a.score)
})

const isLeader = (index: number) => {
  return index === 0 && sortedTeams.value.length > 1
}

const goHome = () => {
  router.push({ name: 'home' })
}

// Fonction pour charger les données du match
const loadMatch = async () => {
  loading.value = true
  error.value = ''

  try {
    const code = route.params.code as string

    if (!code) {
      error.value = "Code de match manquant"
      return
    }

    // Charger le match
    await matchesStore.fetchMatchByCode(code)

    // Vérifier si le match existe
    if (!matchesStore.currentMatch) {
      error.value = "Match non trouvé ou terminé"
      return
    }

    // S'abonner aux mises à jour en temps réel
    if (matchesStore.currentMatch.id) {
      unsubscribe.value = matchesStore.subscribeToLiveUpdates(matchesStore.currentMatch.id)
    }
  } catch (err) {
    console.error('Erreur lors du chargement du match:', err)
    error.value = "Erreur lors de la récupération du match"
  } finally {
    loading.value = false
  }
}

// Observer les changements de paramètre de route
watch(() => route.params.code, (newCode) => {
  if (newCode) {
    loadMatch()
  }
})

onMounted(async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Récupérer le code du match depuis les paramètres de route
    const matchCode = route.params.code as string
    if (!matchCode) {
      error.value = 'Code de match invalide'
      loading.value = false
      return
    }
    
    // Charger le match par code
    const match = await matchesStore.fetchMatchByCode(matchCode)
    if (!match) {
      error.value = 'Match non trouvé'
      loading.value = false
      return
    }
    
    // S'abonner aux mises à jour en temps réel
    unsubscribe.value = matchesStore.subscribeToMatchUpdates(match.id)
  } catch (err) {
    console.error('Erreur lors du chargement du match:', err)
    error.value = 'Une erreur est survenue lors du chargement du match'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  // Nettoyer les abonnements
  if (unsubscribe.value) {
    unsubscribe.value()
  }
  matchesStore.unsubscribeLiveUpdates()
})
</script>