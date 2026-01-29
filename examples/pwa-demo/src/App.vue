<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isOnline = ref(navigator.onLine)
const isPWA = ref(false)

onMounted(() => {
  // 检测是否作为 PWA 运行
  isPWA.value = window.matchMedia('(display-mode: standalone)').matches
  
  // 监听网络状态
  window.addEventListener('online', () => { isOnline.value = true })
  window.addEventListener('offline', () => { isOnline.value = false })
})
</script>

<template>
  <div class="app">
    <h1>PWA Demo</h1>
    <p>Testing Progressive Web App with vite-enhance</p>
    
    <div class="status">
      <div class="status-item" :class="{ online: isOnline, offline: !isOnline }">
        <span class="dot"></span>
        {{ isOnline ? 'Online' : 'Offline' }}
      </div>
      
      <div class="status-item" :class="{ pwa: isPWA }">
        <span class="dot"></span>
        {{ isPWA ? 'Running as PWA' : 'Running in Browser' }}
      </div>
    </div>
    
    <div class="features">
      <h3>PWA Features:</h3>
      <ul>
        <li>✅ Offline Support (Service Worker)</li>
        <li>✅ Installable (Web App Manifest)</li>
        <li>✅ Auto Update</li>
        <li>✅ Cache Strategies</li>
      </ul>
    </div>
    
    <div class="install-hint">
      <p>💡 Try installing this app from browser menu!</p>
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

.status {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: #f5f5f5;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
}

.online .dot { background: #4caf50; }
.offline .dot { background: #f44336; }
.pwa .dot { background: #2196f3; }

.features {
  text-align: left;
  background: #e8f5e9;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.features ul {
  margin: 0.5rem 0;
  list-style: none;
  padding-left: 0;
}

.install-hint {
  margin-top: 2rem;
  padding: 1rem;
  background: #fff3e0;
  border-radius: 8px;
}
</style>
