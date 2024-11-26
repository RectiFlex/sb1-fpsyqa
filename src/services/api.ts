import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.aifounderhq.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Types
export interface IdeaGenerationParams {
  industry?: string;
  technology?: string[];
  marketSize?: 'small' | 'medium' | 'large';
  timeframe?: 'short' | 'medium' | 'long';
}

export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  keyFeatures: string[];
  targetAudience: string;
  revenueModel: string;
  timestamp: string;
}

// API Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  signup: async (email: string, password: string, name: string) => {
    const response = await api.post('/api/auth/signup', { email, password, name });
    return response.data;
  }
};

export const documentService = {
  getAll: async () => {
    const response = await api.get('/api/documents');
    return response.data;
  },
  create: async (document: any) => {
    const response = await api.post('/api/documents', document);
    return response.data;
  }
};

export const ideaService = {
  getAll: async () => {
    const response = await api.get('/api/ideas');
    return response.data;
  },
  create: async (idea: BusinessIdea) => {
    const response = await api.post('/api/ideas', idea);
    return response.data;
  },
  generate: async (params: IdeaGenerationParams) => {
    const response = await api.post('/api/ideas/generate', params);
    return response.data;
  }
};

export const codeService = {
  generate: async (templateId: string, customization: any) => {
    const response = await api.post('/api/code/generate', { templateId, customization });
    return response.data;
  }
};