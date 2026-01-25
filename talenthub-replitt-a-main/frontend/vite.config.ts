import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      "/api": {
        // Use Docker service name when in Docker, localhost when running locally
        // Check if we're in Docker by checking if backend hostname resolves
        target: process.env.DOCKER === 'true' || process.env.VITE_USE_DOCKER === 'true' 
          ? "http://backend:8000" 
          : "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        timeout: 10000, // 10 second timeout
        configure: (proxy, _options) => {
          const target = process.env.DOCKER === 'true' || process.env.VITE_USE_DOCKER === 'true'
            ? "http://backend:8000"
            : "http://localhost:8000";
          console.log(`🔄 [PROXY] Configured to proxy /api → ${target}`);
          console.log(`🔄 [PROXY] DOCKER env: ${process.env.DOCKER}, VITE_USE_DOCKER: ${process.env.VITE_USE_DOCKER}`);
          
          proxy.on('error', (err, req, res) => {
            console.error('❌ [PROXY] Proxy error:', err.message);
            console.error('❌ [PROXY] Proxy error details:', err);
            console.error('❌ [PROXY] Request URL:', req.url);
            console.error('❌ [PROXY] Target was:', target);
            
            // If backend hostname doesn't resolve, suggest using localhost
            if (err.message.includes('getaddrinfo ENOTFOUND backend') || err.code === 'ENOTFOUND') {
              console.error('💡 [PROXY] Tip: Backend hostname not found. If running locally, ensure backend is on localhost:8000');
            }
            
            if (res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Proxy error', 
                message: err.message,
                hint: 'Check if backend is running on ' + target
              }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔄 [PROXY] Request:', req.method, req.url, '→', target + proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ [PROXY] Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});

