import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/leaguetrackerfpl",

  // API proxy
  server: {
    proxy: {
      '/fixtures': {
        target: 'https://fantasy.premierleague.com/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/fixtures/, '/fixtures/'),
      },
      '/bootstrap-static': {
        target: 'https://fantasy.premierleague.com/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/bootstrap-static/, '/bootstrap-static/'),
      },
    },
  },
})
