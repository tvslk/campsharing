import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'package.json', dest: '' },
        { src: 'server.js', dest: '' }, // Optional: Include if you have a server.js file
      ],
    }),
  ],
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Specify the output directory
  },
});