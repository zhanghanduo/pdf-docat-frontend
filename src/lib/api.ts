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

// Enhanced Translation Options
export interface AdvancedTranslationOptions {
  translation_engine?: string;
  custom_prompt?: string;
  custom_system_prompt?: string;
  requests_per_second?: number;
  min_text_length?: number;
  ignore_cache?: boolean;
  rpc_doclayout?: string;
}

export interface AdvancedPDFOptions {
  pages?: string;
  no_mono?: boolean;
  no_dual?: boolean;
  dual_translate_first?: boolean;
  use_alternating_pages_dual?: boolean;
  skip_clean?: boolean;
  disable_rich_text_translate?: boolean;
  enhance_compatibility?: boolean;
  split_short_lines?: boolean;
  short_line_split_factor?: number;
  translate_table_text?: boolean;
  skip_scanned_detection?: boolean;
  ocr_workaround?: boolean;
  max_pages_per_part?: number;
  formular_font_pattern?: string;
  formular_char_pattern?: string;
}

export interface TranslationOptions {
  translate_enabled?: boolean;
  source_language?: string;
  target_language?: string;
  dual_language?: boolean;
  advanced_translation?: AdvancedTranslationOptions;
  advanced_pdf?: AdvancedPDFOptions;
}

export interface TranslateRequest {
  file: File;
  source_lang: string;
  target_lang: string;
  dual: boolean;
  gemini_settings?: GeminiSettings;
}

export interface AdvancedTranslateRequest {
  file: File;
  source_lang?: string;
  target_lang: string;
  dual?: boolean;
  translation_engine?: string;
  custom_prompt?: string;
  custom_system_prompt?: string;
  requests_per_second?: number;
  min_text_length?: number;
  ignore_cache?: boolean;
  rpc_doclayout?: string;
  pages?: string;
  no_mono?: boolean;
  no_dual?: boolean;
  dual_translate_first?: boolean;
  use_alternating_pages_dual?: boolean;
  skip_clean?: boolean;
  disable_rich_text_translate?: boolean;
  enhance_compatibility?: boolean;
  split_short_lines?: boolean;
  short_line_split_factor?: number;
  translate_table_text?: boolean;
  skip_scanned_detection?: boolean;
  ocr_workaround?: boolean;
  max_pages_per_part?: number;
  formular_font_pattern?: string;
  formular_char_pattern?: string;
}

export interface TranslateResponse {
  task_id?: string;
  logId?: number;
  message: string;
  status: string;
  extractedContent?: any;
}

export interface HealthResponse {
  status: string;
  version: string;
  pdftranslate_available: boolean;
}

export interface Language {
  code: string;
  display_name: string;
  native_name: string;
}

export interface LanguagesResponse {
  languages: Language[];
  total_count: number;
}

export interface TranslationEngine {
  id: string;
  name: string;
  available: boolean;
  settings?: Record<string, any>;
}

export interface TranslationEnginesResponse {
  engines: TranslationEngine[];
  recommended: string;
  default: string;
}

export interface UserLimits {
  limits: Record<string, any>;
  features: Record<string, boolean>;
  tier: string;
}

export interface ProcessingRecommendations {
  recommended_engine: string;
  estimated_time: number;
  estimated_cost: number;
  warnings: string[];
  suggestions: string[];
}

export interface ValidationResponse {
  valid: boolean;
  validated_settings?: Record<string, any>;
  warnings?: string[];
  user_features?: Record<string, boolean>;
  error?: string;
}

export interface DefaultSettings {
  default_settings: Record<string, any>;
  user_features: Record<string, boolean>;
  tier: string;
}

export interface PresetConfiguration {
  id: string;
  name: string;
  description: string;
  settings: Record<string, any>;
  tier_required: string;
}

