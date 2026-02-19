<template>
  <div class="group-detail">
    <div class="page-header">
      <div>
        <h1 v-if="currentGroup">{{ currentGroup.name }}</h1>
        <p v-if="currentGroup && currentGroup.description" class="description">
          {{ currentGroup.description }}
        </p>
      </div>
      <router-link to="/groups" class="btn btn-secondary">← Back to Groups</router-link>
    </div>

    <div v-if="loading" class="loading">Loading group details...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="group-content">
      <!-- Members Section -->
      <div class="section">
        <h2>Members</h2>
        <div v-if="currentGroup && currentGroup.members" class="members-list">
          <div v-for="member in currentGroup.members" :key="member.address" class="member-item">
            <span class="member-name">{{ member.name }}</span>
            <code class="member-address">{{ truncateAddress(member.address) }}</code>
          </div>
        </div>
      </div>

      <!-- Add Expense Section -->
      <div class="section">
        <ExpenseForm
          :groupId="groupId"
          :groupMembers="currentGroup?.members || []"
          @expense-added="refreshData"
        />
      </div>

      <!-- Expenses List -->
      <div class="section">
        <h2>Expenses</h2>
        <div v-if="expenses.length === 0" class="empty-state">
          <p>No expenses yet. Add one to get started!</p>
        </div>
        <div v-else class="expenses-list">
          <div v-for="expense in expenses" :key="expense._id" class="expense-item">
            <div class="expense-info">
              <h4>{{ expense.description }}</h4>
              <p>
                Paid by:
                <strong>{{ getMemberName(expense.paidByAddress) }}</strong>
              </p>
              <div class="participants">
                <span class="label">Split among:</span>
                <span v-for="p in expense.participants" :key="p.address" class="participant">
                  {{ getMemberName(p.address) }} - {{ p.share.toFixed(3) }} ALGO
                </span>
              </div>
            </div>
            <div class="expense-amount">
              {{ expense.amount.toFixed(3) }} ALGO
            </div>
          </div>
        </div>
      </div>

      <!-- Settlements Section -->
      <div class="section">
        <SettlementView :groupId="groupId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupStore } from '../stores/groupStore';
import { getExpenses } from '../services/api';
import ExpenseForm from '../components/ExpenseForm.vue';
import SettlementView from '../components/SettlementView.vue';

const route = useRoute();
const groupStore = useGroupStore();

const groupId = route.params.id as string;
const loading = ref(false);
const error = ref('');
const expenses = ref<any[]>([]);
const currentGroup = computed(() => groupStore.currentGroup);

onMounted(() => {
  loadGroupData();
});

async function loadGroupData() {
  loading.value = true;
  error.value = '';
  try {
    const groupData = await groupStore.fetchGroup(groupId);
    if (groupData) {
      expenses.value = groupData.expenses || [];
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load group';
  } finally {
    loading.value = false;
  }
}

async function refreshData() {
  await loadGroupData();
}

function truncateAddress(address: string) {
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}

function getMemberName(address: string): string {
  if (!currentGroup.value) return address;
  const member = currentGroup.value.members.find(m => m.address === address);
  return member ? member.name : truncateAddress(address);
}
</script>

<style scoped>
.group-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.page-header h1 {
  margin: 0;
  color: #333;
}

.description {
  color: #666;
  margin: 0.5rem 0 0 0;
  font-size: 1.05rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-secondary:hover {
  background: #5a6268;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.group-content {
  display: grid;
  gap: 2rem;
}

.section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-top: 0;
  color: #333;
}

.members-list {
  display: grid;
  gap: 0.75rem;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.member-name {
  font-weight: 600;
  color: #333;
}

.member-address {
  font-family: 'Monaco', monospace;
  font-size: 0.85rem;
  color: #666;
}

.expenses-list {
  display: grid;
  gap: 1rem;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.expense-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.expense-info {
  flex: 1;
}

.expense-item h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.expense-item p {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #666;
}

.participants {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.label {
  font-weight: 600;
  color: #333;
}

.participant {
  background: #e7f3ff;
  color: #0066cc;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.expense-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007bff;
  margin-left: 1rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .btn-secondary {
    width: 100%;
    text-align: center;
  }

  .expense-item {
    flex-direction: column;
  }

  .expense-amount {
    margin-left: 0;
    margin-top: 0.75rem;
  }
}
</style>
