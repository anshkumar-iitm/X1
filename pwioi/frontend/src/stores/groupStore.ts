import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

interface Group {
  _id: string;
  name: string;
  description?: string;
  creatorAddress: string;
  members: Array<{ address: string; name: string }>;
  createdAt: string;
}

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>([]);
  const currentGroup = ref<Group | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const hasGroups = computed(() => groups.value.length > 0);

  async function fetchGroups(address?: string) {
    loading.value = true;
    error.value = null;
    try {
      const params = address ? { address } : {};
      const response = await axios.get('/api/groups', { params });
      groups.value = response.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchGroup(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`/api/groups/${id}`);
      currentGroup.value = response.data.group;
      return response.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function createGroup(groupData: any) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post('/api/groups', groupData);
      groups.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function updateGroup(id: string, groupData: any) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`/api/groups/${id}`, groupData);
      const index = groups.value.findIndex(g => g._id === id);
      if (index !== -1) {
        groups.value[index] = response.data;
      }
      currentGroup.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function addMember(groupId: string, member: any) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`/api/groups/${groupId}/members`, member);
      const index = groups.value.findIndex(g => g._id === groupId);
      if (index !== -1) {
        groups.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    groups,
    currentGroup,
    loading,
    error,
    hasGroups,
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    addMember
  };
});
