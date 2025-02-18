import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertClientSchema, insertAppointmentSchema, insertSaleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties
  app.get("/api/properties", async (req, res) => {
    const properties = await storage.getProperties();
    res.json(properties);
  });

  app.post("/api/properties", async (req, res) => {
    const result = insertPropertySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid property data" });
    }
    const property = await storage.createProperty(result.data);
    res.json(property);
  });

  // Clients
  app.get("/api/clients", async (req, res) => {
    const clients = await storage.getClients();
    res.json(clients);
  });

  app.post("/api/clients", async (req, res) => {
    const result = insertClientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid client data" });
    }
    const client = await storage.createClient(result.data);
    res.json(client);
  });

  // Appointments
  app.get("/api/appointments", async (req, res) => {
    const appointments = await storage.getAppointments();
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    const result = insertAppointmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid appointment data" });
    }
    const appointment = await storage.createAppointment(result.data);
    res.json(appointment);
  });

  // Sales
  app.get("/api/sales", async (req, res) => {
    const sales = await storage.getSales();
    res.json(sales);
  });

  app.post("/api/sales", async (req, res) => {
    const result = insertSaleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid sale data" });
    }
    const sale = await storage.createSale(result.data);
    res.json(sale);
  });

  const httpServer = createServer(app);
  return httpServer;
}
