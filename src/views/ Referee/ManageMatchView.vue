<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
    <div class="flex items-center mb-6">
      <button
          @click="goBack"
          class="mr-4 text-primary dark:text-white"
      >
        <font-awesome-icon icon="arrow-left" class="mr-2" /> Retour
      </button>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
        Gestion de "{{ currentMatch?.name }}"
      </h2>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Section Scores -->
      <div class="flex-1">
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
              Scores actuels
            </h3>
            <span class="text-sm bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">
              Code: <span class="font-mono">{{ currentMatch.code }}</span>
            </span>
          </div>

          <div class="space-y-4">
            <div
                v-for="team in currentMatch.teams"
                :key="team.id"
                class="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between"
            >
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-white">
                  {{ team.name }}
                </h4>
                <div class="flex items-center mt-1">
                  <span class="text-2xl font-bold text-primary">
                    {{ team.score }}
                  </span>
                  <span class="text-gray-600 dark:text-gray-400 ml-2">
                    points
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                    @click="updateTeamScore(team.id, -1)"
                    :disabled="team.score <= 0"
                    class="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                >
                  -
                </button>
                <div class="flex flex-col space-y-1">
                  <button
                      @click="updateTeamScore(team.id, 1)"
                      class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    +1
                  </button>
                  <button
                      @click="updateTeamScore(team.id, 5)"
                      class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    +5
                  </button>
                  <!-- Bouton pour score personnalisé -->
                  <button
                      @click="openCustomScoreModal(team)"
                      class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    +/-
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Actions -->
      <div class="md:w-1/3">
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Actions
          </h3>

          <button
              @click="resetScores"
              class="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <font-awesome-icon icon="sync-alt" class="mr-2" />
            Réinitialiser les scores
          </button>

          <button
              @click="endMatch"
              class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <font-awesome-icon icon="flag-checkered" class="mr-2" />
            Terminer le match
          </button>

          <div class="pt-4">
            <h4 class="text-gray-700 dark:text-gray-300 mb-2">
              Partager le match
            </h4>
            <div class="flex items-center">
              <input
                  :value="matchShareLink"
                  readonly
                  class="font-mono text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-lg mr-2 flex-grow focus:outline-none"
              >
              <button
                  @click="copyShareLink"
                  class="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <font-awesome-icon icon="copy" />
              </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Partagez ce lien avec les spectateurs
            </p>

            <!-- QR Code Section -->
            <div class="mt-4 text-center">
              <h4 class="text-gray-700 dark:text-gray-300 mb-2">
                QR Code
              </h4>
              <div class="bg-white dark:bg-gray-800 p-3 rounded-lg inline-block">
                <QRCodeVue3
                    :value="matchShareLink"
                    :size="150"
                    level="M"
                    :background="isDarkMode ? '#1F2937' : 'white'"
                    :foreground="isDarkMode ? 'white' : 'black'"
                    class="mx-auto"
                />
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Scannez pour accéder directement au match
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de saisie personnalisée -->
    <div v-if="showCustomScoreModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeCustomScoreModal"></div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Score personnalisé pour {{ selectedTeam?.name }}
        </h3>

        <div class="mb-4">
          <label for="custom-score" class="block text-gray-700 dark:text-gray-300 mb-2">
            Entrer les points à ajouter/soustraire:
          </label>
          <input
              type="number"
              id="custom-score"
              v-model="customScoreValue"
              class="w-full px-4 py-2 border dark:bg-gray-700 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="applyCustomScore"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Utilisez des valeurs négatives pour soustraire des points
          </p>
        </div>

        <div class="flex justify-end space-x-2">
          <button
              @click="closeCustomScoreModal"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
          <button
              @click="applyCustomScore"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useMatchesStore } from "../../stores/matches.store.ts";
import QRCodeVue3 from 'qrcode-vue3'
import type { Match, Team } from '../../types/match'

const router = useRouter()
const route = useRoute()
const matchesStore = useMatchesStore()

const { copy } = useClipboard()
const matchId = computed(() => route.params.id as string)

// Gestion du modal de score personnalisé
const showCustomScoreModal = ref(false)
const selectedTeam = ref<Team | null>(null)
const customScoreValue = ref('0')

// Détection du mode sombre pour le QR code
const isDarkMode = ref(false)

// Accès au match courant
const currentMatch = computed<Match>(() => {
  return matchesStore.currentMatch || { 
    id: '',
    code: '',
    name: '',
    createdBy: '',
    timestamp: new Date(),
    teams: [],
    active: true
  }
})

// Lien de partage
const matchShareLink = computed(() => {
  if (!currentMatch.value?.code) return ''
  return `${window.location.origin}/spectator/${currentMatch.value.code}`
})

// Chargement initial et souscription aux mises à jour en temps réel
onMounted(async () => {
  if (!currentMatch.value.id) {
    await matchesStore.fetchMatchById(matchId.value)
  }

  // Détection initiale du mode sombre
  isDarkMode.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  // Écouter les changements de thème
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    isDarkMode.value = e.matches
  })
})

// Désabonnement
onUnmounted(() => {
  matchesStore.unsubscribeMatchUpdates()

  // Nettoyage des écouteurs d'événements
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {})
})

// Navigation
const goBack = () => {
  router.push({ name: 'referee-dashboard' })
}

// Gestion des scores
const updateTeamScore = async (teamId: string, points: number) => {
  await matchesStore.updateTeamScore(teamId, points)
}

const resetScores = async () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les scores ?')) {
    await matchesStore.resetScores()
  }
}

const endMatch = async () => {
  if (confirm('Êtes-vous sûr de vouloir terminer ce match ?')) {
    await matchesStore.endMatch()
    router.push({ name: 'referee-dashboard' })
  }
}

// Fonctions pour le score personnalisé
const openCustomScoreModal = (team: Team) => {
  selectedTeam.value = team
  customScoreValue.value = '0'
  showCustomScoreModal.value = true
}

const closeCustomScoreModal = () => {
  showCustomScoreModal.value = false
  selectedTeam.value = null
  customScoreValue.value = '0'
}

const applyCustomScore = async () => {
  if (!selectedTeam.value) return
  
  const score = parseInt(customScoreValue.value)
  if (isNaN(score)) return

  await matchesStore.updateTeamScore(selectedTeam.value.id, score)
  closeCustomScoreModal()
}

// Fonction pour copier le lien de partage
const copyShareLink = async () => {
  if (!matchShareLink.value) return
  try {
    await copy(matchShareLink.value)
    alert('Lien copié dans le presse-papiers !')
  } catch (error) {
    console.error('Erreur lors de la copie du lien:', error)
  }
}
</script>