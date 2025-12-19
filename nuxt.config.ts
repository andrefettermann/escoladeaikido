
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI
  },

   mongoose: {
    uri: process.env.MONGO_URI, // e.g., "mongodb://127.0.0.1:27017/my-database"
    //options: {},
    //modelsDir: 'models', // Default directory for models
  },

  app: {
    head: {
      title: 'E.M.A. - Escola Meirelles de Aikidô',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH', crossorigin: 'anonymous' },
        { rel: 'icon', type: 'image/png', href: '../../logo.ico' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'
        }
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz', crossorigin: 'anonymous' },
      ]
    }
  },
  modules: ['nuxt-auth-utils', 'nuxt-mongoose']
})