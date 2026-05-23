import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Hardcode Supabase env vars for now (these are public keys, safe to expose)
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://neatmnfrlysqoikgbsde.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lYXRtbmZybHlzcW9pa2dic2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTkxMDksImV4cCI6MjA2MzU3NTEwOX0.audJHPVS2q1MplOLG2560zAwgFUChsZRzPKDXefVfKs'),
  },
})
