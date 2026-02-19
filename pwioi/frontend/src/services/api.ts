import axios from 'axios';

const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Groups
export function getGroups(address?: string) {
  return apiClient.get('/groups', { params: { address } });
}

export function getGroup(id: string) {
  return apiClient.get(`/groups/${id}`);
}

export function createGroup(data: any) {
  return apiClient.post('/groups', data);
}

export function updateGroup(id: string, data: any) {
  return apiClient.put(`/groups/${id}`, data);
}

export function deleteGroup(id: string) {
  return apiClient.delete(`/groups/${id}`);
}

export function addGroupMember(groupId: string, member: any) {
  return apiClient.post(`/groups/${groupId}/members`, member);
}

// Expenses
export function getExpenses(groupId?: string) {
  return apiClient.get('/expenses', { params: { groupId } });
}

export function createExpense(data: any) {
  return apiClient.post('/expenses', data);
}

export function updateExpense(id: string, data: any) {
  return apiClient.put(`/expenses/${id}`, data);
}

export function deleteExpense(id: string) {
  return apiClient.delete(`/expenses/${id}`);
}

// Settlements
export function getSettlements(groupId?: string, address?: string) {
  return apiClient.get('/settlements', { params: { groupId, address } });
}

export function getGroupSettlements(groupId: string) {
  return apiClient.get(`/settlements/group/${groupId}`);
}

export function getPendingSettlements(address: string) {
  return apiClient.get(`/settlements/pending/${address}`);
}

export function markSettlementPaid(id: string, txnId: string) {
  return apiClient.put(`/settlements/${id}`, { txnId });
}

export default apiClient;
