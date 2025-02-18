import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertClientSchema, insertAppointmentSchema, insertSaleSchema } from "@shared/schema";

// Admin middleware to check if the user has admin privileges
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = 1; // TODO: Get from authenticated session
  const user = await storage.getUser(userId);

  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Unauthorized: Admin access required" });
  }

  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin routes
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get("/api/admin/properties", requireAdmin, async (_req, res) => {
    const properties = await storage.getAllProperties();
    res.json(properties);
  });

  app.get("/api/admin/properties/:userId", requireAdmin, async (req, res) => {
    const properties = await storage.getPropertiesByUser(Number(req.params.userId));
    res.json(properties);
  });

  app.get("/api/admin/clients", requireAdmin, async (_req, res) => {
    const clients = await storage.getAllClients();
    res.json(clients);
  });

  app.get("/api/admin/clients/:userId", requireAdmin, async (req, res) => {
    const clients = await storage.getClientsByUser(Number(req.params.userId));
    res.json(clients);
  });

  app.get("/api/admin/appointments", requireAdmin, async (_req, res) => {
    const appointments = await storage.getAllAppointments();
    res.json(appointments);
  });

  app.get("/api/admin/appointments/:userId", requireAdmin, async (req, res) => {
    const appointments = await storage.getAppointmentsByUser(Number(req.params.userId));
    res.json(appointments);
  });

  app.get("/api/admin/sales", requireAdmin, async (_req, res) => {
    const sales = await storage.getAllSales();
    res.json(sales);
  });

  app.get("/api/admin/sales/:userId", requireAdmin, async (req, res) => {
    const sales = await storage.getSalesByUser(Number(req.params.userId));
    res.json(sales);
  });

  // Regular user routes
  app.get("/api/properties", async (req, res) => {
    const userId = 1; // TODO: Get from authenticated session
    const properties = await storage.getProperties(userId);
    res.json(properties);
  });

  app.post("/api/properties", async (req, res) => {
    const result = insertPropertySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid property data" });
    }
    const userId = 1; // TODO: Get from authenticated session
    const property = await storage.createProperty({ ...result.data, userId });
    res.json(property);
  });

  app.get("/api/clients", async (req, res) => {
    const userId = 1; // TODO: Get from authenticated session
    const clients = await storage.getClients(userId);
    res.json(clients);
  });

  app.post("/api/clients", async (req, res) => {
    const result = insertClientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid client data" });
    }
    const userId = 1; // TODO: Get from authenticated session
    const client = await storage.createClient({ ...result.data, userId });
    res.json(client);
  });

  app.get("/api/appointments", async (req, res) => {
    const userId = 1; // TODO: Get from authenticated session
    const appointments = await storage.getAppointments(userId);
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    const result = insertAppointmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid appointment data" });
    }
    const userId = 1; // TODO: Get from authenticated session
    const appointment = await storage.createAppointment({ ...result.data, userId });
    res.json(appointment);
  });

  app.get("/api/sales", async (req, res) => {
    const userId = 1; // TODO: Get from authenticated session
    const sales = await storage.getSales(userId);
    res.json(sales);
  });

  app.post("/api/sales", async (req, res) => {
    const result = insertSaleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid sale data" });
    }
    const userId = 1; // TODO: Get from authenticated session
    const sale = await storage.createSale({ ...result.data, userId });
    res.json(sale);
  });

  const httpServer = createServer(app);
  return httpServer;
}