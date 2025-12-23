<template>
  <div class="app">
    <header>
      <h1>Vue App Example</h1>
      <p>Powered by Vite Enhance Kit</p>
    </header>
    
    <main>
      <div class="card">
        <h2>CDN Auto-Detection Test</h2>
        <ul>
          <li>✅ Vue 3: {{ vueVersion }}</li>
          <li>✅ Lodash: {{ lodashTest }}</li>
          <li>✅ Axios: {{ axiosTest }}</li>
          <li>✅ DayJS: {{ dayJsTest }}</li>
          <li>✅ Moment: {{ momentTest }}</li>
        </ul>
      </div>
      
      <div class="card">
        <h2>Counter Example</h2>
        <button @click="count++">Count: {{ count }}</button>
        <p>Current time: {{ currentTime }}</p>
      </div>

      <div class="card">
        <h2>API Test</h2>
        <button @click="fetchData" :disabled="loading">
          {{ loading ? 'Loading...' : 'Fetch Data' }}
        </button>
        <p v-if="apiResult">{{ apiResult }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';

const count = ref(0);
const loading = ref(false);
const apiResult = ref('');

// Test CDN libraries
const vueVersion = computed(() => {
  // @ts-ignore
  return window.Vue ? `${window.Vue.version} (CDN)` : 'Local build';
});

const lodashTest = computed(() => {
  return _.isArray([1, 2, 3]) ? 'Working ✅' : 'Failed ❌';
});

const axiosTest = computed(() => {
  return axios ? 'Loaded ✅' : 'Failed ❌';
});

const dayJsTest = computed(() => {
  return dayjs().format('YYYY-MM-DD') ? 'Working ✅' : 'Failed ❌';
});

const momentTest = computed(() => {
  return moment().format('YYYY-MM-DD') ? 'Working ✅' : 'Failed ❌';
});

const currentTime = ref('');

const updateTime = () => {
  currentTime.value = dayjs().format('HH:mm:ss');
};

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    apiResult.value = `Fetched: ${response.data.title}`;
  } catch (error) {
    apiResult.value = 'Failed to fetch data';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #42b883;
  margin-bottom: 0.5rem;
}

.card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.25rem 0;
}

button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #369870;
}
</style>