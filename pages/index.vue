<template>
  <div>Redirecting...</div>
  <!-- You can optionally add a loading indicator here -->
</template>

<script setup lang="ts">
// On component setup (runs on server and client), navigate to login
await navigateTo('/login', { replace: true });
</script>
