<template>
  <div class="create-match-form">
    <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Créer un nouveau match
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nom du match -->
        <div>
          <label for="match-name" class="block text-gray-700 dark:text-gray-300 mb-1">
            Nom du match *
          </label>
          <input
              v-model="form.name"
              id="match-name"
              type="text"
              placeholder="Ex: Finale Régionale"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <!-- Liste des équipes -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="block text-gray-700 dark:text-gray-300">
              Équipes *
            </label>
            <button
                type="button"
                @click="addTeam"
                class="text-primary hover:text-primary-dark flex items-center"
                :disabled="form.teams.length >= 8"
            >
              <font-awesome-icon icon="plus" class="mr-1" />
              Ajouter
            </button>
          </div>

          <!-- Inputs des équipes -->
          <div
              v-for="(_team, index) in form.teams"
              :key="index"
              class="flex gap-2 items-center"
          >
            <input
                v-model="form.teams[index]"
                type="text"
                :placeholder="`Nom de l'équipe ${index + 1}`"
                required
                class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <button
                v-if="form.teams.length > 2"
                type="button"
                @click="removeTeam(index)"
                class="text-red-500 hover:text-red-700 p-2"
            >
              <font-awesome-icon icon="times" />
            </button>
            <div v-else class="w-8"></div> <!-- Pour l'alignement -->
          </div>
          <p v-if="form.teams.length >= 8" class="text-sm text-gray-500 dark:text-gray-400">
            Maximum 8 équipes autorisées
          </p>
        </div>

        <!-- Bouton de soumission -->
        <button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="w-full px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <span v-if="isSubmitting">
            <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
            Création en cours...
          </span>
          <span v-else>Créer le match</span>
        </button>

        <!-- Message d'erreur -->
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {useMatchesStore} from "../../stores/matches.store.ts";

const matchesStore = useMatchesStore()
const router = useRouter()

// État du formulaire
const form = ref({
  name: '',
  teams: ['', ''] // 2 équipes par défaut
})

const isSubmitting = ref(false)
const error = ref('')

// Validation du formulaire
const isFormValid = computed(() => {
  return (
      form.value.name.trim() !== '' &&
      form.value.teams.every(team => team.trim() !== '') &&
      form.value.teams.length >= 2
  )
})

// Ajouter une équipe
const addTeam = () => {
  if (form.value.teams.length < 8) {
    form.value.teams.push('')
  }
}

// Supprimer une équipe
const removeTeam = (index: number) => {
  if (form.value.teams.length > 2) {
    form.value.teams.splice(index, 1)
  }
}

// Soumission du formulaire
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  error.value = ''

  try {
    const matchData = {
      name: form.value.name.trim(),
      teams: form.value.teams
          .filter(name => name.trim())
          .map((name, index) => ({
            id: `team-${Date.now()}-${index}`,
            name: name.trim(),
            score: 0
          }))
    }

    const matchId = await matchesStore.createMatch(matchData)

    // Redirection vers la page de gestion du match
    router.push({ name: 'manage-match', params: { id: matchId } })

  } catch (err) {
    console.error('Erreur création match:', err)
    error.value = "Une erreur est survenue lors de la création du match"
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.create-match-form {
  @apply max-w-md mx-auto;
}

/* Transitions pour les inputs d'équipe */
.flex-enter-active,
.flex-leave-active {
  transition: all 0.3s ease;
}
.flex-enter-from,
.flex-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>