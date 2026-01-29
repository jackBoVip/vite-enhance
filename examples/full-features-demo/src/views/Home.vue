<script setup lang="ts">
const features = [
  { name: 'Vue 3', desc: 'Framework auto-detection', icon: '🖖' },
  { name: 'CDN', desc: 'External dependencies via CDN', icon: '🌐' },
  { name: 'Cache', desc: 'Build caching for speed', icon: '⚡' },
  { name: 'Analyze', desc: 'Bundle size analysis', icon: '📊' },
  { name: 'PWA', desc: 'Progressive Web App', icon: '📱' },
]
</script>

<template>
  <div class="home">
    <h2>All Features Enabled</h2>
    <p>This demo combines all vite-enhance features:</p>
    
    <div class="features">
      <div v-for="feature in features" :key="feature.name" class="feature">
        <span class="icon">{{ feature.icon }}</span>
        <h3>{{ feature.name }}</h3>
        <p>{{ feature.desc }}</p>
      </div>
    </div>
    
    <div class="tips">
      <h3>Test Instructions:</h3>
      <ul>
        <li>Run <code>pnpm build</code> to test all features</li>
        <li>Check <code>dist/stats.html</code> for bundle analysis</li>
        <li>Check Network tab for CDN requests</li>
        <li>Install as PWA from browser menu</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}

h2 {
  color: #4DBA87;
  margin-bottom: 0.5rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.feature {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

.icon {
  font-size: 2rem;
}

.feature h3 {
  margin: 0.5rem 0 0.25rem;
}

.feature p {
  font-size: 0.875rem;
  color: #666;
}

.tips {
  text-align: left;
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
}

.tips ul {
  margin: 0.5rem 0 0 1.5rem;
}

code {
  background: #263238;
  color: #80cbc4;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
