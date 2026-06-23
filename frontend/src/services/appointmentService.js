import api from './api';

export async function getAppointments(status = 'all') {
  const response = await api.get('/appointments', { params: { status } });
  return response.data?.appointments || [];
}

export async function getAppointmentById(id) {
  const response = await api.get(`/appointments/${id}`);
  return response.data?.appointment;
}

export async function bookAppointment(payload) {
  const response = await api.post('/appointments', payload);
  return response.data;
}

export async function cancelAppointment(id) {
  const response = await api.put(`/appointments/${id}/cancel`);
  return response.data;
}

export async function rescheduleAppointment(id, payload) {
  const response = await api.put(`/appointments/${id}/reschedule`, payload);
  return response.data;
}
