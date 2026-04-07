import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexus_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Products
export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  getRecommendations: (id) => api.get(`/products/${id}/recommendations`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  toggleWishlist: (id) => api.put(`/products/${id}/wishlist`),
};

// Orders
export const orderApi = {
  create: (data) => api.post('/orders', data),
  getMy: () => api.get('/orders/my'),
  getOne: (id) => api.get(`/orders/${id}`),
  markAsPaid: (id, data) => api.put(`/orders/${id}/pay`, data),
  getAll: () => api.get('/orders'),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// Services
export const serviceApi = {
  create: (data) => api.post('/services', data),
  getMy: () => api.get('/services/my'),
  getOne: (id) => api.get(`/services/${id}`),
  cancel: (id) => api.put(`/services/${id}/cancel`),
  getAll: () => api.get('/services'),
  updateStatus: (id, data) => api.put(`/services/${id}/status`, data),
};

// Builds
export const buildApi = {
  create: (data) => api.post('/builds', data),
  getMy: () => api.get('/builds/my'),
  getByCode: (code) => api.get(`/builds/share/${code}`),
  delete: (id) => api.delete(`/builds/${id}`),
  checkCompatibility: (data) => api.post('/builds/compatibility', data),
};

// Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
};

// Payment
export const paymentApi = {
  createIntent: (data) => api.post('/payment/create-intent', data),
};

export default api;
