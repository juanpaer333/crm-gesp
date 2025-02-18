import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertClientSchema, insertAppointmentSchema, insertSaleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties
  app.get("/api/properties", async (req, res) => {
    // TODO: Get userId from authenticated session
    const userId = 1; // Temporary, will be replaced with actual user ID
    const properties = await storage.getProperties(userId);
    res.json(properties);
  });

  app.post("/api/properties", async (req, res) => {
    const result = insertPropertySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid property data" });
    }
    // TODO: Get userId from authenticated session
    const userId = 1; // Temporary, will be replaced with actual user ID
    const property = await storage.createProperty({ ...result.data, userId });
    res.json(property);
  });

  // Clients
  app.get("/api/clients", async (req, res) => {
    // TODO: Get userId from authenticated session
    const userId = 1; // Temporary, will be replaced with actual user ID
    const clients = await storage.getClients(userId);
    res.json(clients);
  });

  app.post("/api/clients", async (req, res) => {
    const result = insertClientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid client data" });
    }
    // TODO: Get userId from authenticated session
    const userId = 1; // Temporary, will be replaced with actual user ID
    const client = await storage.createClient({ ...result.data, userId });
    res.json(client);
  });

  // Appointments
  app.get("/api/appointments", async (req, res) => {
    // TODO: Get userId from authenticated session
    const userId = 1; // Temporary, will be replaced with actual user ID
    const appointments = await storage.getAppointments(userId);
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    const result = insertAppointmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid appointment data" });
    }
    // TODO: Get userId from authenticated session
    const userId = 1; // Temporary, will be replaced with actual user ID
    const appointment = await storage.createAppointment({ ...result.data, userId });
    res.json(appointment);
  });

  // Sales
  app.get("/api/sales", async (req, res) => {
    // TODO: Get userId from authenticated session
    const userId = 1; // Temporary, will be replaced with actual user ID
    const sales = await storage.getSales(userId);
    res.json(sales);
  });

  app.post("/api/sales", async (req, res) => {
    const result = insertSaleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid sale data" });
    }
    // TODO: Get userId from authenticated session
    const userId = 1; // Temporary, will be replaced with actual user ID
    const sale = await storage.createSale({ ...result.data, userId });
    res.json(sale);
  });

  const httpServer = createServer(app);
  return httpServer;
}