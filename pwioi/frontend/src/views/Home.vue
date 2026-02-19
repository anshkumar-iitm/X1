<template>
  <div class="home">
    <div class="hero">
      <h1>Split Expenses, Settle Debts</h1>
      <p>A simple and transparent way to split bills among friends using Algorand</p>

      <div v-if="!walletStore.isConnected" class="cta-section">
        <p>Connect your wallet to get started</p>
        <WalletConnect />
      </div>

      <div v-else class="cta-section">
        <router-link to="/groups" class="btn btn-primary btn-large">
          View Your Groups
        </router-link>
      </div>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>Create Groups</h3>
        <p>Add friends by their Algorand addresses and create expense groups</p>
      </div>

      <div class="feature-card">
        <h3>Track Expenses</h3>
        <p>Record bills and automatically calculate who owes what</p>
      </div>

      <div class="feature-card">
        <h3>Instant Settlements</h3>
        <p>Pay debts directly over Algorand with one click</p>
      </div>

      <div class="feature-card">
        <h3>Transparent</h3>
        <p>All transactions are recorded on the blockchain</p>
      </div>
    </div>

    <div class="how-it-works">
      <h2>How It Works</h2>
      <ol>
        <li>Connect your Algorand wallet</li>
        <li>Create an expense group and add members</li>
        <li>Log expenses as they happen</li>
        <li>See who owes whom automatically calculated</li>
        <li>Settle debts with one-click Algorand payments</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWalletStore } from '../stores/walletStore';
import WalletConnect from '../components/WalletConnect.vue';

const walletStore = useWalletStore();
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  margin-bottom: 4rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.hero p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.cta-section {
  margin-top: 2rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  color: #333;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.how-it-works {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.how-it-works h2 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.how-it-works ol {
  list-style: decimal;
  list-style-position: inside;
  counter-reset: step-counter;
  max-width: 600px;
  margin: 0 auto;
}

.how-it-works li {
  padding: 1rem 0;
  padding-left: 2rem;
  color: #555;
  line-height: 1.6;
  border-bottom: 1px solid #eee;
}

.how-it-works li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .how-it-works {
    padding: 1.5rem;
  }
}
</style>
