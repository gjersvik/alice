import type { UserConfig } from 'vite'

export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
} satisfies UserConfig