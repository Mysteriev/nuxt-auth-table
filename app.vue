<template>
  <div>
    <!-- NuxtLayout is used if you define layouts/default.vue -->
    <!-- NuxtPage renders the current page component -->
    <NuxtPage />
    <!-- Add NuxtNotifications for Nuxt UI feedback -->
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
/* Import global styles */
@import '~/assets/scss/main.scss';
</style>
