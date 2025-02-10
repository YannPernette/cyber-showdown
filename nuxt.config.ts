// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Charger le fichier .env approprié en fonction de l'environnement
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: resolve(process.cwd(), envFile) });

export default defineNuxtConfig({
  compatibilityDate: "2025-02-10",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],

  runtimeConfig: {
    public: {
      apiTrackingBaseUrl: process.env.NUXT_PUBLIC_API_TRACKING_BASE_URL || "",
    },
  },

  components: [
    { path: "~/components", pathPrefix: false },
    { path: "~/components/icon", pathPrefix: false },
  ],

  css: ["@/assets/scss/main.scss"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          additionalData: `
            @use "@/assets/scss/foundations/functions" as *;
            @use "@/assets/scss/foundations/variables" as *;
            @use "@/assets/scss/foundations/mixins" as *;
          `,
        },
      },
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true, // Active le scan des liens pour trouver les pages à générer
      routes: ["/200.html"], // Ajoute 200.html comme page statique
    },
  },
});
