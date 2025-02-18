import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  firebaseUid: text("firebase_uid").notNull().unique(),
  isAdmin: boolean("is_admin").notNull().default(false)
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  address: text("address").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: integer("area").notNull(),
  status: text("status").notNull(), // available, sold, rented
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  budget: integer("budget"),
  propertyType: text("property_type"), // apartment, house, commercial
  status: text("status").notNull(), // active, inactive
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  propertyId: integer("property_id").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // scheduled, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  clientId: integer("client_id").notNull(),
  amount: integer("amount").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // pending, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true, createdAt: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true });
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Sale = typeof sales.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;