// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5150,
  },
  // --- Tambahkan bagian 'build' ini ---
  build: {
    minify: "terser", // Memastikan Terser digunakan sebagai minifier
    terserOptions: {
      compress: {
        drop_console: true, // Ini yang akan menghapus console.log di build produksi
        drop_debugger: true, // (Opsional) Ini akan menghapus debugger statement
      },
    },
  },
  // ------------------------------------
});
