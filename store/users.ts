import { defineStore } from 'pinia';
import type { UserForTable } from '~/types';

export const useUsersStore = defineStore('users', () => {
  const users = ref<UserForTable[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchUsers() {
    if (users.value.length > 0) return; // Avoid refetching if already loaded

    loading.value = true;
    error.value = null;
    try {
      // Use useFetch for automatic state management and SSR support
      const { data, pending, error: fetchError } = await useFetch<UserForTable[]>('/api/users', {
          key: 'users-data' // Unique key for caching
      });

      if (fetchError.value) {
          throw fetchError.value;
      }

      // Data is automatically unwrapped from the ref by useFetch's return
      users.value = data.value || [];

    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      error.value = err.data?.message || err.message || 'Failed to load user data.';
      users.value = []; // Clear users on error
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
  };
});
