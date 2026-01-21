import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
            '^/(login|register|token|countries|states|auth|refresh-token|profile|users|forgot-password|logout|change-password|refresh|public/register)': {
                target: 'https://auth.aiwohealth.com/api/auth',
                changeOrigin: true,
                bypass: (req: any) => {
                    if (req.headers.accept?.includes("text/html")) {
                        return "/index.html";
                    }
                },
            },

            "/labs": {
                target: "https://labsapi.aiwohealth.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/labs/, ""),
            },
        },
    },
})
