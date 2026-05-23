import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env from the shared directory
  const env = loadEnv(mode, '/vercel/share', '')
  
  return {
    plugins: [react()],
    define: {
      // Expose Supabase env vars to the client with VITE_ prefix
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
  }
})
