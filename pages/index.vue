<template>

    <div class="text-white w-full text-center px-2 py-8 text-2xl">
      Generate your   
        <span class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-[#1DB954] relative inline-block">
        <span class="relative text-white">playlist</span>
      </span>
      <span>  ✨</span>
  </div>
  
  <div class="flex justify-center px-2">
    <SearchBarComponent/>
  </div>
  
</template>

<script setup lang="ts">

const config = useRuntimeConfig();

const client_id = config.public.CLIENT_ID
const redirect_uri = 'http://localhost:3000/playlist-generator/'
const scope = 'user-read-private user-read-email'


onBeforeMount(() => {
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

  // Redirect the user to Spotify authorization page
  // window.location.href = spotifyAuthUrl;
});

const { data: login } = useAsyncData('login', () => $fetch(`https://accounts.spotify.com/authorize?`, {
  method: 'POST',
  body: {
    response_type: 'code',
    client_id: client_id,
    redirect_uri: redirect_uri,
    scope: scope,
  }
}))

console.log('login', login);


</script>