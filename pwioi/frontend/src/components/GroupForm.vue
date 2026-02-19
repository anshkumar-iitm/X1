<template>
  <div class="group-form">
    <h2>{{ isEditing ? 'Edit Group' : 'Create New Group' }}</h2>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Group Name *</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          placeholder="e.g., Weekend Trip"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          v-model="form.description"
          id="description"
          placeholder="Optional group description"
          rows="3"
        ></textarea>
      </div>

      <div class="members-section">
        <h3>Add Members</h3>
        <div class="add-member">
          <input
            v-model="newMember.address"
            type="text"
            placeholder="Algorand address"
            class="address-input"
          />
          <input
            v-model="newMember.name"
            type="text"
            placeholder="Member name"
            class="name-input"
          />
          <button type="button" @click="addMember" class="btn btn-secondary">
            Add
          </button>
        </div>

        <div v-if="form.members.length > 0" class="members-list">
          <h4>Members:</h4>
          <ul>
            <li v-for="(member, idx) in form.members" :key="idx">
              <span class="member-name">{{ member.name }}</span>
              <code class="member-address">{{ truncateAddress(member.address) }}</code>
              <button
                type="button"
                @click="removeMember(idx)"
                class="btn btn-small btn-danger"
              >
                Remove
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Saving...' : 'Save Group' }}
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary">
          Cancel
        </button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useGroupStore } from '../stores/groupStore';
import { useWalletStore } from '../stores/walletStore';

interface Props {
  isEditing?: boolean;
  groupId?: string;
}

interface Member {
  address: string;
  name: string;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false
});

const groupStore = useGroupStore();
const walletStore = useWalletStore();
const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  description: '',
  members: [] as Member[]
});

const newMember = reactive({
  address: '',
  name: ''
});

function truncateAddress(address: string) {
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}

function addMember() {
  if (!newMember.address || !newMember.name) {
    error.value = 'Please enter both address and name';
    return;
  }

  if (form.members.some(m => m.address === newMember.address)) {
    error.value = 'This member is already added';
    return;
  }

  form.members.push({ ...newMember });
  newMember.address = '';
  newMember.name = '';
  error.value = '';
}

function removeMember(index: number) {
  form.members.splice(index, 1);
}

async function submitForm() {
  if (!walletStore.address) {
    error.value = 'Please connect your wallet first';
    return;
  }

  if (!form.name) {
    error.value = 'Group name is required';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const groupData = {
      name: form.name,
      description: form.description,
      creatorAddress: walletStore.address,
      members: form.members
    };

    if (props.isEditing && props.groupId) {
      await groupStore.updateGroup(props.groupId, groupData);
    } else {
      await groupStore.createGroup(groupData);
    }

    resetForm();
  } catch (err: any) {
    error.value = err.message || 'Failed to save group';
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.name = '';
  form.description = '';
  form.members = [];
  newMember.address = '';
  newMember.name = '';
  error.value = '';
}
</script>

<style scoped>
.group-form {
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
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.members-section {
  margin: 2rem 0;
}

.add-member {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.address-input {
  flex: 2;
}

.name-input {
  flex: 1;
}

.members-list {
  margin-top: 1rem;
}

.members-list h4 {
  margin-top: 0;
  color: #666;
}

.members-list ul {
  list-style: none;
  padding: 0;
}

.members-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.member-name {
  font-weight: 600;
  min-width: 100px;
}

.member-address {
  flex: 1;
  font-family: 'Monaco', monospace;
  font-size: 0.85rem;
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

.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 0.25rem 0.75rem;
}

.btn-danger:hover {
  background: #bb2d3b;
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