export interface PresetConfigurationsResponse {
  presets: Record<string, PresetConfiguration>;
  user_tier: string;
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

// Extended user interface for admin dashboard that includes credits
export interface UserWithCredits extends User {
  credits?: UserCredits;
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

// Processing Log types
export interface ProcessingLog {
  id: number;
  user_id: number;
  file_name: string;
  file_size: number;
  file_hash?: string;
  engine: string;
  status: string;
  processing_time?: number;
  extracted_content?: any;
  file_annotations?: any;
  credits_used?: number;
  timestamp: string;
}

// Processing Status types
export interface ProcessingStatus {
  task_id: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILURE' | 'CANCELLED';
  progress: number;
  message: string;
  stage?: string;
  current_page?: number;
  total_pages?: number;
  stage_current?: number;
  stage_total?: number;
  started_at?: string;
  completed_at?: string;
  processing_time?: number;
  result?: any;
  error?: string;
}

// API functions
export const pdfApi = {
  // Health check
  async healthCheck(): Promise<HealthResponse> {
    const response = await apiClient.get('/api/v1/health');
    return response.data;
  },

  // Get supported languages
  async getSupportedLanguages(): Promise<LanguagesResponse> {
    const response = await apiClient.get('/api/v1/pdf/supported-languages');
    return response.data;
  },

  // Get translation engines
  async getTranslationEngines(): Promise<TranslationEnginesResponse> {
    const response = await apiClient.get('/api/v1/pdf/translation-engines');
    return response.data;
  },

  // Get user limits
  async getUserLimits(): Promise<UserLimits> {
    const response = await apiClient.get('/api/v1/pdf/user-limits');
    return response.data;
  },

  // Get default settings
  async getDefaultSettings(): Promise<DefaultSettings> {
    const response = await apiClient.get('/api/v1/pdf/default-settings');
    return response.data;
  },

  // Get preset configurations
  async getPresetConfigurations(): Promise<PresetConfigurationsResponse> {
    const response = await apiClient.get('/api/v1/pdf/preset-configurations');
    return response.data;
  },

  // Validate translation options
  async validateTranslationOptions(options: TranslationOptions): Promise<ValidationResponse> {
    const response = await apiClient.post('/api/v1/pdf/validate-options', options);
    return response.data;
  },

  // Get processing recommendations
  async getProcessingRecommendations(fileSize: number, pageCount: number): Promise<ProcessingRecommendations> {
    const response = await apiClient.get('/api/v1/pdf/processing-recommendations', {
      params: { file_size: fileSize, page_count: pageCount }
    });
    return response.data;
  },

  // Translate PDF
  async translatePdf(request: TranslateRequest): Promise<TranslateResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('source_lang', request.source_lang);
    formData.append('target_lang', request.target_lang);
    formData.append('dual', request.dual.toString());
    
    if (request.gemini_settings) {
      if (request.gemini_settings.apiKey) {
        formData.append('gemini_api_key', request.gemini_settings.apiKey);
      }
      if (request.gemini_settings.model) {
        formData.append('gemini_model', request.gemini_settings.model);
      }
    }

    const response = await apiClient.post('/api/v1/pdf/translate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Advanced Translate PDF
  async translatePdfAdvanced(request: AdvancedTranslateRequest): Promise<TranslateResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    
    // Basic options
    if (request.source_lang) formData.append('source_lang', request.source_lang);
    formData.append('target_lang', request.target_lang);
    if (request.dual !== undefined) formData.append('dual', request.dual.toString());
    
    // Advanced Translation Options
    if (request.translation_engine) formData.append('translation_engine', request.translation_engine);
    if (request.custom_prompt) formData.append('custom_prompt', request.custom_prompt);
    if (request.custom_system_prompt) formData.append('custom_system_prompt', request.custom_system_prompt);
    if (request.requests_per_second !== undefined) formData.append('requests_per_second', request.requests_per_second.toString());
    if (request.min_text_length !== undefined) formData.append('min_text_length', request.min_text_length.toString());
    if (request.ignore_cache !== undefined) formData.append('ignore_cache', request.ignore_cache.toString());
    if (request.rpc_doclayout) formData.append('rpc_doclayout', request.rpc_doclayout);
    
    // Advanced PDF Options
    if (request.pages) formData.append('pages', request.pages);
    if (request.no_mono !== undefined) formData.append('no_mono', request.no_mono.toString());
    if (request.no_dual !== undefined) formData.append('no_dual', request.no_dual.toString());
    if (request.dual_translate_first !== undefined) formData.append('dual_translate_first', request.dual_translate_first.toString());
    if (request.use_alternating_pages_dual !== undefined) formData.append('use_alternating_pages_dual', request.use_alternating_pages_dual.toString());
    if (request.skip_clean !== undefined) formData.append('skip_clean', request.skip_clean.toString());
    if (request.disable_rich_text_translate !== undefined) formData.append('disable_rich_text_translate', request.disable_rich_text_translate.toString());
    if (request.enhance_compatibility !== undefined) formData.append('enhance_compatibility', request.enhance_compatibility.toString());
    if (request.split_short_lines !== undefined) formData.append('split_short_lines', request.split_short_lines.toString());
    if (request.short_line_split_factor !== undefined) formData.append('short_line_split_factor', request.short_line_split_factor.toString());
    if (request.translate_table_text !== undefined) formData.append('translate_table_text', request.translate_table_text.toString());
    if (request.skip_scanned_detection !== undefined) formData.append('skip_scanned_detection', request.skip_scanned_detection.toString());
    if (request.ocr_workaround !== undefined) formData.append('ocr_workaround', request.ocr_workaround.toString());
    if (request.max_pages_per_part !== undefined) formData.append('max_pages_per_part', request.max_pages_per_part.toString());
    if (request.formular_font_pattern) formData.append('formular_font_pattern', request.formular_font_pattern);
    if (request.formular_char_pattern) formData.append('formular_char_pattern', request.formular_char_pattern);

    const response = await apiClient.post('/api/v1/pdf/translate-advanced', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get processing status
  async getProcessingStatus(taskId: string): Promise<ProcessingStatus> {
    const response = await apiClient.get(`/api/v1/pdf/status/${taskId}`);
    return response.data;
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

  // Processing logs
  async getProcessingLogs(limit: number = 10, offset: number = 0): Promise<ProcessingLog[]> {
    const response = await apiClient.get('/api/v1/pdf/logs', {
      params: { limit, offset }
    });
    return response.data;
  },

  async getProcessingLog(logId: number): Promise<ProcessingLog> {
    const response = await apiClient.get(`/api/v1/pdf/logs/${logId}`);
    return response.data;
  },

  // Download from processing log
  async downloadFromLog(logId: number): Promise<Blob> {
    const response = await apiClient.get(`/api/v1/pdf/logs/${logId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download translated PDF by log ID
  async downloadTranslatedPdf(logId: number): Promise<Blob> {
    const response = await apiClient.get(`/api/v1/pdf/download/${logId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete processing log
  async deleteProcessingLog(logId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/api/v1/pdf/logs/${logId}`);
    return response.data;
  },

  // Batch delete processing logs
  async batchDeleteProcessingLogs(logIds: number[]): Promise<{ message: string }> {
    const response = await apiClient.post('/api/v1/pdf/logs/batch-delete', logIds);
    return response.data;
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