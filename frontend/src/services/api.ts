import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'debit' | 'credit';
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export interface FinancialInsight {
  id: string;
  type: 'spending' | 'saving' | 'investment';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Auth API
export const authAPI = {
  login: (credentials: LoginRequest) =>
    api.post<LoginResponse>('/api/users/login', credentials),
  
  register: (userData: RegisterRequest) =>
    api.post<User>('/api/users/register', userData),
  
  getProfile: () =>
    api.get<User>('/api/users/profile'),
  
  logout: () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
};

// Financial API
export const financialAPI = {
  getAccounts: () =>
    api.get<Account[]>('/api/accounts'),
  
  getTransactions: (accountId?: string) =>
    api.get<Transaction[]>('/api/transactions', {
      params: accountId ? { accountId } : {}
    }),
  
  getInsights: () =>
    api.get<FinancialInsight[]>('/api/insights'),
  
  connectBank: (publicToken: string) =>
    api.post('/api/plaid/exchange', { public_token: publicToken }),
};

export default api;
