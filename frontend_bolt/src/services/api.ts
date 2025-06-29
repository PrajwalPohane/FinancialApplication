// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  user_id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending' | 'Failed' | 'Cancelled';
  user_id: string;
  user_profile: string;
  description?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    summary: {
      totalRevenue: number;
      totalExpenses: number;
      netIncome: number;
      transactionCount: number;
    };
    statusBreakdown: Record<string, number>;
    categoryBreakdown: Record<string, number>;
    chartKey: 'month' | 'day' | 'week';
    chartData: Array<{
      [key: string]: any;
      revenue: number;
      expenses: number;
    }>;
  };
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { email: string; password: string; name: string }): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<{ success: boolean; data: { user: User } }> {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData: { name?: string; email?: string }): Promise<{ success: boolean; data: { user: User } }> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Transaction endpoints
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<TransactionsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<TransactionsResponse>(endpoint);
  }

  async getTransaction(id: number): Promise<{ success: boolean; data: { transaction: Transaction } }> {
    return this.request(`/transactions/${id}`);
  }

  async createTransaction(transactionData: {
    amount: number;
    category: 'Revenue' | 'Expense';
    status: 'Paid' | 'Pending' | 'Failed' | 'Cancelled';
    description?: string;
  }): Promise<{ success: boolean; message: string; data: { transaction: Transaction } }> {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(
    id: number,
    transactionData: Partial<{
      amount: number;
      category: 'Revenue' | 'Expense';
      status: 'Paid' | 'Pending' | 'Failed' | 'Cancelled';
      description: string;
    }>
  ): Promise<{ success: boolean; message: string; data: { transaction: Transaction } }> {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  }

  async deleteTransaction(id: number): Promise<{ success: boolean; message: string }> {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics endpoints
  async getAnalytics(params?: {
    timeRange?: 'all' | 'last30days' | 'monthly' | 'selectrange';
    startDate?: string;
    endDate?: string;
  }): Promise<AnalyticsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/transactions/analytics${queryString ? `?${queryString}` : ''}`;
    
    return this.request<AnalyticsResponse>(endpoint);
  }

  // Export endpoint
  async exportTransactions(params?: {
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/transactions/export${queryString ? `?${queryString}` : ''}`;
    
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    return response.blob();
  }

  // Export analytics report
  async exportAnalytics(params?: {
    timeRange?: 'all' | 'last30days' | 'monthly' | 'selectrange';
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/transactions/analytics/export${queryString ? `?${queryString}` : ''}`;

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    return response.blob();
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions
export const downloadCSV = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}; 