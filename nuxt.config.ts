// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',     // <--- Make absolutely sure this line exists and is spelled correctly
    '@pinia/nuxt'   // <--- And this one for Pinia
  ],

  // You might have other configurations here like:
  compatibilityDate: '2025-04-15', // Or whatever date it added
  css: [
    '~/assets/scss/main.scss',
  ],
  pinia: {
    // ...
  },

})
