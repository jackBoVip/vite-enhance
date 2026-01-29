<script setup lang="ts">
import { ref } from 'vue'
import { capitalize } from 'lodash-es'

const message = ref('hello cdn')
const capitalizedMessage = ref(capitalize(message.value))
</script>

<template>
  <div class="app">
    <h1>CDN Demo</h1>
    <p>Testing CDN externalization with vite-enhance</p>
    
    <div class="card">
      <p>Original: {{ message }}</p>
      <p>Capitalized (lodash-es): {{ capitalizedMessage }}</p>
    </div>
    
    <div class="info">
      <h3>CDN Modules:</h3>
      <ul>
        <li>vue - UI Framework</li>
        <li>lodash-es - Utility Library</li>
        <li>axios - HTTP Client</li>
      </ul>
      <p>Check Network tab to see CDN requests!</p>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.info {
  text-align: left;
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
}

.info ul {
  margin: 0.5rem 0;
}
</style>
