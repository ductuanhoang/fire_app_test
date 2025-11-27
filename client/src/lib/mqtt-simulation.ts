import { useEffect, useRef } from 'react';
import { useAppStore, Device } from './store';
import { toast } from '@/hooks/use-toast';

// Simulation configuration
const SIMULATION_INTERVAL = 3000; // Update every 3 seconds
const DATA_VARIANCE = 0.05; // 5% variance in readings

export function useMqttSimulation() {
  const { devices, updateDevice, addDevice } = useAppStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start simulation loop
    timerRef.current = setInterval(() => {
      simulateIncomingData();
    }, SIMULATION_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const simulateIncomingData = () => {
    // Pick a random device to update
    const deviceCount = useAppStore.getState().devices.length;
    if (deviceCount === 0) return;

    const randomIndex = Math.floor(Math.random() * deviceCount);
    const device = useAppStore.getState().devices[randomIndex];

    if (!device || device.status === 'offline') return;

    // Simulate sensor readings drift
    const newPressure = varyData(device.pressureLevel, 90, 110);
    const newCo2 = varyData(device.co2Level, 400, 500);
    const newWindSpeed = varyData(device.windSpeed, 0, 15);
    const newBattery = Math.max(0, device.batteryLevel - (Math.random() * 0.1)); // Slowly drain battery

    // Randomly trigger events
    const randomEvent = Math.random();
    
    // 1% chance of warning state
    if (randomEvent > 0.99 && device.status === 'online') {
       updateDevice(device.id, { 
         status: 'warning',
         pressureLevel: newPressure,
         co2Level: newCo2,
         windSpeed: newWindSpeed,
         batteryLevel: newBattery
       });
       
       toast({
         title: "MQTT Alert Received",
         description: `Warning signal received from ${device.name}`,
         variant: "destructive"
       });
    } else {
       // Normal update
       updateDevice(device.id, {
         pressureLevel: newPressure,
         co2Level: newCo2,
         windSpeed: newWindSpeed,
         batteryLevel: newBattery
       });
    }
    
    console.log(`[MQTT-SIM] Received update for ${device.id}: Pressure=${newPressure.toFixed(1)}, CO2=${newCo2.toFixed(0)}`);
  };

  // Helper to vary data slightly
  const varyData = (current: number, min: number, max: number) => {
    const change = current * DATA_VARIANCE * (Math.random() - 0.5);
    let newValue = current + change;
    // Keep within bounds if specified
    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);
    return Number(newValue.toFixed(1));
  };

  return { isConnected: true };
}
