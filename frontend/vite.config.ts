import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolveApiUrl } from './src/services/apiUrl';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  resolveApiUrl(env.VITE_API_URL, command === 'build');
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            charts: ["recharts"],
            icons: ["lucide-react"],
          },
        },
      },
    },
  };
});
