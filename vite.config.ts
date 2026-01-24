import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "https://dev.api.aiwohealth.yaacreations.com",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
            '^/(login|register|token|countries|states|auth|refresh-token|profile|users|forgot-password|logout|change-password|refresh|public/register)': {
                target: 'https://auth.aiwohealth.com/api/auth',
                changeOrigin: true,
                secure: false,
                bypass: (req: any) => {
                    if (req.headers.accept?.includes("text/html")) {
                        return "/index.html";
                    }
                },
            },

            "/labs": {
                target: "https://labsapi.aiwohealth.com",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/labs/, ""),
            },
        },
    },
})
