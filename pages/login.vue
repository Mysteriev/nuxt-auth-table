<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-xl font-bold text-center">Login</h2>
      </template>

      <UForm :state="state" @submit="handleLogin">
        <UFormGroup label="Username" name="username" class="mb-4">
          <UInput v-model="state.username" placeholder="david.jones@creds.com" required />
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="mb-6">
          <UInput v-model="state.password" type="password" placeholder="********" required />
        </UFormGroup>

        <UButton type="submit" block :loading="loading">
          Login
        </UButton>

        <div v-if="errorMessage" class="mt-4 text-center text-red-500 dark:text-red-400">
          {{ errorMessage }}
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/store/auth';

definePageMeta({
  layout: 'blank' // Optional: Use a layout without headers/footers if needed
});

const authStore = useAuthStore();
const router = useRouter(); // Use router for potential programmatic navigation if needed

const state = reactive({
  username: '',
  password: '',
});
const loading = ref(false);
const errorMessage = ref<string | null>(null);

async function handleLogin() {
  loading.value = true;
  errorMessage.value = null;
  try {
    await authStore.login(state.username, state.password);
    // Middleware handles redirection on success
  } catch (error: any) {
    errorMessage.value = error.message || 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
/* Add specific styles for login page if needed */
</style>
