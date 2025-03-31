<template>
  <div class="not-found-container">
    <div class="text-center py-20">
      <h1 class="text-9xl font-bold text-primary dark:text-primary-light mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Oups ! Page introuvable
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
      >
        <font-awesome-icon icon="home" class="mr-2" />
        Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>

<style scoped>
.not-found-container {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>