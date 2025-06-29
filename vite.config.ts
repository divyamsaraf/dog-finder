import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import UnusedFiles from 'vite-plugin-unused-files';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're in development mode
const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  plugins: [react(),
    // @ts-ignore
    UnusedFiles({
      include: ['src/**/*.{ts,tsx,js,jsx,css,svg,json}'],
    }),
  ],
  server: {
    // Only use HTTPS in development
    ...(isDev ? {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.crt')),
      },
    } : {}),
    port: 5173,
    host: 'localhost',
  },
  // Add base path configuration for production
  base: '/',
});
