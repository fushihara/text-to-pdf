import { resolve } from "node:path";
import { defineConfig ,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
const env = loadEnv("",process.cwd(),"")
const BASE_DIR = (() => {
  let dir = String(env.BASE_DIR ?? "/").trim();
  if (dir == "") {
    dir = "/";
  }
  if (dir.startsWith("/") && dir.endsWith("/")) {
    return dir;
  }
  throw new Error(`BASE_DIRは空文字かスラッシュで囲う必要があります`)
})();
console.log(`BASE_DIR:[${BASE_DIR}]`);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: BASE_DIR,
  root: resolve(__dirname, "src/pages"),
  // root基準
  publicDir: "./public-dir",
  preview: {
    host: true,
    port: 52767,
  },
  build: {
    assetsInlineLimit: 1 * 1024,
    emptyOutDir: true,
    target: "esnext",
    outDir: resolve(__dirname, ".vite-output-dir"),
    rollupOptions: {
      input: {
        "main": resolve(__dirname, "src/pages/index.html"),
      },
      output: {
        entryFileNames: "entry-[name]-[hash].js",
        assetFileNames: "assets-[name]-[hash].[ext]",
        chunkFileNames: "chunks-[name].js",
      }
    },
  }
})
