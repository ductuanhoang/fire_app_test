import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address"),
});

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  locationId: varchar("location_id").notNull().references(() => locations.id, { onDelete: 'cascade' }),
});

export const devices = pgTable("devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: 'cascade' }),
  locationId: varchar("location_id").notNull().references(() => locations.id, { onDelete: 'cascade' }),
  status: text("status").notNull().default('offline'),
  mode: text("mode").notNull().default('automatic'),
  fireStatus: text("fire_status").notNull().default('safe'),
  batteryLevel: doublePrecision("battery_level").notNull().default(0),
  pressureLevel: doublePrecision("pressure_level").notNull().default(0),
  co2Level: doublePrecision("co2_level").notNull().default(0),
  particulateMatter: doublePrecision("particulate_matter").notNull().default(0),
  windSpeed: doublePrecision("wind_speed").notNull().default(0),
  windDirection: doublePrecision("wind_direction").notNull().default(0),
  height: doublePrecision("height").notNull().default(0),
  lastMaintenance: text("last_maintenance"),
  x: doublePrecision("x"),
  y: doublePrecision("y"),
  awsThingName: text("aws_thing_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  deviceId: varchar("device_id").references(() => devices.id, { onDelete: 'cascade' }),
  read: boolean("read").notNull().default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export const insertGroupSchema = createInsertSchema(groups).omit({ id: true });
export const insertDeviceSchema = createInsertSchema(devices).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, timestamp: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
