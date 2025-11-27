import { create } from 'zustand';

// Types
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'warning' | 'emergency' | 'pre-soaking';
export type OperationalMode = 'automatic' | 'manual';
export type FireStatus = 'safe' | 'warning' | 'active';

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  groupId: string;
  locationId: string;
  status: DeviceStatus;
  mode: OperationalMode;
  fireStatus: FireStatus;
  batteryLevel: number;
  pressureLevel: number;
  co2Level: number;
  particulateMatter: number;
  windSpeed: number; // mph
  windDirection: number; // degrees (0-360)
  height: number; // feet
  lastMaintenance: string;
  x?: number; // Map coordinate
  y?: number; // Map coordinate
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface Group {
  id: string;
  name: string;
  locationId: string;
}

export interface Notification {
  id: string;
  type: 'emergency' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  deviceId?: string;
  read: boolean;
}

export interface AppState {
  isAuthenticated: boolean;
  currentUser: { name: string } | null;
  
  devices: Device[];
  locations: Location[];
  groups: Group[];
  notifications: Notification[];
  
  // Actions
  login: (username: string) => void;
  logout: () => void;
  
  // Data loading
  setDevices: (devices: Device[]) => void;
  setLocations: (locations: Location[]) => void;
  setGroups: (groups: Group[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  
  addDevice: (device: Partial<Device>) => void;
  updateDevice: (id: string, data: Partial<Device>) => void;
  updateDeviceFromBackend: (device: Device) => void;
  removeDevice: (id: string) => void;
  
  addLocation: (name: string, address: string) => string;
  updateLocation: (id: string, name: string, address?: string) => void;
  addGroup: (name: string, locationId: string) => string;
  updateGroup: (id: string, name: string) => void;
  
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

// Mock Data
const INITIAL_LOCATIONS = [
  { id: 'loc-1', name: 'Home', address: '123 Tech Blvd' },
  { id: 'loc-2', name: 'Warehouse A', address: '456 Industry Rd' }
];

const INITIAL_GROUPS = [
  { id: 'grp-1', name: 'Back Yard', locationId: 'loc-1' },
  { id: 'grp-2', name: 'Loading Dock', locationId: 'loc-2' },
  { id: 'grp-3', name: 'Front Yard', locationId: 'loc-1' }
];

const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev-1',
    name: 'Turret Alpha',
    serialNumber: 'FD-500-8849-XJ',
    groupId: 'grp-1',
    locationId: 'loc-1',
    status: 'online',
    mode: 'automatic',
    fireStatus: 'safe',
    batteryLevel: 98,
    pressureLevel: 100,
    co2Level: 412,
    particulateMatter: 12,
    windSpeed: 8.5,
    windDirection: 45, // NE
    height: 12,
    lastMaintenance: '2023-10-15',
    x: 50, y: 50
  },
  {
    id: 'dev-2',
    name: 'Turret Beta',
    serialNumber: 'FD-500-9921-AB',
    groupId: 'grp-1',
    locationId: 'loc-1',
    status: 'warning',
    mode: 'manual',
    fireStatus: 'safe',
    batteryLevel: 45,
    pressureLevel: 92,
    co2Level: 800,
    particulateMatter: 35,
    windSpeed: 12.2,
    windDirection: 180, // S
    height: 8,
    lastMaintenance: '2023-09-20',
    x: 30, y: 60
  },
  {
    id: 'dev-3',
    name: 'Dock Sentry',
    serialNumber: 'FD-500-7732-ZZ',
    groupId: 'grp-2',
    locationId: 'loc-2',
    status: 'offline',
    mode: 'automatic',
    fireStatus: 'safe',
    batteryLevel: 0,
    pressureLevel: 0,
    co2Level: 0,
    particulateMatter: 0,
    windSpeed: 0,
    windDirection: 0,
    height: 15,
    lastMaintenance: '2023-01-10',
    x: 70, y: 20
  },
  {
    id: 'dev-4',
    name: 'South Perimeter',
    serialNumber: 'FD-500-4452-KL',
    groupId: 'grp-2',
    locationId: 'loc-2',
    status: 'pre-soaking',
    mode: 'automatic',
    fireStatus: 'safe',
    batteryLevel: 88,
    pressureLevel: 95,
    co2Level: 450,
    particulateMatter: 18,
    windSpeed: 5.2,
    windDirection: 270, // W
    height: 20,
    lastMaintenance: '2023-11-05',
    x: 20, y: 80
  },
  {
    id: 'dev-5',
    name: 'West Hallway',
    serialNumber: 'FD-500-1123-EM',
    groupId: 'grp-3',
    locationId: 'loc-1',
    status: 'emergency',
    mode: 'manual',
    fireStatus: 'warning',
    batteryLevel: 92,
    pressureLevel: 85,
    co2Level: 1200,
    particulateMatter: 150,
    windSpeed: 0,
    windDirection: 0,
    height: 10,
    lastMaintenance: '2023-12-01',
    x: 85, y: 40
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'not-1', type: 'warning', title: 'Low Battery Warning', message: 'Turret Beta is at 45% battery.', timestamp: '10 mins ago', deviceId: 'dev-2', read: false },
  { id: 'not-2', type: 'info', title: 'Maintenance Completed', message: 'Routine check finished for Turret Alpha.', timestamp: '2 hours ago', deviceId: 'dev-1', read: true },
  { id: 'not-3', type: 'emergency', title: 'Connection Lost', message: 'Dock Sentry has gone offline.', timestamp: '1 day ago', deviceId: 'dev-3', read: false }
];

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  
  devices: [],
  locations: [],
  groups: [],
  notifications: [],
  
  login: (username) => set({ isAuthenticated: true, currentUser: { name: username } }),
  logout: () => set({ isAuthenticated: false, currentUser: null }),
  
  // Data loading
  setDevices: (devices) => set({ devices }),
  setLocations: (locations) => set({ locations }),
  setGroups: (groups) => set({ groups }),
  setNotifications: (notifications) => set({ notifications }),
  
  addDevice: (device) => set((state) => ({ 
    devices: [...state.devices, device as Device] 
  })),
  
  updateDevice: (id, data) => set((state) => ({
    devices: state.devices.map(d => d.id === id ? { ...d, ...data } : d)
  })),
  
  updateDeviceFromBackend: (device) => set((state) => ({
    devices: state.devices.map(d => d.id === device.id ? device : d)
  })),
  
  removeDevice: (id) => set((state) => ({
    devices: state.devices.filter(d => d.id !== id)
  })),
  
  addLocation: (name, address) => {
    const id = `loc-${Date.now()}`;
    set((state) => ({ locations: [...state.locations, { id, name, address: address || '' }] }));
    return id;
  },

  updateLocation: (id, name, address) => set((state) => ({
    locations: state.locations.map(l => l.id === id ? { ...l, name, ...(address !== undefined ? { address } : {}) } : l)
  })),
  
  addGroup: (name, locationId) => {
    const id = `grp-${Date.now()}`;
    set((state) => ({ groups: [...state.groups, { id, name, locationId }] }));
    return id;
  },

  updateGroup: (id, name) => set((state) => ({
    groups: state.groups.map(g => g.id === id ? { ...g, name } : g)
  })),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  
  deleteNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));
s