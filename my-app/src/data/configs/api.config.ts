export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  endpoints: {
    room: {
      getAll: '/rooms',
      getById: (id: number) => `/rooms/${id}`,
      create: '/rooms',
      update: (id: number) => `/rooms/${id}`,
      delete: (id: number) => `/rooms/${id}`,
    },
    offer: {
      getAll: '/offers',
      create: '/offers',
      delete: (id: number) => `/offers/${id}`,
    },
    booking: {
      getAll: '/bookings',
      create: '/bookings',
      updateStatus: (id: string) => `/bookings/${id}/status`,
      delete: (id: string) => `/bookings/${id}`,
    }
  }
};
