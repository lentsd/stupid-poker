import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Дурацкий Покер',
        short_name: 'Покер',
        description: 'Правила и раздачи для настольной игры Дурацкий Покер',
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#12121a',
        theme_color: '#12121a',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
});
