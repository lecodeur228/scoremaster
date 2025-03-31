<template>
  <div class="match-list-container">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
        Liste des Matchs
      </h3>
      <button
          @click="refreshMatches"
          class="flex items-center text-primary hover:text-primary-dark"
          :disabled="loading"
      >
        <font-awesome-icon
            icon="sync-alt"
            class="mr-2"
            :class="{ 'animate-spin': loading }"
        />
        Rafraîchir
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Liste vide -->
    <div
        v-else-if="matches.length === 0"
        class="text-center py-12 text-gray-500 dark:text-gray-400"
    >
      <font-awesome-icon icon="futbol" class="text-4xl mb-4" />
      <p>Aucun match disponible</p>
      <p class="text-sm mt-2">Créez votre premier match pour commencer</p>
    </div>

    <!-- Liste des matchs -->
    <div v-else class="space-y-4">
      <div
          v-for="match in matches"
          :key="match.id"
          class="match-card bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-white mb-1">
              {{ match.name }}
            </h4>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                  class="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300"
              >
                <font-awesome-icon icon="hashtag" class="mr-1" />
                {{ match.code }}
              </span>
              <span
                  class="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300"
              >
                <font-awesome-icon icon="users" class="mr-1" />
                {{ match.teams.length }} équipes
              </span>
              <span
                  v-if="!match.active"
                  class="text-xs bg-red-100 dark:bg-red-900 px-2 py-1 rounded-full text-red-700 dark:text-red-300"
              >
                Terminé
              </span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
                @click="goToMatchManagement(match.id)"
                class="px-4 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm"
            >
              Gérer
            </button>
            <button
                @click="confirmDeleteMatch(match)"
                class="px-4 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm"
            >
              Supprimer
            </button>
          </div>
        </div>

        <!-- Équipes et scores -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
              v-for="team in match.teams"
              :key="team.id"
              class="team-item bg-gray-50 dark:bg-gray-800 p-2 rounded flex justify-between items-center"
          >
            <span class="font-medium text-gray-700 dark:text-gray-300">
              {{ team.name }}
            </span>
            <span class="font-bold text-primary">
              {{ team.score }} pts
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation de suppression -->
    <ConfirmationDialog
        v-if="showDeleteConfirmation"
        :show="showDeleteConfirmation"
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible."
        @confirm="deleteMatch"
        @cancel="showDeleteConfirmation = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {useMatchesStore} from "../../stores/matches.store.ts";
import type {Match} from "../../types/match.ts";
import ConfirmationDialog from "../common/ConfirmationDialog.vue";

const router = useRouter()
const matchesStore = useMatchesStore()

const matches = ref<Match[]>([])
const loading = ref(false)
const showDeleteConfirmation = ref(false)
const matchToDelete = ref<Match | null>(null)

// Charge les matchs
const loadMatches = async () => {
  loading.value = true
  try {
    await matchesStore.fetchUserMatches()
    matches.value = [...matchesStore.matches]
  } finally {
    loading.value = false
  }
}

// Rafraîchit la liste
const refreshMatches = async () => {
  await loadMatches()
}

// Gestion de la suppression
const confirmDeleteMatch = (match: Match) => {
  matchToDelete.value = match
  showDeleteConfirmation.value = true
}

const deleteMatch = async () => {
  if (matchToDelete.value) {
    await matchesStore.deleteMatch(matchToDelete.value.id)
    await loadMatches()
    showDeleteConfirmation.value = false
  }
}

// Navigation
const goToMatchManagement = (matchId: string) => {
  router.push({ name: 'manage-match', params: { id: matchId } })
}

// Charge les matchs au montage
onMounted(() => {
  loadMatches()
})
</script>

<style scoped>
.match-list-container {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
}

.match-card {
  @apply transition-all duration-200 ease-in-out;
}

.match-card:hover {
  @apply transform scale-[1.005];
}

.team-item {
  @apply transition-colors duration-150;
}
</style>