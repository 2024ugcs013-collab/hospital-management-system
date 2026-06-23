import api from './api';

export async function getPatientProfile() {
  const response = await api.get('/patients/profile');
  return response.data?.profile || null;
}

export async function updatePatientProfile(payload) {
  const response = await api.put('/patients/profile', payload);
  return response.data;
}

export async function getMedicalHistory() {
  const response = await api.get('/patients/history');
  return response.data || { appointments: [], prescriptions: [], medicalRecords: [], orders: [] };
}
