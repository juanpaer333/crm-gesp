import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/crm-gesp/",
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
