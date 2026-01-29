<script setup lang="ts">
import { ref } from 'vue'

const buildCount = ref(0)

// 模拟一些计算密集型代码
function heavyComputation() {
  let result = 0
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i)
  }
  return result
}

const computedValue = heavyComputation()
</script>

<template>
  <div class="app">
    <h1>Build Cache Demo</h1>
    <p>Testing build caching with vite-enhance</p>
    
    <div class="card">
      <p>Computed value: {{ computedValue.toFixed(2) }}</p>
      <button @click="buildCount++">Click: {{ buildCount }}</button>
    </div>
    
    <div class="info">
      <h3>How to Test Cache:</h3>
      <ol>
        <li>Run <code>pnpm build</code> (first build, creates cache)</li>
        <li>Run <code>pnpm build</code> again (should be faster)</li>
        <li>Run <code>pnpm build:clean</code> to clear cache</li>
      </ol>
      
      <h3>Cache Location:</h3>
      <p><code>node_modules/.vite-cache/</code></p>
      
      <h3>Cache Benefits:</h3>
      <ul>
        <li>✅ Faster rebuilds</li>
        <li>✅ Skip unchanged files</li>
        <li>✅ Automatic invalidation</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: system-ui, sans-serif;
}

.card {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background: #4DBA87;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #3da876;
}

.info {
  text-align: left;
  background: #fff8e1;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 2rem;
}

code {
  background: #263238;
  color: #80cbc4;
  padding: 2px 6px;
  border-radius: 4px;
}

h3 {
  margin: 1rem 0 0.5rem;
  color: #333;
}
</style>
