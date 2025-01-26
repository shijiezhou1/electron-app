import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          suspensionWin: resolve(__dirname, 'src/renderer/suspension/index.html'),
          chatWin: resolve(__dirname, 'src/renderer/chat/index.html')
        }
      }
    },
    // resolve: {
    //   alias: {
    //     '@renderer': resolve('src/renderer/src')
    //   }
    // },
    plugins: [react()]
  }
})
