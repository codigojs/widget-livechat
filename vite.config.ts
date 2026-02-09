import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dotenv from "dotenv";
// import fs from 'fs'

// Cargar variables de entorno desde .env
dotenv.config();

// Obtener la URL base desde las variables de entorno
const BASE_URL = process.env.VITE_BASE_URL || "/";

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin(
    {
      jsAssetsFilterFunction: (chunk) => chunk.fileName === 'assets/js/widget.js',
      cssAssetsFilterFunction: function customCssAssetsFilterFunction(outputAsset) {
        return outputAsset.fileName === 'assets/css/widget.css';
      }
    }
  )],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        widget: "./src/Widget.tsx",
        iframe: "./src/WidgetIframe.tsx"
      },
      output: {
        entryFileNames: (assetInfo) => {
          return assetInfo.name === "widget"
            ? "assets/js/[name].js"
            : "assets/[name].js";
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return "assets/css/[name].css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
  experimental: {
    renderBuiltUrl(filename: string) {
      return `${BASE_URL}${filename}`;
    },
  },
});
