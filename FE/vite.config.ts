import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist"
  },
  server:{
<<<<<<< HEAD
    port: 5103,
=======
    port: 5173,
>>>>>>> 360aa2a5b40c750785afcbfa1f74051a90f84c69
  }
})
