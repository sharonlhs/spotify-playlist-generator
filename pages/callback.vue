<template>
  <div>Processing login...</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const config = useRuntimeConfig();
const client_id = config.public.CLIENT_ID;
const client_secret = config.public.CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirect_uri
        })
      });

      const data = await response.json();
      localStorage.setItem('spotify_access_token', data.access_token);
      window.location.href = '/';
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  }
});
</script>