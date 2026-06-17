import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// On `build`, `base` must match the repo name so assets resolve on GitHub Pages
// (served from https://<user>.github.io/calculator/). Dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/calculator/' : '/',
  plugins: [react()],
}))
