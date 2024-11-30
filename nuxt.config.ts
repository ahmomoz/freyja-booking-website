// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ["@/assets/stylesheets/all.scss", "swiper/swiper-bundle.css"],

  router: {
    options: {
      linkActiveClass: "active",
      linkExactActiveClass: "active",
    },
  },
});

