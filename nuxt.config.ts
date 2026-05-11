// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      hello: "",
    },
  },
  app: {
    baseURL: "/pizziria/",
  },

  studio: {
    repository: {
      provider: "github",
      owner: "schumkov-maksim",
      repo: "pizziria",
      branch: "deploy",
      instanceUrl: "https://schumkov-maksim.github.io/pizziria/",
    },
  },
  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-swiper",
    "nuxt-component-meta",
    "@nuxtjs/mdc",
    "@nuxt/content",
    "nuxt-studio",
  ],
  css: ["~/assets/scss/main.scss"],
});
