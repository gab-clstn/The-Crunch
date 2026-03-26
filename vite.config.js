import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { uploadPlugin } from './upload-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    uploadPlugin(),
  ],
})