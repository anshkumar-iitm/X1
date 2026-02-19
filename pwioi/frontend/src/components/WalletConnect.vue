<template>
  <div class="wallet-connect">
    <div v-if="walletStore.isConnected" class="connected">
      <div class="address-display">
        <span class="label">Connected:</span>
        <code>{{ truncateAddress(walletStore.address) }}</code>
      </div>
      <button @click="disconnect" class="btn btn-secondary">Disconnect</button>
    </div>
    <div v-else>
      <button @click="connectWallet" :disabled="loading" class="btn btn-primary">
        {{ loading ? 'Connecting...' : 'Connect Wallet' }}
      </button>
      <p v-if="walletStore.error" class="error-message">{{ walletStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWalletStore } from '../stores/walletStore';

const walletStore = useWalletStore();
const loading = ref(false);

function truncateAddress(address: string | null) {
  if (!address) return '';
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}

async function connectWallet() {
  loading.value = true;
  try {
    // Dynamic import to avoid build issues
    const MyAlgo = (await import('myalgo')).default;
    const myAlgo = new MyAlgo();

    const accounts = await myAlgo.connect();
    if (accounts && accounts.length > 0) {
      walletStore.setAddress(accounts[0].address);
    }
  } catch (error: any) {
    walletStore.setError(error.message || 'Failed to connect wallet');
  } finally {
    loading.value = false;
  }
}

function disconnect() {
  walletStore.clearAddress();
}

// Load wallet on component mount if available
walletStore.loadAddress();
</script>

<style scoped>
.wallet-connect {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.connected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.address-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: #333;
}

code {
  font-family: 'Monaco', 'Courier New', monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>
