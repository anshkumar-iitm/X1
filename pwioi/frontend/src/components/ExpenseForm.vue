<template>
  <div class="expense-form">
    <h2>Add New Expense</h2>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="description">Description *</label>
        <input
          v-model="form.description"
          type="text"
          id="description"
          placeholder="e.g., Restaurant bill"
          required
        />
      </div>

      <div class="form-group">
        <label for="amount">Amount (ALGO) *</label>
        <input
          v-model.number="form.amount"
          type="number"
          id="amount"
          placeholder="0.00"
          step="0.001"
          min="0"
          required
        />
      </div>

      <div class="form-group">
        <label for="paidBy">Paid by *</label>
        <select v-model="form.paidByAddress" id="paidBy" required>
          <option value="">Select who paid</option>
          <option v-for="member in groupMembers" :key="member.address" :value="member.address">
            {{ member.name }} ({{ truncateAddress(member.address) }})
          </option>
        </select>
      </div>

      <div class="participants-section">
        <h3>Split Among</h3>
        <p class="info-text">Select who participated in this expense</p>

        <div class="participants-list">
          <label v-for="member in groupMembers" :key="member.address" class="participant-checkbox">
            <input
              type="checkbox"
              :value="member.address"
              v-model="selectedParticipants"
              @change="calculateShares"
            />
            <span>{{ member.name }}</span>
          </label>
        </div>

        <div v-if="shares.length > 0" class="shares-display">
          <h4>Share per person:</h4>
          <ul>
            <li v-for="(share, idx) in shares" :key="idx">
              <span>{{ share.name }}</span>
              <span class="amount">{{ share.share.toFixed(3) }} ALGO</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading || !isFormValid" class="btn btn-primary">
          {{ loading ? 'Adding...' : 'Add Expense' }}
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary">
          Clear
        </button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { createExpense } from '../services/api';

interface Props {
  groupId: string;
  groupMembers: Array<{ address: string; name: string }>;
}

const props = defineProps<Props>();

const loading = ref(false);
const error = ref('');
const selectedParticipants = ref<string[]>([]);

const form = reactive({
  description: '',
  amount: 0,
  paidByAddress: '',
  participants: [] as Array<{ address: string; share: number }>
});

const shares = computed(() => {
  if (!form.amount || selectedParticipants.value.length === 0) {
    return [];
  }

  const shareAmount = form.amount / selectedParticipants.value.length;
  return selectedParticipants.value.map(address => {
    const member = props.groupMembers.find(m => m.address === address);
    return {
      address,
      name: member?.name || address,
      share: shareAmount
    };
  });
});

const isFormValid = computed(() => {
  return form.description && form.amount > 0 && form.paidByAddress && shares.value.length > 0;
});

function truncateAddress(address: string) {
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}

function calculateShares() {
  form.participants = shares.value.map(s => ({
    address: s.address,
    share: s.share
  }));
}

async function submitForm() {
  loading.value = true;
  error.value = '';

  try {
    const expenseData = {
      groupId: props.groupId,
      description: form.description,
      amount: form.amount,
      paidByAddress: form.paidByAddress,
      participants: form.participants,
      currency: 'ALGO'
    };

    await createExpense(expenseData);
    resetForm();

    // Emit event to parent to refresh data
    const event = new CustomEvent('expense-added', { detail: expenseData });
    document.dispatchEvent(event);
  } catch (err: any) {
    error.value = err.message || 'Failed to add expense';
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.description = '';
  form.amount = 0;
  form.paidByAddress = '';
  form.participants = [];
  selectedParticipants.value = [];
  error.value = '';
}
</script>

<style scoped>
.expense-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.participants-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.info-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem 0;
}

.participants-list {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.participant-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.participant-checkbox:hover {
  background: #e9ecef;
}

.participant-checkbox input {
  width: auto;
  margin: 0;
}

.shares-display {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
}

.shares-display h4 {
  margin-top: 0;
  color: #666;
}

.shares-display ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.shares-display li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.shares-display li:last-child {
  border-bottom: none;
}

.amount {
  font-weight: 600;
  color: #007bff;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
  flex: 1;
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
  margin-top: 1rem;
}
</style>
