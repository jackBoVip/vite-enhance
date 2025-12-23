<template>
  <div class="app">
    <h1>🚀 Vite Enhance Kit - Native Vite Usage</h1>
    <p>This example uses <code>defineEnhanceConfig</code> directly in <code>vite.config.ts</code></p>
    <p>Running with native <code>vite</code> commands!</p>
    
    <div class="features">
      <h2>✨ Features Enabled</h2>
      <ul>
        <li>✅ Vue 3 SFC compilation</li>
        <li>✅ Auto-detected framework</li>
        <li>✅ CDN auto-detection</li>
        <li>✅ Production optimization</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// This is a simple Vue 3 component using Composition API
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  color: #42b883;
  text-align: center;
}

.features {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.features h2 {
  margin-top: 0;
  color: #2c3e50;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  font-size: 1.1rem;
}

code {
  background: #e7f3ff;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
}
</style>