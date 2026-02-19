<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <div class="nav-brand">
          <h1>Split the Bill</h1>
          <p class="tagline">Algorand Expense Splitter</p>
        </div>
        <WalletConnect />
      </div>
    </nav>

    <main class="container">
      <router-view />
    </main>

    <footer class="footer">
      <p>&copy; 2024 Split the Bill dApp. Built on Algorand.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import WalletConnect from './components/WalletConnect.vue';
import { useWalletStore } from './stores/walletStore';

const walletStore = useWalletStore();

onMounted(() => {
  walletStore.loadAddress();
});
</script>

<style>
:root {
  --primary: #007bff;
  --danger: #dc3545;
  --success: #28a745;
  --light: #f8f9fa;
  --dark: #212529;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  background: #f5f5f5;
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-brand h1 {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.tagline {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

main {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .navbar .container {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .nav-brand h1 {
    font-size: 1.5rem;
  }
}
</style>
