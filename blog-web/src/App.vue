<script setup lang="ts">
const title = 'blog-web'
</script>

<template>
  <main class="shell">
    <h1>{{ title }}</h1>
    <p>Minimal front-end scaffold.</p>
  </main>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 12px;
  text-align: center;
  font-family: system-ui, sans-serif;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

p {
  margin: 0;
  color: #555;
}
</style>
