import { users, type User, type InsertUser, type Property, type InsertProperty, type Client, type InsertClient, type Appointment, type InsertAppointment, type Sale, type InsertSale } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProperties(userId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  getClients(userId: number): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  getAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getSales(userId: number): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private clients: Map<number, Client>;
  private appointments: Map<number, Appointment>;
  private sales: Map<number, Sale>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.clients = new Map();
    this.appointments = new Map();
    this.sales = new Map();
    this.currentId = 1;
  }

  private getNextId(): number {
    return this.currentId++;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.getNextId();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProperties(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId
    );
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.getNextId();
    const newProperty: Property = { ...property, id };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async getClients(userId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.userId === userId
    );
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.getNextId();
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId
    );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.getNextId();
    const newAppointment: Appointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async getSales(userId: number): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.userId === userId
    );
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const id = this.getNextId();
    const newSale: Sale = { ...sale, id };
    this.sales.set(id, newSale);
    return newSale;
  }
}

export const storage = new MemStorage();