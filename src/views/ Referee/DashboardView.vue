<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Tableau de bord Arbitre</h2>
      <button
          @click="handleLogout"
          class="text-red-500 hover:text-red-700 flex items-center"
      >
        <font-awesome-icon icon="sign-out-alt" class="mr-1" /> Déconnexion
      </button>
    </div>

    <div class="flex flex-col-reverse md:flex-row gap-6">
      <!-- Liste des matchs -->
      <div class="flex-1">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Matchs créés</h3>

        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>

        <div v-else>
          <div v-if="matches.length === 0" class="text-gray-500 dark:text-gray-400">
            Aucun match créé pour le moment.
          </div>

          <div v-else class="space-y-4">
            <div
                v-for="match in matches"
                :key="match.id"
                class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <h4 class="font-semibold text-gray-800 dark:text-white">{{ match.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatTeamsList(match.teams) }}
                </p>
              </div>
              <button
                  @click="goToMatchManagement(match.id)"
                  class="px-4 py-1 bg-primary hover:bg-secondary text-white rounded-lg transition-colors text-sm"
              >
                Gérer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de création de match -->
      <div class="md:w-1/3">
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Créer un nouveau match
          </h3>

          <form @submit.prevent="handleCreateMatch" class="space-y-3">
            <div>
              <label for="match-name" class="block text-gray-700 dark:text-gray-300 mb-1">
                Nom du match
              </label>
              <input
                  v-model="newMatch.name"
                  type="text"
                  id="match-name"
                  placeholder="Ex: Finale Régionale"
                  required
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white text-base"
              >
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-gray-700 dark:text-gray-300">Équipes</label>
                <button
                    type="button"
                    @click="addTeam"
                    class="text-primary hover:text-secondary"
                >
                  <font-awesome-icon icon="plus" class="mr-1" /> Ajouter
                </button>
              </div>

              <div
                  v-for="(_team, index) in newMatch.teams"
                  :key="index"
                  class="team-input flex gap-2"
              >
                <input
                    v-model="newMatch.teams[index]"
                    type="text"
                    placeholder="Nom de l'équipe"
                    required
                    class="team-name w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white text-base"
                >
                <button
                    v-if="newMatch.teams.length > 2"
                    type="button"
                    @click="removeTeam(index)"
                    class="remove-team px-2 py-1 text-red-500 hover:text-red-700"
                >
                  <font-awesome-icon icon="times" />
                </button>
              </div>
            </div>

            <button
                type="submit"
                :disabled="isCreating"
                class="w-full px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <span v-if="isCreating">Création en cours...</span>
              <span v-else>Créer le match</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import {useMatchesStore} from "../../stores/matches.store.ts";
import type {Match, Team} from "../../types/match.ts";
import {useAuthStore} from "../../stores/auth.store.ts";

const router = useRouter()
const authStore = useAuthStore()
const matchesStore = useMatchesStore()

const loading = ref(false)
const isCreating = ref(false)
const matches = ref<Match[]>([])
const newMatch = ref({
  name: '',
  teams: ['', '']
})

// Formatte la liste des équipes pour l'affichage
const formatTeamsList = (teams : Team[]) => {
  if (teams.length > 2) {
    return `${teams.length} équipes`
  }
  return teams.map(team => team.name).join(', ')
}

// Ajouter une équipe
const addTeam = () => {
  if (newMatch.value.teams.length >= 8) {
    alert('Maximum 8 équipes autorisées')
    return
  }
  newMatch.value.teams.push('')
}

// Supprimer une équipe
const removeTeam = (index: number) => {
  if (newMatch.value.teams.length > 2) {
    newMatch.value.teams.splice(index, 1)
  }
}

// Créer un nouveau match
const handleCreateMatch = async () => {
  if (newMatch.value.teams.filter(t => t.trim()).length < 2) {
    alert('Veuillez entrer au moins 2 équipes valides')
    return
  }

  isCreating.value = true

  try {
    const matchData: Omit<Match, 'id'> = {
      name: newMatch.value.name,
      teams: newMatch.value.teams
          .filter(name => name.trim())
          .map((name, index) => ({
            id: `team-${Date.now()}-${index}`,
            name: name.trim(),
            score: 0
          })),
      code: generateMatchCode(),
      createdBy: authStore.user?.uid || '',
      timestamp: new Date(),
      active: true
    }

    const matchId = await matchesStore.createMatch(matchData)
    await fetchMatches()
    router.push({ name: 'manage-match', params: { id: matchId } })
  } catch (error) {
    console.error('Error creating match:', error)
    alert('Une erreur est survenue lors de la création du match')
  } finally {
    isCreating.value = false
  }
}

// Fonction pour générer un code de match
const generateMatchCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const code = Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('')
  console.log('Code de match généré:', code)
  return code
}

// Aller à la page de gestion d'un match
const goToMatchManagement = (matchId: string) => {
  router.push({ name: 'manage-match', params: { id: matchId } })
}

// Déconnexion
const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'home' })
}

// Charger les matchs
const fetchMatches = async () => {
  if (!authStore.user) return

  loading.value = true
  try {
    await matchesStore.fetchUserMatches(authStore.user.uid)
    // Conversion explicite du type si nécessaire
    matches.value = matchesStore.matches as Match[]

    // Alternative plus sûre :
    // matches.value = [...matchesStore.matches] // Crée une nouvelle référence
  } catch (error) {
    console.error('Error fetching matches:', error)
  } finally {
    loading.value = false
  }
}

// Au montage du composant
onMounted(async () => {
  await fetchMatches()
})
</script>