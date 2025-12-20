import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                       // cho phép listen 0.0.0.0
    port: 3000,
    strictPort: false,
    // allowedHosts: [
    //   'nrgmfdfl-3000.asse.devtunnels.ms'  // thêm domain tunnel vào whitelist
    // ],
    // hmr: {
    //   host: 'nrgmfdfl-3000.asse.devtunnels.ms',  // sửa WebSocket cho HMR
    //   protocol: 'wss'
    // },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
