import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'
import keystatic from '@keystatic/astro'
import { spawn } from 'node:child_process'
import { normaliseFile } from './tools/normalise-markdoc-tables.mjs'

// Keystatic's admin UI needs a server at runtime, and GitHub Pages is static-only.
// So: the CMS runs in DEV (npm run edit -> localhost:4321/keystatic). It saves to the files
// on disk only — nothing is committed or published until `npm run deploy` builds docs/ and
// pushes it, and docs/ is what Pages serves.
const dev = process.env.NODE_ENV !== 'production'

// Dev only: keep what the dev server shows in step with what a build would make.
//  - A page saved from Keystatic gets its {% table %} blocks rewritten as GFM tables at
//    once (tools/normalise-markdoc-tables.mjs), instead of rendering as bullet lists
//    until the next restart.
//  - A render or image added to public/ gets its /opt derivatives (tools/optimise-images.mjs),
//    which every card and poster links to, instead of a broken image until the next build.
let optimiseTimer
const devSync = {
  name: 'dev-sync',
  hooks: {
    'astro:server:setup': ({ server }) => {
      const onFile = (file) => {
        if (/[\\/]src[\\/]content[\\/].+\.md$/.test(file)) normaliseFile(file)
        if (/[\\/]public[\\/](renders|images)[\\/][^\\/]+\.(png|jpe?g)$/i.test(file)) {
          clearTimeout(optimiseTimer)
          optimiseTimer = setTimeout(() => {
            spawn('node', ['tools/optimise-images.mjs'], { stdio: 'inherit' })
          }, 500)
        }
      }
      server.watcher.on('change', onFile)
      server.watcher.on('add', onFile)
    },
  },
}

// NOTE: output stays 'static' even in dev. Setting output:'server' makes Astro ignore
// getStaticPaths on dynamic routes, so /modules/[slug] gets no props and render() blows
// up — dev must match the build. Keystatic's own routes opt into on-demand rendering
// themselves (prerender:false), which the adapter below serves.
export default defineConfig({
  site: 'https://eight4awish.com',
  outDir: './docs',
  integrations: dev ? [react(), keystatic(), devSync] : [],
  ...(dev ? { adapter: node({ mode: 'standalone' }) } : {}),
})
