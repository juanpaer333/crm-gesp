import { users, type User, type InsertUser, type Property, type InsertProperty, type Client, type InsertClient, type Appointment, type InsertAppointment, type Sale, type InsertSale } from "@shared/schema";

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

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseId(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.getNextId();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Properties methods
  async getProperties(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId
    );
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId
    );
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.getNextId();
    const newProperty: Property = { 
      ...property, 
      id,
      createdAt: new Date()
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  // Clients methods
  async getClients(userId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.userId === userId
    );
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClientsByUser(userId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.userId === userId
    );
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.getNextId();
    const newClient: Client = {
      ...client,
      id,
      createdAt: new Date()
    };
    this.clients.set(id, newClient);
    return newClient;
  }

  // Appointments methods
  async getAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId
    );
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByUser(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId
    );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.getNextId();
    const newAppointment: Appointment = {
      ...appointment,
      id,
      createdAt: new Date()
    };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  // Sales methods
  async getSales(userId: number): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.userId === userId
    );
  }

  async getAllSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSalesByUser(userId: number): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.userId === userId
    );
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const id = this.getNextId();
    const newSale: Sale = {
      ...sale,
      id,
      createdAt: new Date()
    };
    this.sales.set(id, newSale);
    return newSale;
  }
}

export const storage = new MemStorage();