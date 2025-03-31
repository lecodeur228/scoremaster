<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 max-w-md mx-auto">
    <div class="flex items-center mb-6">
      <button
          @click="goBack"
          class="mr-4 text-primary dark:text-white"
      >
        <font-awesome-icon icon="arrow-left" class="mr-1" /> Retour
      </button>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Connexion Arbitre</h2>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
            v-model="email"
            type="email"
            id="email"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
        >
      </div>

      <div>
        <label for="password" class="block text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
        <input
            v-model="password"
            type="password"
            id="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
        >
      </div>

      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>

      <button
          type="submit"
          :disabled="loading"
          class="w-full px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors disabled:opacity-50"
      >
        <span v-if="loading">Connexion en cours...</span>
        <span v-else>Se connecter</span>
      </button>
    </form>

    <div class="mt-6 text-sm text-gray-600 dark:text-gray-400">
      <p class="font-semibold">Pour tester l'application :</p>
      <p>Email: <span class="font-mono">banarin60@gmail.com</span></p>
      <p>Mot de passe: <span class="font-mono">admin1234</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from "../../stores/auth.store.ts";

const router = useRouter()
const authStore = useAuthStore()

const email = ref('banarin60@gmail.com') // Valeur par défaut pour les tests
const password = ref('admin1234') // Valeur par défaut pour les tests
const loading = ref(false)
const error = ref('')

const goBack = () => {
  router.push({ name: 'home' })
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    // Redirection après connexion réussie
    router.push({ name: 'referee-dashboard' })
  } catch (err) {
    error.value = 'Email ou mot de passe incorrect'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>