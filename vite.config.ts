import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.crt')),
    },
    port: 5173,
    host: 'localhost',
  },
});
