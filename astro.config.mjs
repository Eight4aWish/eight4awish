import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'
import keystatic from '@keystatic/astro'

// Keystatic's admin UI needs a server at runtime, and GitHub Pages is static-only.
// So: the CMS runs in DEV (npm run edit -> localhost:4321/keystatic, saves commit to git),
// and the production build is plain static HTML into docs/, which is what Pages serves.
const dev = process.env.NODE_ENV !== 'production'

// NOTE: output stays 'static' even in dev. Setting output:'server' makes Astro ignore
// getStaticPaths on dynamic routes, so /modules/[slug] gets no props and render() blows
// up — dev must match the build. Keystatic's own routes opt into on-demand rendering
// themselves (prerender:false), which the adapter below serves.
export default defineConfig({
  site: 'https://eight4awish.com',
  outDir: './docs',
  integrations: dev ? [react(), keystatic()] : [],
  ...(dev ? { adapter: node({ mode: 'standalone' }) } : {}),
})
