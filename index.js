// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  properties;
  clients;
  appointments;
  sales;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.properties = /* @__PURE__ */ new Map();
    this.clients = /* @__PURE__ */ new Map();
    this.appointments = /* @__PURE__ */ new Map();
    this.sales = /* @__PURE__ */ new Map();
    this.currentId = 1;
  }
  getNextId() {
    return this.currentId++;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.getNextId();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getProperties(userId) {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId
    );
  }
  async createProperty(property) {
    const id = this.getNextId();
    const newProperty = { ...property, id };
    this.properties.set(id, newProperty);
    return newProperty;
  }
  async getClients(userId) {
    return Array.from(this.clients.values()).filter(
      (client) => client.userId === userId
    );
  }
  async createClient(client) {
    const id = this.getNextId();
    const newClient = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }
  async getAppointments(userId) {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId
    );
  }
  async createAppointment(appointment) {
    const id = this.getNextId();
    const newAppointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }
  async getSales(userId) {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.userId === userId
    );
  }
  async createSale(sale) {
    const id = this.getNextId();
    const newSale = { ...sale, id };
    this.sales.set(id, newSale);
    return newSale;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  photoUrl: text("photo_url")
});
var properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  address: text("address").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: integer("area").notNull(),
  status: text("status").notNull(),
  // available, sold, rented
  createdAt: timestamp("created_at").defaultNow()
});
var clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  budget: integer("budget"),
  propertyType: text("property_type"),
  // apartment, house, commercial
  status: text("status").notNull(),
  // active, inactive
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  propertyId: integer("property_id").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(),
  // scheduled, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  clientId: integer("client_id").notNull(),
  amount: integer("amount").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(),
  // pending, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users);
var insertPropertySchema = createInsertSchema(properties);
var insertClientSchema = createInsertSchema(clients);
var insertAppointmentSchema = createInsertSchema(appointments);
var insertSaleSchema = createInsertSchema(sales);

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/properties", async (req, res) => {
    const userId = 1;
    const properties2 = await storage.getProperties(userId);
    res.json(properties2);
  });
  app2.post("/api/properties", async (req, res) => {
    const result = insertPropertySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid property data" });
    }
    const userId = 1;
    const property = await storage.createProperty({ ...result.data, userId });
    res.json(property);
  });
  app2.get("/api/clients", async (req, res) => {
    const userId = 1;
    const clients2 = await storage.getClients(userId);
    res.json(clients2);
  });
  app2.post("/api/clients", async (req, res) => {
    const result = insertClientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid client data" });
    }
    const userId = 1;
    const client = await storage.createClient({ ...result.data, userId });
    res.json(client);
  });
  app2.get("/api/appointments", async (req, res) => {
    const userId = 1;
    const appointments2 = await storage.getAppointments(userId);
    res.json(appointments2);
  });
  app2.post("/api/appointments", async (req, res) => {
    const result = insertAppointmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid appointment data" });
    }
    const userId = 1;
    const appointment = await storage.createAppointment({ ...result.data, userId });
    res.json(appointment);
  });
  app2.get("/api/sales", async (req, res) => {
    const userId = 1;
    const sales2 = await storage.getSales(userId);
    res.json(sales2);
  });
  app2.post("/api/sales", async (req, res) => {
    const result = insertSaleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid sale data" });
    }
    const userId = 1;
    const sale = await storage.createSale({ ...result.data, userId });
    res.json(sale);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2, resolve } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  base: "/crm-gesp/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    app2.use(express.static(resolve(__dirname2, "../client/dist")));
    app2.get("*", (req, res) => {
      res.sendFile(resolve(__dirname2, "../client/dist/index.html"));
    });
    return;
  }
  const vite = await import("vite");
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, overlay: true },
    allowedHosts: true
  };
  const viteServer = await vite.createServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(viteServer.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      viteServer.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import fetch from "node-fetch";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.get("/api/properties-data", async (req, res) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyCCvJqBFvVQ43DcDdQPZdHgRQG2eTjCkA9GQ_WtiILmjPmhzOpvBuARecEP4fE4IUtiw/exec",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Received non-JSON response:", await response.text());
      throw new Error("Response was not JSON");
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      error: "Failed to fetch properties data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = 3e3;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
