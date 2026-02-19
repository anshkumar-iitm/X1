<template>
  <div class="groups-view">
    <div class="page-header">
      <h1>Your Groups</h1>
      <router-link to="/" class="btn btn-secondary">← Back Home</router-link>
    </div>

    <div v-if="!walletStore.isConnected" class="error-state">
      <p>Please connect your wallet to manage groups</p>
    </div>

    <div v-else>
      <div class="create-group-section">
        <GroupForm />
      </div>

      <div v-if="groupStore.loading" class="loading">
        Loading your groups...
      </div>

      <div v-else-if="groupStore.groups.length === 0" class="empty-state">
        <p>You don't have any groups yet.</p>
        <p>Create one above to get started!</p>
      </div>

      <div v-else class="groups-grid">
        <div v-for="group in groupStore.groups" :key="group._id" class="group-card">
          <h3>{{ group.name }}</h3>
          <p v-if="group.description" class="description">{{ group.description }}</p>

          <div class="group-members">
            <span class="member-count">👥 {{ group.members.length }} members</span>
          </div>

          <router-link :to="`/groups/${group._id}`" class="btn btn-primary">
            View Group
          </router-link>
        </div>
      </div>

      <p v-if="groupStore.error" class="error-message">{{ groupStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useGroupStore } from '../stores/groupStore';
import { useWalletStore } from '../stores/walletStore';
import GroupForm from '../components/GroupForm.vue';

const groupStore = useGroupStore();
const walletStore = useWalletStore();

onMounted(() => {
  if (walletStore.address) {
    groupStore.fetchGroups(walletStore.address);
  }
});
</script>

<style scoped>
.groups-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
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
}

.btn-secondary:hover {
  background: #5a6268;
}

.error-state,
.empty-state {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
  color: #666;
}

.error-state p,
.empty-state p {
  margin: 0.5rem 0;
}

.create-group-section {
  margin-bottom: 3rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.group-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.group-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.group-card h3 {
  margin-top: 0;
  color: #333;
  word-break: break-word;
}

.description {
  color: #666;
  font-size: 0.95rem;
  margin: 0.5rem 0 1rem 0;
  min-height: 2.8em;
}

.group-members {
  margin: 1rem 0;
  flex-grow: 1;
}

.member-count {
  display: inline-block;
  font-size: 0.9rem;
  color: #666;
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.error-message {
  color: #dc3545;
  padding: 1rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .groups-grid {
    grid-template-columns: 1fr;
  }
}
</style>
