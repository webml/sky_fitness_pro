// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/test-utils", "@nuxt/image", "@pinia/nuxt"],
  css: ["@/assets/styles/main.css", "@/assets/styles/reset.css"],
  vite: {
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./app", import.meta.url)),
        "@": fileURLToPath(new URL("./app", import.meta.url)),
      },
    },
  },
  imports: {
    autoImport: true,
  },
});
