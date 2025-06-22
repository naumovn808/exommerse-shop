import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // URL вашего бэкенда
        changeOrigin: true, // Изменяет заголовок origin на target URL
        secure: false, // Отключает проверку SSL (для локальной разработки)
      },
    },
  },
});