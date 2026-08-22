// Keystatic's table button writes Markdoc syntax ({% table %} … {% /table %}), but the
// content collections are rendered by Astro's plain-markdown pipeline, which has no idea
// what that is — so the tag leaks onto the page as literal text and the cells come out as
// a bullet list. This rewrites any such block into a GFM table, which both renderers
// understand and which Keystatic reads back happily.
//
// Runs on prebuild, and on predev/preedit, so a table typed in the CMS is normalised
// before it can reach a built page.

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

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

let changed = 0
for (const file of walk(ROOT)) {
  const src = readFileSync(file, 'utf8')
  if (!src.includes('{% table %}')) continue
  const out = src.replace(/\{%\s*table\s*%\}\n([\s\S]*?)\n\{%\s*\/table\s*%\}/g,
    (whole, inner) => toGfm(inner) ?? whole)
  if (out !== src) {
    writeFileSync(file, out)
    console.log(`normalised markdoc table: ${file.replace(ROOT, 'src/content')}`)
    changed++
  }
}
if (!changed) console.log('no markdoc tables to normalise')
