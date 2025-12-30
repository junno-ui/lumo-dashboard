// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import ui from "@nuxt/ui/vite";
import vueDevTools from 'vite-plugin-vue-devtools'

import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [vue(), tailwindcss(), ui(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
