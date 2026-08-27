#!/usr/bin/env node
// Bring a note or module back to the top by dating it today.
//
//   npm run promote grids-patterns
//   npm run promote sorrow --dry
//   npm run promote                  # list what there is, newest first
//
// The home page and the notes index both sort on `date` descending, so the date
// is the running order rather than a record of when something was written. A
// piece written weeks ago and only now being pointed at - a call for testers that
// a video is about to send people to, say - belongs at the top on the day it gets
// an audience, not on the day it was drafted.
//
// Only the frontmatter date moves. Nothing else in the file is touched, and git
// keeps the previous date if the original matters.

import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIRS = ['src/content/notes', 'src/content/modules', 'src/content/tutorials']

const args = process.argv.slice(2)
const dry = args.includes('--dry')
const slug = args.find((a) => !a.startsWith('--'))

const today = new Date().toISOString().slice(0, 10)

const entries = []
for (const dir of DIRS) {
  const abs = path.join(ROOT, dir)
  let names = []
  try {
    names = await fs.readdir(abs)
  } catch {
    continue
  }
  for (const name of names.filter((n) => n.endsWith('.md'))) {
    const file = path.join(abs, name)
    const text = await fs.readFile(file, 'utf8')
    const m = text.match(/^date:\s*(\S+)\s*$/m)
    entries.push({
      slug: name.replace(/\.md$/, ''),
      kind: path.basename(dir),
      date: m?.[1] ?? '(none)',
      file,
      text,
      hasDate: Boolean(m),
    })
  }
}

if (!slug) {
  console.log('\nWhat there is, newest first:\n')
  for (const e of entries.sort((a, b) => b.date.localeCompare(a.date))) {
    console.log(`  ${e.date}  ${e.kind.padEnd(10)} ${e.slug}`)
  }
  console.log('\nPromote one with:  npm run promote <slug>\n')
  process.exit(0)
}

const hits = entries.filter((e) => e.slug === slug)
if (hits.length === 0) {
  console.error(`No note, module or tutorial called "${slug}".`)
  console.error('Run `npm run promote` with no argument to list them.')
  process.exit(1)
}
if (hits.length > 1) {
  console.error(`"${slug}" exists in more than one place: ${hits.map((h) => h.kind).join(', ')}.`)
  process.exit(1)
}

const [e] = hits
if (!e.hasDate) {
  console.error(`${e.slug} has no date field to move.`)
  process.exit(1)
}
if (e.date === today) {
  console.log(`${e.slug} is already dated today (${today}). Nothing to do.`)
  process.exit(0)
}

console.log(`  ${e.kind}/${e.slug}   ${e.date}  ->  ${today}`)
if (dry) {
  console.log('  dry run - nothing written')
  process.exit(0)
}
await fs.writeFile(e.file, e.text.replace(/^date:\s*\S+\s*$/m, `date: ${today}`))
console.log('  done - rebuild and deploy to see it move')
