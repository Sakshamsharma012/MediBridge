import axios from 'axios';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medibridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const medicineService = {
  search: (params) => api.get('/medicines/search', { params }),
  getById: (id) => api.get(`/medicines/${id}`),
};

export const donationService = {
  create: (formData) => api.post('/donations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyDonations: () => api.get('/donations/my'),
  getById: (id) => api.get(`/donations/${id}`),
  verify: (id, payload) => api.patch(`/donations/${id}/verify`, payload),
};

export const requestService = {
  create: (payload) => api.post('/requests', payload),
  getMyRequests: () => api.get('/requests/my'),
  getAllRequests: () => api.get('/requests/all'),
  updateStatus: (id, payload) => api.patch(`/requests/${id}/status`, payload),
};

export const pharmacyService = {
  getInventory: () => api.get('/pharmacies/inventory'),
  addInventory: (payload) => api.post('/pharmacies/inventory', payload),
  updateInventory: (id, payload) => api.patch(`/pharmacies/inventory/${id}`, payload),
};

export const orderService = {
  create: (payload) => api.post('/orders', payload),
  getMyOrders: () => api.get('/orders/my'),
  getPharmacyOrders: () => api.get('/orders/pharmacy'),
  updateStatus: (id, payload) => api.patch(`/orders/${id}/status`, payload),
};

export const locationService = {
  getNearby: (params) => api.get('/locations/nearby', { params }),
};

export const alternativesService = {
  getByMedicineId: (id) => api.get(`/alternatives/${id}`),
};

export const healthcareService = {
  getFirstAid: () => api.get('/healthcare/first-aid'),
  getSelfCare: () => api.get('/healthcare/self-care'),
  generatePlan: (data) => api.post('/healthcare/generate-plan', data),
};

export const adminService = {
  getMetrics: () => api.get('/admin/dashboard'),
  getVerifications: () => api.get('/admin/verifications'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

export const mlService = {
  getDemandForecast: (medicineId) => api.get(`/ml/demand/${medicineId}`),
};
