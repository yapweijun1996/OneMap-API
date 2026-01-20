import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            index: path.resolve(__dirname, 'index.html'),
            app: path.resolve(__dirname, 'app.html'),
            demoIndex: path.resolve(__dirname, 'demo/index.html'),
            demoAuthToken: path.resolve(__dirname, 'demo/auth-token.html'),
            demoSearch: path.resolve(__dirname, 'demo/search.html'),
            demoReverseGeocode: path.resolve(__dirname, 'demo/reverse-geocode.html'),
            demoReverseGeocodeEngineer: path.resolve(__dirname, 'demo/reverse-geocode-engineer.html'),
            demoRouting: path.resolve(__dirname, 'demo/routing.html'),
            demoPublicTransportRouting: path.resolve(__dirname, 'demo/public-transport-routing.html'),
            demoNearbyTransport: path.resolve(__dirname, 'demo/nearby-transport.html'),
            demoThemes: path.resolve(__dirname, 'demo/themes.html'),
            demoPlanningArea2024: path.resolve(__dirname, 'demo/planning-area-2024.html'),
            demoPopulationQuery: path.resolve(__dirname, 'demo/population-query.html'),
            demoStaticMap: path.resolve(__dirname, 'demo/static-map.html'),
            demoConvert4326to3414: path.resolve(__dirname, 'demo/convert-4326-to-3414.html'),
            demoBasemapTiles: path.resolve(__dirname, 'demo/basemap-tiles.html'),
            demoMinimap: path.resolve(__dirname, 'demo/minimap.html'),
          },
        },
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
