<template>
  <div class="search-container">
    <input 
      v-model="searchQuery" 
      @keyup.enter="emitSearch" 
      placeholder="Search for a mood or feeling..." 
      class="search-input"
    />
    <button @click="emitSearch" class="search-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['search']);

const emitSearch = () => {
  emit('search', searchQuery.value);
  searchQuery.value = '';
};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  background-color: #282828;
  border-radius: 500px;
  padding: 6px;
  transition: background-color 0.3s;
}

.search-container:focus-within {
  background-color: #333;
}

.search-input {
  flex-grow: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  padding: 8px 16px;
  outline: none;
  width: 100%; /* Ensure the input takes full width */
}

.search-input::placeholder {
  color: #b3b3b3;
}

.search-button {
  background: #1DB954;
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.1s;
  flex-shrink: 0; /* Prevent button from shrinking */
}

.search-button:hover {
  background-color: #1ed760;
}

.search-button:active {
  transform: scale(0.95);
}

.search-button svg {
  width: 18px;
  height: 18px;
}
</style>