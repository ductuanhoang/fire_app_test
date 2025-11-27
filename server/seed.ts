import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  try {
    // Create locations
    const loc1 = await storage.createLocation({
      name: "Home",
      address: "123 Tech Blvd",
    });

    const loc2 = await storage.createLocation({
      name: "Warehouse A",
      address: "456 Industry Rd",
    });

    console.log("Created locations");

    // Create groups
    const grp1 = await storage.createGroup({
      name: "Back Yard",
      locationId: loc1.id,
    });

    const grp2 = await storage.createGroup({
      name: "Loading Dock",
      locationId: loc2.id,
    });

    const grp3 = await storage.createGroup({
      name: "Front Yard",
      locationId: loc1.id,
    });

    console.log("Created groups");

    // Create devices
    await storage.createDevice({
      name: "Turret Alpha",
      serialNumber: "FD-500-8849-XJ",
      groupId: grp1.id,
      locationId: loc1.id,
      status: "online",
      mode: "automatic",
      fireStatus: "safe",
      batteryLevel: 98,
      pressureLevel: 100,
      co2Level: 412,
      particulateMatter: 12,
      windSpeed: 8.5,
      windDirection: 45,
      height: 12,
      lastMaintenance: "2023-10-15",
      x: 50,
      y: 50,
      awsThingName: "turret-alpha",
    });

    await storage.createDevice({
      name: "Turret Beta",
      serialNumber: "FD-500-9921-AB",
      groupId: grp1.id,
      locationId: loc1.id,
      status: "warning",
      mode: "manual",
      fireStatus: "safe",
      batteryLevel: 45,
      pressureLevel: 92,
      co2Level: 800,
      particulateMatter: 35,
      windSpeed: 12.2,
      windDirection: 180,
      height: 8,
      lastMaintenance: "2023-09-20",
      x: 30,
      y: 60,
      awsThingName: "turret-beta",
    });

    await storage.createDevice({
      name: "Dock Sentry",
      serialNumber: "FD-500-7732-ZZ",
      groupId: grp2.id,
      locationId: loc2.id,
      status: "offline",
      mode: "automatic",
      fireStatus: "safe",
      batteryLevel: 0,
      pressureLevel: 0,
      co2Level: 0,
      particulateMatter: 0,
      windSpeed: 0,
      windDirection: 0,
      height: 15,
      lastMaintenance: "2023-01-10",
      x: 70,
      y: 20,
      awsThingName: "dock-sentry",
    });

    await storage.createDevice({
      name: "South Perimeter",
      serialNumber: "FD-500-4452-KL",
      groupId: grp2.id,
      locationId: loc2.id,
      status: "pre-soaking",
      mode: "automatic",
      fireStatus: "safe",
      batteryLevel: 88,
      pressureLevel: 95,
      co2Level: 450,
      particulateMatter: 18,
      windSpeed: 5.2,
      windDirection: 270,
      height: 20,
      lastMaintenance: "2023-11-05",
      x: 20,
      y: 80,
      awsThingName: "south-perimeter",
    });

    await storage.createDevice({
      name: "West Hallway",
      serialNumber: "FD-500-1123-EM",
      groupId: grp3.id,
      locationId: loc1.id,
      status: "emergency",
      mode: "manual",
      fireStatus: "warning",
      batteryLevel: 92,
      pressureLevel: 85,
      co2Level: 1200,
      particulateMatter: 150,
      windSpeed: 0,
      windDirection: 0,
      height: 10,
      lastMaintenance: "2023-12-01",
      x: 85,
      y: 40,
      awsThingName: "west-hallway",
    });

    console.log("Created devices");

    // Create some notifications
    const devices = await storage.getAllDevices();
    
    await storage.createNotification({
      type: "warning",
      title: "Low Battery Warning",
      message: "Turret Beta is at 45% battery.",
      deviceId: devices[1].id,
      read: false,
    });

    await storage.createNotification({
      type: "info",
      title: "Maintenance Completed",
      message: "Routine check finished for Turret Alpha.",
      deviceId: devices[0].id,
      read: true,
    });

    await storage.createNotification({
      type: "emergency",
      title: "Connection Lost",
      message: "Dock Sentry has gone offline.",
      deviceId: devices[2].id,
      read: false,
    });

    console.log("Created notifications");
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
