import { users, type User, type InsertUser, type Property, type InsertProperty, type Client, type InsertClient, type Appointment, type InsertAppointment, type Sale, type InsertSale } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Properties methods
  getProperties(userId: number): Promise<Property[]>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByUser(userId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;

  // Clients methods
  getClients(userId: number): Promise<Client[]>;
  getAllClients(): Promise<Client[]>;
  getClientsByUser(userId: number): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;

  // Appointments methods
  getAppointments(userId: number): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByUser(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;

  // Sales methods
  getSales(userId: number): Promise<Sale[]>;
  getAllSales(): Promise<Sale[]>;
  getSalesByUser(userId: number): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByFirebaseId(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Properties methods
  async getProperties(userId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.userId, userId));
  }

  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties);
  }

  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.userId, userId));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  // Clients methods
  async getClients(userId: number): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId));
  }

  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClientsByUser(userId: number): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId));
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  // Appointments methods
  async getAppointments(userId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.userId, userId));
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointmentsByUser(userId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.userId, userId));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  // Sales methods
  async getSales(userId: number): Promise<Sale[]> {
    return await db.select().from(sales).where(eq(sales.userId, userId));
  }

  async getAllSales(): Promise<Sale[]> {
    return await db.select().from(sales);
  }

  async getSalesByUser(userId: number): Promise<Sale[]> {
    return await db.select().from(sales).where(eq(sales.userId, userId));
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const [newSale] = await db.insert(sales).values(sale).returning();
    return newSale;
  }
}

export const storage = new DatabaseStorage();