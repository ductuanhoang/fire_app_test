import { useEffect } from 'react';
import { useAppStore } from './store';
import { deviceApi, locationApi, groupApi, notificationApi } from './api';

export function useDataLoader() {
  const { setDevices, setLocations, setGroups, setNotifications, isAuthenticated } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;

    async function loadData() {
      try {
        const [devices, locations, groups, notifications] = await Promise.all([
          deviceApi.getAll(),
          locationApi.getAll(),
          groupApi.getAll(),
          notificationApi.getAll(),
        ]);

        if (mounted) {
          setDevices(devices);
          setLocations(locations);
          setGroups(groups);
          setNotifications(notifications);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);
}
