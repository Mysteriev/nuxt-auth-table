import { useAuthStore } from '~/store/auth'; // <-- Add this line

export default defineNuxtRouteMiddleware((to, from) => {
    // This middleware runs on every route change (client and server side)
    const authStore = useAuthStore(); // Now this function is explicitly imported

    // Initialize store state from cookie if not already done
    // This ensures server-side rendering knows the auth state
    // Note: useCookie automatically syncs, but explicit check can be clearer
    if (process.server && !authStore.user) {
        authStore.checkAuthState();
    }

    const requiresAuth = to.path === '/account';
    const isLoginPage = to.path === '/login';

    // If trying to access a protected page and not logged in, redirect to login
    if (requiresAuth && !authStore.isAuthenticated) {
      console.log('Redirecting to login (not authenticated)');
      return navigateTo('/login');
    }

    // If trying to access login page but already logged in, redirect to account
    if (isLoginPage && authStore.isAuthenticated) {
      console.log('Redirecting to account (already authenticated)');
      return navigateTo('/account');
    }

    // Otherwise, allow navigation
});
