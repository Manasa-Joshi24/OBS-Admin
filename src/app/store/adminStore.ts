import { create } from 'zustand';
import api from '../utils/api';
import { supabase } from '../utils/supabase';

interface AdminState {
  users: any[];
  transactions: any[];
  accounts: any[];
  cards: any[];
  loans: any[];
  auditLogs: any[];
  tickets: any[];
  analytics: any;
  chartData: any[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  fetchUsers: (params?: any) => Promise<void>;
  fetchTransactions: (params?: any) => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchCards: () => Promise<void>;
  fetchLoans: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchSupportTickets: (params?: any) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchChartData: () => Promise<void>;
  updateUserStatus: (userId: string, status: string) => Promise<void>;
  processTransaction: (transactionId: string, status: string) => Promise<void>;
  verifyKYC: (userId: string, status: string, reason?: string) => Promise<void>;
  subscribeToUpdates: () => () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  transactions: [],
  accounts: [],
  cards: [],
  loans: [],
  auditLogs: [],
  tickets: [],
  analytics: null,
  chartData: [],
  searchQuery: '',
  loading: false,
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchUsers: async (params) => {
    set({ loading: true });
    try {
      const response = await api.get('/admin/users', { params });
      const data = response.data.users || response.data.data || response.data;
      set({ users: Array.isArray(data) ? data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, users: [] });
    }
  },

  fetchTransactions: async (params) => {
    set({ loading: true });
    try {
      const response = await api.get('/transactions', { params });
      const data = response.data.data || response.data;
      set({ transactions: Array.isArray(data) ? data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, transactions: [] });
    }
  },

  fetchAccounts: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/admin/accounts');
      const data = response.data.data || response.data;
      set({ accounts: Array.isArray(data) ? data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, accounts: [] });
    }
  },

  fetchCards: async (params) => {
    set({ loading: true });
    try {
      const response = await api.get('/admin/cards', { params });
      const data = response.data.data || response.data;
      set({ cards: Array.isArray(data) ? data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, cards: [] });
    }
  },

  fetchLoans: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/admin/loans');
      const data = response.data.data || response.data;
      set({ loans: Array.isArray(data) ? data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, loans: [] });
    }
  },

  fetchAuditLogs: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/admin/audit-logs');
      const data = response.data.data || response.data;
      set({ auditLogs: Array.isArray(data) ? data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, auditLogs: [] });
    }
  },

  fetchSupportTickets: async (params) => {
    set({ loading: true });
    try {
      const response = await api.get('/admin/support/tickets', { params });
      const data = response.data.data || response.data;
      set({ tickets: Array.isArray(data) ? data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, tickets: [] });
    }
  },

  fetchAnalytics: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/admin/analytics');
      const data = response.data.data || response.data;
      set({ analytics: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchChartData: async () => {
    try {
      const response = await api.get('/admin/chart-data');
      set({ chartData: response.data });
    } catch (error: any) {
      console.error("Error fetching chart data:", error);
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      await api.post(`/admin/users/${userId}/status`, { status });
      get().fetchUsers();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  processTransaction: async (transactionId, status) => {
    try {
      await api.post(`/admin/transactions/${transactionId}/process`, { status });
      get().fetchTransactions();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  verifyKYC: async (userId, status, reason) => {
    try {
      await api.post(`/admin/kyc/${userId}/verify`, { status, reason });
      get().fetchUsers();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  subscribeToUpdates: () => {
    const subId = Math.random().toString(36).substring(7);
    const usersChannel = supabase
      .channel(`public:users:${subId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        get().fetchUsers();
        get().fetchAnalytics();
      })
      .subscribe();

    const txChannel = supabase
      .channel(`public:transactions:${subId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        get().fetchTransactions();
        get().fetchAnalytics();
      })
      .subscribe();

    const ticketChannel = supabase
      .channel(`public:support_tickets:${subId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
        get().fetchSupportTickets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(txChannel);
      supabase.removeChannel(ticketChannel);
    };
  },
}));

