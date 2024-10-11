// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // app: {
  //   baseURL: '/playlist-generator'
  // },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    public: {
      CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    }
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
