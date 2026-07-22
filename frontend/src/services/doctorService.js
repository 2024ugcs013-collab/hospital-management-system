import api from './api';
export async function getDoctors(params = {}) {
  const response = await api.get('/doctors', { params });
  return response.data?.doctors || [];
}
