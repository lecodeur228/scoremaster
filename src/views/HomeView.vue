<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
      Bienvenue sur l'application de scores
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
          @click="navigateTo('spectator')"
          class="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center hover:shadow-lg transition-all cursor-pointer"
      >
        <i class="fas fa-users text-4xl text-primary mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Espace Spectateur</h3>
        <p class="text-gray-600 dark:text-gray-300">Entrez le code du match pour suivre les scores en temps réel</p>
      </div>
      <div
          @click="navigateTo('referee-login')"
          class="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center hover:shadow-lg transition-all cursor-pointer"
      >
        <i class="fas fa-user-shield text-4xl text-primary mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Espace Arbitre</h3>
        <p class="text-gray-600 dark:text-gray-300">Connectez-vous pour créer et gérer les matchs</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (route: string) => {
  router.push({ name: route })
}
</script>