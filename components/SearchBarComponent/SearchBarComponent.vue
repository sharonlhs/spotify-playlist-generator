<template>
<form @submit.prevent class="relative w-[750px]">   
  <input class="text-lg rounded-md border-2 border-gray-300 p-2 placeholder:italic placeholder:text-slate-400 placeholder:text-base w-full" type="text" placeholder="Search..." />
  <button class="bg-[#1DB954] hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-md absolute right-1 top-1">
  Search
</button>
</form>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();


//const getUserPlaylist = await $fetch(`${config.public.API_URL}/user/playlist`);

// console.log('user playlist', getUserPlaylist);

</script>