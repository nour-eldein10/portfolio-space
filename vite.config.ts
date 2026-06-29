import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      server: {
        entry: "server",
      },
      serverFns: {
        disableCsrfMiddlewareWarning: true,
      },
    }),
    nitro(),
    react(),
    tailwindcss(),
  ],
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    host: true,
    allowedHosts: true,
  },
});
