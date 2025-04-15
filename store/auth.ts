import { defineStore } from 'pinia';
import type { User } from '~/types'; // Use the base User type for logged-in user info

// Define the shape of the user data stored after login
interface LoggedInUser {
  id: string;
  name: string;
  surname: string;
  active: boolean;
  created: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Use useCookie for SSR-friendly persistence
  const userCookie = useCookie<LoggedInUser | null>('auth-user');
  const user = ref<LoggedInUser | null>(userCookie.value ?? null);

  const isAuthenticated = computed(() => !!user.value);

  async function login(username: string, password: string): Promise<void> {
    try {
      // Call the server API route
      const loggedInUser = await $fetch<LoggedInUser>('/api/login', {
        method: 'POST',
        body: { username, password },
      });

      if (loggedInUser) {
        user.value = loggedInUser;
        userCookie.value = loggedInUser; // Store user data in cookie
        await navigateTo('/account'); // Redirect on success
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      // Rethrow or handle specific error messages
      const errorMessage = error.data?.message || error.data?.statusMessage || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  }

  async function logout(): Promise<void> {
    user.value = null;
    userCookie.value = null; // Clear the cookie
    await navigateTo('/login');
  }

  // Function to check auth state (useful if initializing from cookie elsewhere)
  function checkAuthState() {
      user.value = userCookie.value ?? null;
  }

  // Call checkAuthState on initialization (Pinia setup handles this)
  // checkAuthState(); // No need to call explicitly here, cookie ref handles it

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuthState
  };
});

