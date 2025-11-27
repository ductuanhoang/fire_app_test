import type { Device, Location, Group, Notification } from '@shared/schema';

const API_BASE = '/api';

async function fetchJSON(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Locations
export const locationApi = {
  getAll: () => fetchJSON(`${API_BASE}/locations`),
  get: (id: string) => fetchJSON(`${API_BASE}/locations/${id}`),
  create: (data: { name: string; address?: string }) => 
    fetchJSON(`${API_BASE}/locations`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{ name: string; address: string }>) =>
    fetchJSON(`${API_BASE}/locations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJSON(`${API_BASE}/locations/${id}`, { method: 'DELETE' }),
};

// Groups
export const groupApi = {
  getAll: () => fetchJSON(`${API_BASE}/groups`),
  get: (id: string) => fetchJSON(`${API_BASE}/groups/${id}`),
  create: (data: { name: string; locationId: string }) =>
    fetchJSON(`${API_BASE}/groups`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{ name: string }>) =>
    fetchJSON(`${API_BASE}/groups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJSON(`${API_BASE}/groups/${id}`, { method: 'DELETE' }),
};

// Devices
export const deviceApi = {
  getAll: () => fetchJSON(`${API_BASE}/devices`),
  get: (id: string) => fetchJSON(`${API_BASE}/devices/${id}`),
  create: (data: Partial<Device>) =>
    fetchJSON(`${API_BASE}/devices`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Device>) =>
    fetchJSON(`${API_BASE}/devices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJSON(`${API_BASE}/devices/${id}`, { method: 'DELETE' }),
};

// Notifications
export const notificationApi = {
  getAll: () => fetchJSON(`${API_BASE}/notifications`),
  getUnread: () => fetchJSON(`${API_BASE}/notifications/unread`),
  markRead: (id: string) =>
    fetchJSON(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' }),
  delete: (id: string) =>
    fetchJSON(`${API_BASE}/notifications/${id}`, { method: 'DELETE' }),
};

// MQTT
export const mqttApi = {
  configure: (config: {
    endpoint: string;
    certPath: string;
    keyPath: string;
    caPath: string;
    clientId: string;
    topics?: string[];
  }) =>
    fetchJSON(`${API_BASE}/mqtt/configure`, {
      method: 'POST',
      body: JSON.stringify(config),
    }),
  getStatus: () => fetchJSON(`${API_BASE}/mqtt/status`),
};
