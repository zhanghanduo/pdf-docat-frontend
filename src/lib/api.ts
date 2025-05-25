import axios from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API types
export interface GeminiSettings {
  apiKey?: string;
  model?: string;
}

export interface TranslateRequest {
  file: File;
  source_lang: string;
  target_lang: string;
  dual: boolean;
  gemini_settings?: GeminiSettings;
}

export interface TranslateResponse {
  task_id: string;
  message: string;
  status: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  pdftranslate_available: boolean;
}

export interface LanguagesResponse {
  languages: Record<string, string>;
}

// Client API Keys types
export interface SupportedService {
  service_name: string;
  supported_models: string[];
  default_model: string;
  rate_limit_per_minute: number;
  requires_model: boolean;
}

export interface SupportedServicesResponse {
  [serviceName: string]: SupportedService;
}

export interface ClientApiKeyCreate {
  service_name: string;
  api_key: string;
  name?: string;
  description?: string;
  model_name?: string;
  is_default?: boolean;
  config?: Record<string, any>;
}

export interface ClientApiKeyUpdate {
  name?: string;
  description?: string;
  model_name?: string;
  is_default?: boolean;
  is_active?: boolean;
  config?: Record<string, any>;
}

export interface ClientApiKeyResponse {
  id: number;
  user_id: number;
  service_name: string;
  name?: string;
  description?: string;
  model_name?: string;
  api_key_masked: string;
  is_active: boolean;
  is_default: boolean;
  usage_count: number;
  last_used?: string;
  created_at: string;
  updated_at: string;
  config?: Record<string, any>;
}

export interface ClientApiKeyListResponse {
  id: number;
  service_name: string;
  name?: string;
  model_name?: string;
  api_key_masked: string;
  is_active: boolean;
  is_default: boolean;
  usage_count: number;
  last_used?: string;
  created_at: string;
}

export interface ApiKeyTestRequest {
  service_name: string;
  api_key: string;
  model_name?: string;
}

export interface ApiKeyTestResponse {
  valid: boolean;
  service?: string;
  model?: string;
  rate_limit?: number;
  error?: string;
}

// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  tier: string;
  is_active: boolean;
  last_active?: string;
  created_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  name?: string;
  role?: 'admin' | 'user';
  tier?: string;
}

export interface UserUpdate {
  email?: string;
  name?: string;
  role?: 'admin' | 'user';
  tier?: string;
  is_active?: boolean;
}

// Credit types
export interface UserCredits {
  used: number;
  limit: number;
  available: number;
}

export interface CreditLog {
  id: number;
  user_id: number;
  credits: number;
  operation: 'add' | 'subtract' | 'set';
  description: string;
  created_at: string;
}

export interface CreditUpdate {
  credits: number;
  operation: 'add' | 'subtract' | 'set';
  description?: string;
}

