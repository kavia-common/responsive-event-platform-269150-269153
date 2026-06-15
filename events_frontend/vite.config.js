import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// PUBLIC_INTERFACE
export default defineConfig({
  /** Vite configuration for events_frontend (React SPA). */
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0"
  },
  preview: {
    port: 3000,
    host: "0.0.0.0"
  }
});
