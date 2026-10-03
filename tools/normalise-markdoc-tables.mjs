// Keystatic's table button writes Markdoc syntax ({% table %} … {% /table %}), but the
// content collections are rendered by Astro's plain-markdown pipeline, which has no idea
// what that is — so the tag leaks onto the page as literal text and the cells come out as
// a bullet list. This rewrites any such block into a GFM table, which both renderers
// understand and which Keystatic reads back happily.
//
// Runs on prebuild and on predev/preedit, and — while the dev server is up — on every save
// (astro.config.mjs watches src/content and calls normaliseFile), so a table typed in the
// CMS shows as a table on the dev server straight away rather than after a restart.

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = new URL('../src/content', import.meta.url).pathname

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : []
})

// Cells are `- value` lines; `---` separates rows. First row is the header.
const toGfm = (block) => {
  const rows = block
    .split('\n---\n')
    .map((r) => r.split('\n').filter((l) => l.trimStart().startsWith('- '))
                 .map((l) => l.trimStart().slice(2).trim()))
    .filter((r) => r.length)
  if (rows.length < 2) return null
  const [head, ...body] = rows
  if (body.some((r) => r.length !== head.length)) return null
  return [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...body.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n')
}

const TABLE = /\{%\s*table\s*%\}\n([\s\S]*?)\n\{%\s*\/table\s*%\}/g

// One file. Returns true if it rewrote it. Writing only on a real change matters: the dev
// watcher calls this on every save, and its own write is a save too.
export const normaliseFile = (file) => {
  const src = readFileSync(file, 'utf8')
  if (!src.includes('{% table %}')) return false
  const out = src.replace(TABLE, (whole, inner) => toGfm(inner) ?? whole)
  if (out === src) return false
  writeFileSync(file, out)
  console.log(`normalised markdoc table: ${file.replace(ROOT, 'src/content')}`)
  return true
}

export const normaliseAll = () => walk(ROOT).filter(normaliseFile).length

// Run as a script (npm run tables, and the pre* hooks): every file.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!normaliseAll()) console.log('no markdoc tables to normalise')
}
