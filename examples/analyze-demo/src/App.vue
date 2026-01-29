<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { capitalize, upperCase } from 'lodash-es'

const now = ref(dayjs())
const formatted = computed(() => now.value.format('YYYY-MM-DD HH:mm:ss'))

const text = ref('bundle analyzer')
const capitalized = computed(() => capitalize(text.value))
const upper = computed(() => upperCase(text.value))

setInterval(() => {
  now.value = dayjs()
}, 1000)
</script>

<template>
  <div class="app">
    <h1>Bundle Analyze Demo</h1>
    <p>Testing build analysis with vite-enhance</p>
    
    <div class="card">
      <h3>Current Time (dayjs)</h3>
      <p class="time">{{ formatted }}</p>
    </div>
    
    <div class="card">
      <h3>Text Transform (lodash-es)</h3>
      <p>Original: {{ text }}</p>
      <p>Capitalized: {{ capitalized }}</p>
      <p>Upper: {{ upper }}</p>
    </div>
    
    <div class="info">
      <h3>How to Analyze:</h3>
      <ol>
        <li>Run <code>pnpm build</code></li>
        <li>Check <code>dist/stats.html</code></li>
        <li>View bundle composition</li>
      </ol>
      <p>Dependencies included for analysis:</p>
      <ul>
        <li>vue (~50KB gzipped)</li>
        <li>lodash-es (~25KB gzipped)</li>
        <li>dayjs (~3KB gzipped)</li>
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
}

.card {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.time {
  font-size: 1.5rem;
  font-family: monospace;
  color: #4DBA87;
}

.info {
  text-align: left;
  background: #e3f2fd;
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
</style>
