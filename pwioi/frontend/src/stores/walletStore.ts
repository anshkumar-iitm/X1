import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWalletStore = defineStore('wallet', () => {
  const address = ref<string | null>(null);
  const isConnected = ref(false);
  const error = ref<string | null>(null);

  function setAddress(newAddress: string) {
    address.value = newAddress;
    isConnected.value = true;
    localStorage.setItem('walletAddress', newAddress);
  }

  function clearAddress() {
    address.value = null;
    isConnected.value = false;
    localStorage.removeItem('walletAddress');
  }

  function loadAddress() {
    const saved = localStorage.getItem('walletAddress');
    if (saved) {
      address.value = saved;
      isConnected.value = true;
    }
  }

  function setError(message: string) {
    error.value = message;
  }

  function clearError() {
    error.value = null;
  }

  return {
    address,
    isConnected,
    error,
    setAddress,
    clearAddress,
    loadAddress,
    setError,
    clearError
  };
});
