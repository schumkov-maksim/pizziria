// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    baseURL: "/pizziria/",
  },
  modules: ["@nuxt/image", "@pinia/nuxt", "@nuxtjs/tailwindcss", "nuxt-swiper"],
  css: ["~/assets/scss/main.scss"],
});
