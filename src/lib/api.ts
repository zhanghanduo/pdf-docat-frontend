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

export default apiClient; 