import { 
  type User, 
  type InsertUser,
  type Location,
  type InsertLocation,
  type Group,
  type InsertGroup,
  type Device,
  type InsertDevice,
  type Notification,
  type InsertNotification,
  users,
  locations,
  groups,
  devices,
  notifications
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { eq, and, desc } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Locations
  getAllLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, data: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: string): Promise<boolean>;
  
  // Groups
  getAllGroups(): Promise<Group[]>;
  getGroupsByLocation(locationId: string): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: string, data: Partial<InsertGroup>): Promise<Group | undefined>;
  deleteGroup(id: string): Promise<boolean>;
  
  // Devices
  getAllDevices(): Promise<Device[]>;
  getDevicesByGroup(groupId: string): Promise<Device[]>;
  getDevicesByLocation(locationId: string): Promise<Device[]>;
  getDevice(id: string): Promise<Device | undefined>;
  getDeviceBySerialNumber(serialNumber: string): Promise<Device | undefined>;
  getDeviceByAwsThingName(thingName: string): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: string, data: Partial<InsertDevice>): Promise<Device | undefined>;
  deleteDevice(id: string): Promise<boolean>;
  
  // Notifications
  getAllNotifications(): Promise<Notification[]>;
  getUnreadNotifications(): Promise<Notification[]>;
  getNotification(id: string): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<boolean>;
  deleteNotification(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Locations
  async getAllLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getLocation(id: string): Promise<Location | undefined> {
    const result = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    return result[0];
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const result = await db.insert(locations).values(location).returning();
    return result[0];
  }

  async updateLocation(id: string, data: Partial<InsertLocation>): Promise<Location | undefined> {
    const result = await db.update(locations).set(data).where(eq(locations.id, id)).returning();
    return result[0];
  }

  async deleteLocation(id: string): Promise<boolean> {
    const result = await db.delete(locations).where(eq(locations.id, id)).returning();
    return result.length > 0;
  }

  // Groups
  async getAllGroups(): Promise<Group[]> {
    return await db.select().from(groups);
  }

  async getGroupsByLocation(locationId: string): Promise<Group[]> {
    return await db.select().from(groups).where(eq(groups.locationId, locationId));
  }

  async getGroup(id: string): Promise<Group | undefined> {
    const result = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
    return result[0];
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const result = await db.insert(groups).values(group).returning();
    return result[0];
  }

  async updateGroup(id: string, data: Partial<InsertGroup>): Promise<Group | undefined> {
    const result = await db.update(groups).set(data).where(eq(groups.id, id)).returning();
    return result[0];
  }

  async deleteGroup(id: string): Promise<boolean> {
    const result = await db.delete(groups).where(eq(groups.id, id)).returning();
    return result.length > 0;
  }

  // Devices
  async getAllDevices(): Promise<Device[]> {
    return await db.select().from(devices);
  }

  async getDevicesByGroup(groupId: string): Promise<Device[]> {
    return await db.select().from(devices).where(eq(devices.groupId, groupId));
  }

  async getDevicesByLocation(locationId: string): Promise<Device[]> {
    return await db.select().from(devices).where(eq(devices.locationId, locationId));
  }

  async getDevice(id: string): Promise<Device | undefined> {
    const result = await db.select().from(devices).where(eq(devices.id, id)).limit(1);
    return result[0];
  }

  async getDeviceBySerialNumber(serialNumber: string): Promise<Device | undefined> {
    const result = await db.select().from(devices).where(eq(devices.serialNumber, serialNumber)).limit(1);
    return result[0];
  }

  async getDeviceByAwsThingName(thingName: string): Promise<Device | undefined> {
    if (!thingName) return undefined;
    const result = await db.select().from(devices).where(eq(devices.awsThingName, thingName)).limit(1);
    return result[0];
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const result = await db.insert(devices).values(device).returning();
    return result[0];
  }

  async updateDevice(id: string, data: Partial<InsertDevice>): Promise<Device | undefined> {
    const result = await db.update(devices).set(data).where(eq(devices.id, id)).returning();
    return result[0];
  }

  async deleteDevice(id: string): Promise<boolean> {
    const result = await db.delete(devices).where(eq(devices.id, id)).returning();
    return result.length > 0;
  }

  // Notifications
  async getAllNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications).orderBy(desc(notifications.timestamp));
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.read, false))
      .orderBy(desc(notifications.timestamp));
  }

  async getNotification(id: string): Promise<Notification | undefined> {
    const result = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result[0];
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return result.length > 0;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await db.delete(notifications).where(eq(notifications.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
