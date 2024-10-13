// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz',
          defer: true
        },
        {
          src: 'https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.8.0-min.js.gz',
          defer: true
        },
        {
          innerHTML: `
            window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
            window.amplitude.init('${process.env.AMPLITUDE_API_KEY}', {"autocapture":{"elementInteractions":true}});
          `,
          type: 'text/javascript'
        }
      ]
    }
  },
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
