<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header>
      <h1>Full Features Demo</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
    
    <main>
      <RouterView />
    </main>
    
    <footer>
      <p>Powered by vite-enhance</p>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #333;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: #4DBA87;
  color: white;
  padding: 1rem 2rem;
}

header h1 {
  margin-bottom: 0.5rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

nav a:hover,
nav a.router-link-active {
  background: rgba(255,255,255,0.2);
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background: #f5f5f5;
  padding: 1rem;
  text-align: center;
}
</style>
