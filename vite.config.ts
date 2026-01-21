import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [path.resolve(__dirname, 'design-system/scss/abstracts')]
      }
    }
  },
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    include: ['grpc-web', 'google-protobuf'],
    esbuildOptions: {
      mainFields: ['module', 'main']
    }
  },
  resolve: {
    alias: {
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
