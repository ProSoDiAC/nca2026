import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Relative paths: works on https://<user>.github.io/<repo>/ and on a custom domain.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['icons/favicon.svg', 'icons/apple-touch-icon.png', 'fonts/*.woff2', 'data/*.json'],
      manifest: {
        id: './',
        name: 'NCA 2026 – IEEE Symposium on Network Computing and Applications',
        short_name: 'NCA 2026',
        description: 'Program, sessions and news for NCA 2026, 10–13 November 2026, Siracusa.',
        lang: 'en',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F4F7F8',
        theme_color: '#0A2540',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the app shell, fonts, icons and the JSON data so the app works offline.
        // Each deploy changes the precache revisions, so updated JSON reaches phones on the next open.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,json,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
