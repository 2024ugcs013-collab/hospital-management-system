import api from './api';

export function logout() {
  window.localStorage.removeItem('hms_token');
  window.localStorage.removeItem('hms_user');
}

export async function registerPatient(payload) {
  const response = await api.post('/auth/register/patient', payload);
  return response.data;
}

export async function registerDoctor(payload, onUploadProgress) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await api.post('/auth/register/doctor', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

  return response.data;
}

export async function login(payload) {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function forgotPassword(payload) {
  const response = await api.post('/auth/forgot-password', payload);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}
