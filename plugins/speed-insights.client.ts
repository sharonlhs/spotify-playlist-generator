import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

export default defineNuxtPlugin(() => {
  if (process.client) {
    inject();
    injectSpeedInsights();
  }
});