export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  endpoints: {
    institute: {
      getAll: '/institutes',
      getById: (id: string) => `/institutes/${id}`,
      create: '/institutes',
      update: (id: string) => `/institutes/${id}`,
      delete: (id: string) => `/institutes/${id}`,
    }
  }
};
