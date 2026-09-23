import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'どーぱ計算ゲーム',
        short_name: 'どーぱ計算',
        description: '小学1年生向け　足し算・引き算ゲーム',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      // Service Worker の設定
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        // オフライン時も起動できるようナビゲーションをキャッシュ
        navigateFallback: 'index.html',
      },
    }),
  ],
})