// API functions
export const pdfApi = {
  // Health check
  async healthCheck(): Promise<HealthResponse> {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Get supported languages
  async getSupportedLanguages(): Promise<LanguagesResponse> {
    const response = await apiClient.get('/api/v1/supported-languages');
    return response.data;
  },

  // Translate PDF
  async translatePdf(request: TranslateRequest): Promise<TranslateResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('source_lang', request.source_lang);
    formData.append('target_lang', request.target_lang);
    formData.append('dual', request.dual.toString());
    
    // Add Gemini settings if provided
    if (request.gemini_settings) {
      if (request.gemini_settings.apiKey) {
        formData.append('gemini_api_key', request.gemini_settings.apiKey);
      }
      if (request.gemini_settings.model) {
        formData.append('gemini_model', request.gemini_settings.model);
      }
    }

    try {
      console.log('发送翻译请求到:', `${API_BASE_URL}/api/v1/translate`, '请求数据:', {
        source_lang: request.source_lang,
        target_lang: request.target_lang,
        dual: request.dual,
        file_name: request.file.name,
        file_size: request.file.size,
        gemini_model: request.gemini_settings?.model
      });
      
      const response = await apiClient.post('/api/v1/translate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('翻译响应:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('翻译请求错误:', error);
      
      // 详细记录错误信息
      if (error.response) {
        // 服务器返回了错误状态码
        console.error('错误状态码:', error.response.status);
        console.error('错误响应数据:', error.response.data);
        console.error('错误响应头:', error.response.headers);
        throw new Error(`服务器错误 (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('没有收到响应:', error.request);
        throw new Error('服务器未响应，请检查网络连接或服务器状态');
      } else {
        // 设置请求时发生错误
        console.error('请求错误:', error.message);
        throw new Error(`请求错误: ${error.message}`);
      }
    }
  },

  // Download translated PDF
  async downloadPdf(taskId: string): Promise<Blob> {
    const response = await apiClient.get(`/api/v1/download/${taskId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Cleanup files
  async cleanupFiles(taskId: string): Promise<void> {
    await apiClient.delete(`/api/v1/cleanup/${taskId}`);
  },
};

// Client API Keys API
export const clientApiKeysApi = {
  // Get supported services
  async getSupportedServices(): Promise<SupportedServicesResponse> {
    const response = await apiClient.get('/api/v1/client-api-keys/services');
    return response.data;
  },

  // Create API key
  async createApiKey(data: ClientApiKeyCreate): Promise<ClientApiKeyResponse> {
    const response = await apiClient.post('/api/v1/client-api-keys/', data);
    return response.data;
  },

  // List API keys
  async getApiKeys(serviceFilter?: string, activeOnly: boolean = true): Promise<ClientApiKeyListResponse[]> {
    const params: any = { active_only: activeOnly };
    if (serviceFilter) {
      params.service_name = serviceFilter;
    }
    const response = await apiClient.get('/api/v1/client-api-keys/', { params });
    return response.data;
  },

  // Get specific API key
  async getApiKey(keyId: number): Promise<ClientApiKeyResponse> {
    const response = await apiClient.get(`/api/v1/client-api-keys/${keyId}`);
    return response.data;
  },

  // Update API key
  async updateApiKey(keyId: number, data: ClientApiKeyUpdate): Promise<ClientApiKeyResponse> {
    const response = await apiClient.put(`/api/v1/client-api-keys/${keyId}`, data);
    return response.data;
  },

  // Delete API key
  async deleteApiKey(keyId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/api/v1/client-api-keys/${keyId}`);
    return response.data;
  },

  // Test API key
  async testApiKey(data: ApiKeyTestRequest): Promise<ApiKeyTestResponse> {
    const response = await apiClient.post('/api/v1/client-api-keys/test', data);
    return response.data;
  }
};

// Authentication API
export const authApi = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Register
  async register(userData: UserCreate): Promise<LoginResponse> {
    const response = await apiClient.post('/api/v1/auth/register', userData);
    return response.data;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/api/v1/users/me');
    return response.data;
  },
};

// User Management API
export const userApi = {
  // List all users (admin only)
  async getUsers(skip: number = 0, limit: number = 100): Promise<User[]> {
    const response = await apiClient.get('/api/v1/users/', {
      params: { skip, limit }
    });
    return response.data;
  },

  // Create user (admin only)
  async createUser(userData: UserCreate): Promise<User> {
    const response = await apiClient.post('/api/v1/users/', userData);
    return response.data;
  },

  // Get specific user
  async getUser(userId: number): Promise<User> {
    const response = await apiClient.get(`/api/v1/users/${userId}`);
    return response.data;
  },

  // Update user (admin only)
  async updateUser(userId: number, userData: UserUpdate): Promise<User> {
    const response = await apiClient.put(`/api/v1/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/api/v1/users/${userId}`);
    return response.data;
  },

  // Update current user
  async updateMe(userData: UserUpdate): Promise<User> {
    const response = await apiClient.put('/api/v1/users/me', userData);
    return response.data;
  },
};

// Credit Management API
export const creditApi = {
  // Get user credits
  async getUserCredits(userId?: number): Promise<UserCredits> {
    const url = userId ? `/api/v1/credits/user/${userId}` : '/api/v1/credits/';
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get credit logs
  async getCreditLogs(userId?: number, limit: number = 10, offset: number = 0): Promise<CreditLog[]> {
    const url = userId ? `/api/v1/credits/user/${userId}/logs` : '/api/v1/credits/logs';
    const response = await apiClient.get(url, {
      params: { limit, offset }
    });
    return response.data;
  },

  // Update user credits (admin only)
  async updateUserCredits(userId: number, creditData: CreditUpdate): Promise<UserCredits> {
    // Note: This endpoint might need to be implemented in the backend
    const response = await apiClient.post(`/api/v1/credits/user/${userId}/update`, creditData);
    return response.data;
  },
};

export default apiClient; 