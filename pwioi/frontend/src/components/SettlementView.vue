<template>
  <div class="settlement-view">
    <h2>Settlements</h2>

    <div v-if="loading" class="loading">Loading settlements...</div>

    <div v-else-if="settlements.length === 0" class="empty-state">
      <p>No pending settlements</p>
    </div>

    <div v-else class="settlements-list">
      <div
        v-for="settlement in settlements"
        :key="settlement._id"
        class="settlement-item"
        :class="{ 'user-pays': userPays(settlement), 'user-receives': userReceives(settlement) }"
      >
        <div class="settlement-info">
          <div class="settlement-direction">
            <span v-if="userPays(settlement)" class="badge badge-danger">You owe</span>
            <span v-else-if="userReceives(settlement)" class="badge badge-success">You receive</span>
          </div>

          <div class="settlement-details">
            <p>
              <strong>{{ getUserName(settlement) }}</strong>
            </p>
            <p class="amount">{{ settlement.amount.toFixed(3) }} ALGO</p>
          </div>
        </div>

        <div class="settlement-actions">
          <button
            v-if="userPays(settlement) && !settlement.isPaid"
            @click="initiatePayment(settlement)"
            :disabled="paymentLoading"
            class="btn btn-primary"
          >
            {{ paymentLoading === settlement._id ? 'Processing...' : 'Pay Now' }}
          </button>
          <span v-else-if="settlement.isPaid" class="paid-badge">✓ Paid</span>
        </div>
      </div>
    </div>

    <!-- Payment Confirmation Modal -->
    <div v-if="showPaymentModal" class="modal-overlay" @click.self="closePaymentModal">
      <div class="modal">
        <h3>Confirm Payment</h3>
        <div v-if="selectedSettlement" class="payment-details">
          <p>
            Pay <strong>{{ getUserName(selectedSettlement) }}</strong>
          </p>
          <p class="amount">{{ selectedSettlement.amount.toFixed(3) }} ALGO</p>
          <p class="address-label">To: <code>{{ selectedSettlement.toAddress }}</code></p>
        </div>

        <div v-if="paymentError" class="error-message">{{ paymentError }}</div>

        <div class="modal-actions">
          <button
            @click="confirmPayment"
            :disabled="paymentLoading"
            class="btn btn-primary"
          >
            {{ paymentLoading ? 'Processing...' : 'Confirm Payment' }}
          </button>
          <button @click="closePaymentModal" class="btn btn-secondary">
            Cancel
          </button>
        </div>

        <p v-if="transactionLink" class="success-message">
          Payment successful!
          <a :href="transactionLink" target="_blank">View on Explorer</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { getGroupSettlements, markSettlementPaid } from '../services/api';
import { sendPayment, getExplorerUrl } from '../services/algorand';
import { useWalletStore } from '../stores/walletStore';

interface Props {
  groupId: string;
}

const props = defineProps<Props>();
const walletStore = useWalletStore();

const settlements = ref<any[]>([]);
const loading = ref(false);
const paymentLoading = ref('');
const error = ref('');
const paymentError = ref('');

const showPaymentModal = ref(false);
const selectedSettlement = ref<any>(null);
const transactionLink = ref('');

onMounted(() => {
  fetchSettlements();
});

async function fetchSettlements() {
  loading.value = true;
  error.value = '';
  try {
    const response = await getGroupSettlements(props.groupId);
    settlements.value = response.data;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch settlements';
  } finally {
    loading.value = false;
  }
}

function userPays(settlement: any): boolean {
  return settlement.fromAddress === walletStore.address;
}

function userReceives(settlement: any): boolean {
  return settlement.toAddress === walletStore.address;
}

function getUserName(settlement: any): string {
  if (userPays(settlement)) {
    return settlement.toAddress.substring(0, 8) + '...';
  } else {
    return settlement.fromAddress.substring(0, 8) + '...';
  }
}

function initiatePayment(settlement: any) {
  selectedSettlement.value = settlement;
  showPaymentModal.value = true;
  paymentError.value = '';
  transactionLink.value = '';
}

function closePaymentModal() {
  showPaymentModal.value = false;
  selectedSettlement.value = null;
  paymentError.value = '';
  transactionLink.value = '';
}

async function confirmPayment() {
  if (!selectedSettlement.value || !walletStore.address) return;

  paymentLoading.value = selectedSettlement.value._id;
  paymentError.value = '';

  try {
    // Import MyAlgo dynamically to get signer
    const MyAlgo = (await import('myalgo')).default;
    const myAlgo = new MyAlgo();

    const result = await sendPayment(
      walletStore.address,
      myAlgo,
      selectedSettlement.value.toAddress,
      selectedSettlement.value.amount
    );

    // Mark settlement as paid in database
    await markSettlementPaid(selectedSettlement.value._id, result.txId);

    // Update local data
    const settIdx = settlements.value.findIndex(s => s._id === selectedSettlement.value._id);
    if (settIdx !== -1) {
      settlements.value[settIdx].isPaid = true;
      settlements.value[settIdx].txnId = result.txId;
    }

    transactionLink.value = getExplorerUrl(result.txId);
  } catch (err: any) {
    paymentError.value = err.message || 'Payment failed';
  } finally {
    paymentLoading.value = '';
  }
}
</script>

<style scoped>
.settlement-view {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.settlements-list {
  display: grid;
  gap: 1rem;
}

.settlement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.settlement-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.settlement-item.user-pays {
  background: #ffebee;
  border-color: #ef5350;
}

.settlement-item.user-receives {
  background: #e8f5e9;
  border-color: #66bb6a;
}

.settlement-info {
  flex: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.settlement-direction {
  display: flex;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.badge-danger {
  background: #dc3545;
}

.badge-success {
  background: #28a745;
}

.settlement-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.settlement-details p {
  margin: 0;
  color: #333;
}

.settlement-details strong {
  font-weight: 600;
}

.amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #007bff;
}

.settlement-actions {
  margin-left: 1rem;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.paid-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  font-weight: 600;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal h3 {
  margin-top: 0;
  color: #333;
}

.payment-details {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.payment-details p {
  margin: 0.5rem 0;
}

.address-label {
  font-size: 0.9rem;
  color: #666;
}

.address-label code {
  display: block;
  margin-top: 0.25rem;
  font-family: 'Monaco', monospace;
  word-break: break-all;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  flex: 1;
}

.btn-secondary:hover {
  background: #5a6268;
}

.error-message {
  color: #dc3545;
  padding: 0.75rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 1rem 0;
}

.success-message {
  color: #155724;
  padding: 0.75rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin: 1rem 0;
}

.success-message a {
  color: #004085;
  text-decoration: underline;
}
</style>
