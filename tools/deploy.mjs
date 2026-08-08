// Build the site and publish it.
//
//   npm run deploy                      commits as "Update site content"
//   npm run deploy -- "Joy: fix the calibration wording"
//
// The site is served from the docs/ folder on main, so the build output is committed
// rather than produced by CI — editing a markdown file is not enough on its own, the
// build has to run and its output has to go up with it. This does both.

import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
const run = (cmd, ...args) => execFileSync(cmd, args, { cwd: root, stdio: 'inherit' })

// Pages publishes whatever is on main, so deploying from anywhere else would be a no-op
// that looks like a success.
const branch = git('rev-parse', '--abbrev-ref', 'HEAD')
if (branch !== 'main') {
  console.error(`On "${branch}", not main — the site publishes from main. Switch first.`)
  process.exit(1)
}

console.log('building ...')
run('npm', 'run', 'build')

if (!git('status', '--porcelain')) {
  console.log('\nNothing changed — already published.')
  process.exit(0)
}

const message = process.argv[2]?.trim() || 'Update site content'
git('add', '-A')
git('commit', '-m', message)
run('git', 'push', 'origin', 'main')

console.log(`\nPublished: ${git('rev-parse', '--short', 'HEAD')}  ${message}`)
console.log('Live at https://eight4awish.com in about a minute (hard-refresh to see it).')
