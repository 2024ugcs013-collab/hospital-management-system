import { ROLE_DASHBOARD_PATHS, ROLE_LABELS } from './constants';

export function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

export function getDashboardPath(role) {
  return ROLE_DASHBOARD_PATHS[role] || '/login';
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || 'User';
}

export function fileListToNames(fileList) {
  return Array.from(fileList || []).map((file) => file.name);
}

