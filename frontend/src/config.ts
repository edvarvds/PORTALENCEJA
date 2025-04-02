// Em desenvolvimento, usa localhost:3001, em produção usa URLs relativas
export const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/api/auth`,
  payment: `${API_BASE_URL}/api/payment`
}; 