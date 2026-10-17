import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": "http://127.0.0.1:8080",
      "/hls": "http://127.0.0.1:8080",
      "/frame": "http://127.0.0.1:8080",
      "/snap": "http://127.0.0.1:8080",
      "/clip": "http://127.0.0.1:8080",
      "/rec": "http://127.0.0.1:8080",
      "/zones": "http://127.0.0.1:8080",
    },
  },
});
