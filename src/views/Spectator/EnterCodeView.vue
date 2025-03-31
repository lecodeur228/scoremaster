<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
    <div class="flex items-center mb-6">
      <button
          @click="goBack"
          class="mr-4 text-primary dark:text-white"
      >
        <font-awesome-icon icon="arrow-left" class="mr-2" /> Retour
      </button>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Espace Spectateur</h2>
    </div>

    <div v-if="!hasMatchCode">
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        Entrez le code du match fourni par l'arbitre pour accéder aux scores en direct.
      </p>

      <div class="flex flex-col md:flex-row gap-4">
        <input
            v-model="matchCode"
            type="text"
            placeholder="Code du match"
            class="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
            @keyup.enter="accessMatch"
        >
        <button
            @click="accessMatch"
            :disabled="loading"
            class="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <span v-if="loading">Chargement...</span>
          <span v-else>Accéder au match</span>
        </button>
      </div>

      <div v-if="error" class="text-red-500 mt-2">
        {{ error }}
      </div>
    </div>



  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {useMatchesStore} from "../../stores/matches.store.ts";

const router = useRouter()
const matchesStore = useMatchesStore()

const matchCode = ref('')
const hasMatchCode = ref(false)
const loading = ref(false)
const error = ref('')

const goBack = () => {
  router.push({ name: 'home' })
}

const accessMatch = async () => {
  if (!matchCode.value.trim()) {
    error.value = 'Veuillez entrer un code de match'
    return
  }
  loading.value = true
  try {
    const code = matchCode.value.trim().toUpperCase()
    const match = await matchesStore.fetchMatchByCode(code)

    if (match) {
      hasMatchCode.value = true
    } else {
      error.value = 'Code de match invalide ou match terminé'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la récupération du match'
    console.error(err)
  } finally {
    loading.value = false
  }

  router.push({ name: 'live-match' , params: { code:  matchCode.value.trim().toUpperCase() }})


}
</script>