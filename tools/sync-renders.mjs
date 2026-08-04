// Copy every panel render out of build123d into the places that serve them, so a
// re-render in the CAD repo can't silently leave a stale image on the site or in a
// title card. Runs before dev/build/edit; also available as `npm run sync:renders`.
//
// Only copies when the bytes differ, and reports what moved.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const SRC = join(homedir(), 'GitHub', 'build123d', 'render', 'out')
const DESTS = [
  join(root, 'public', 'renders'),                                  // this site
  join(homedir(), 'GitHub', 'eight4awish-video', 'public', 'renders'), // Remotion title cards
]

if (!existsSync(SRC)) {
  console.log(`sync:renders — no build123d output at ${SRC}, skipping`)
  process.exit(0)
}

// build123d writes render/out/<module>/<name>.png; take the flats and screens
const sources = []
for (const dir of readdirSync(SRC)) {
  const d = join(SRC, dir)
  if (!statSync(d).isDirectory()) continue
  for (const f of readdirSync(d)) {
    if (/_(flat|screen)\.png$/.test(f)) sources.push(join(d, f))
  }
}

let copied = 0
for (const src of sources) {
  const name = basename(src)
  const data = readFileSync(src)
  for (const destDir of DESTS) {
    if (!existsSync(destDir)) continue
    const dest = join(destDir, name)
    // only overwrite files that already exist there — don't scatter unused renders around
    if (!existsSync(dest)) continue
    if (readFileSync(dest).equals(data)) continue
    writeFileSync(dest, data)
    console.log(`  updated ${name} -> ${destDir.replace(homedir(), '~')}`)
    copied++
  }
}

console.log(copied ? `sync:renders — ${copied} file(s) updated` : 'sync:renders — all renders up to date')
