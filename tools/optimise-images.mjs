// Generate small WebP derivatives of everything in public/renders and public/images.
//
//   npm run images
//
// The originals are 2-4 MB PNGs straight out of Blender, and the site was serving them
// whole into card thumbnails 220px tall. These derivatives are what the pages actually
// link to; the originals stay put so the module pages, downloads and any future print
// use still have the full-resolution artwork.
//
// Two sizes, because there are two jobs:
//   thumb  card grids — 220px tall (modules) or 400x184 cover (tutorials), so 900x460
//          covers both at 2x
//   med    the "video coming soon" poster, which covers a 720px-wide box at 28% opacity
//   og     social previews — JPEG, not WebP, because some scrapers (WhatsApp especially,
//          which also drops previews much over 300 KB) still handle WebP poorly
//
// Runs before every build (see the prebuild script) and skips anything already newer
// than its source, so a rebuild costs nothing.

import sharp from 'sharp'
import { readdirSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = ['renders', 'images']
const OUT = join(root, 'public', 'opt')

const SIZES = {
  thumb: { width: 900, height: 460, quality: 78, ext: 'webp' },
  med: { width: 900, height: 2400, quality: 70, ext: 'webp' },
  og: { width: 1200, height: 1200, quality: 78, ext: 'jpg' },
}

const isImage = (f) => /\.(png|jpe?g)$/i.test(f)

mkdirSync(OUT, { recursive: true })

let made = 0
let skipped = 0
let before = 0
let after = 0

for (const dir of SRC) {
  const abs = join(root, 'public', dir)
  if (!existsSync(abs)) continue

  for (const file of readdirSync(abs).filter(isImage)) {
    const src = join(abs, file)
    const stem = basename(file, extname(file))
    const srcTime = statSync(src).mtimeMs
    before += statSync(src).size

    for (const [name, { width, height, quality, ext }] of Object.entries(SIZES)) {
      const out = join(OUT, `${stem}.${name}.${ext}`)

      // Up to date already? Nothing to do — this runs on every build.
      if (existsSync(out) && statSync(out).mtimeMs >= srcTime) {
        skipped++
        after += statSync(out).size
        continue
      }

      const pipe = sharp(src).resize({ width, height, fit: 'inside', withoutEnlargement: true })
      await (ext === 'jpg' ? pipe.jpeg({ quality, mozjpeg: true }) : pipe.webp({ quality }))
        .toFile(out)

      after += statSync(out).size
      made++
    }
  }
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`
console.log(`${made} written, ${skipped} already current -> public/opt/`)
console.log(`originals ${mb(before)}  ->  derivatives ${mb(after)}`)
