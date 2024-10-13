// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.amplitude.com/script/f81a432b676c5567f9976521ccd7180b.js',
          defer: true
        },
        {
          innerHTML: `
            window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
            window.amplitude.init(window.AMPLITUDE_API_KEY, {"fetchRemoteConfig":true,"autocapture":true});
          `,
          type: 'text/javascript'
        }
      ]
    }
  },
  plugins: [
    // ... other  ...
    '~/plugins/speed-insights.client.ts'
  ],
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
      appUrl: process.env.APP_URL,
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
