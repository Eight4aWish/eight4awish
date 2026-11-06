#!/usr/bin/env node
// Keep README.md in step with the site. GitHub shows this repo's README as the profile
// page, because the repo's name matches the account's, so it is the front door to all of
// the repos. It went stale when it was written by hand, and an image broke when a render
// was renamed, so most of it is now made from what already exists:
//
//   the published modules, tutorials and notes   src/content, and whether docs/ has the page
//   the built modules that have no page yet      src/content/modules with draft: true
//   the intro                                    src/content/home.json
//   the public repos                             the GitHub API, with the notes in REPO_NOTES
//   the skills                                   skills/README.md
//
// Only the text between <!-- generated:x --> markers is replaced. Everything else in the
// README is written by hand and left alone.
//
//   npm run readme                   rewrite the README
//   node tools/build-readme.mjs --check   also check the source links and the releases
//
// It runs after every build, so a deploy carries its README with it, and in
// .github/workflows/readme.yml for anything that reaches main without a deploy, such as a
// new public repo. It stops with an error, and writes nothing, if an image is missing.
// Plain Node with no dependencies, so the workflow needs no install.

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OWNER = 'Eight4aWish'
const SITE = 'https://eight4awish.com'
const CHECK = process.argv.includes('--check')

// What a visitor needs to know about each repo. A public repo with no note here still gets
// listed, with its GitHub description, so a new one shows up without anyone remembering.
const REPO_NOTES = {
  eurorack_daisy_patch_init: 'Firmware for the Daisy patch.Init() and the Alchemy Lab: Joy, Sorrow, Mirth, Secret, Wish and more.',
  eurorack_modules: 'Firmware for modules on Teensy, Pico, ESP32, Ksoloti and AMYboard: Girl, Boy, CortHex and more.',
  eurorack_electronics: 'Analogue designs and breadboard layouts: the Dual Pingable LPG, and the board behind Boy.',
  build123d: 'Panels as code: the Eurorack front panels, plus cable and headphone holders.',
  [OWNER.toLowerCase()]: 'The eight4awish.com site, this page, the full module inventory and the Claude skills.',
  'seeed-recorder': 'Retrospective, a Mac app that saves the audio you just played, and its 1U trigger module.',
  tiliqua: 'Silver and Gold, bitstream instruments for the Tiliqua, on a fork of its source.',
}

// Top-level keys only, which is all this needs: plain values, quoted values, trailing
// comments and folded (>-) blocks. Nested blocks are indented, so they are skipped.
function frontmatter(text) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!block) return {}
  const out = {}
  const lines = block[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z]\w*):\s*(.*)$/)
    if (!kv) continue
    let value = kv[2].trim()
    if (/^[>|][-+]?$/.test(value)) {
      const parts = []
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) parts.push(lines[++i].trim())
      value = parts.join(' ')
    } else if (/^["']/.test(value)) {
      value = value.slice(1, value.indexOf(value[0], 1))
    } else {
      value = value.replace(/\s+#.*$/, '').trim()
    }
    out[kv[1]] = value
  }
  return out
}

// Newest first, as the site orders them: `date` is the running order (see tools/promote.mjs).
function collection(name) {
  const dir = join(root, 'src/content', name)
  return readdirSync(dir)
    .filter((f) => extname(f) === '.md')
    .map((f) => {
      const slug = basename(f, '.md')
      const data = frontmatter(readFileSync(join(dir, f), 'utf8'))
      // Published means on the site now, not just marked ready, so the README never
      // links to a page that hasn't been deployed.
      const live = data.draft !== 'true' && existsSync(join(root, 'docs', name, slug, 'index.html'))
      return { ...data, slug, live, url: `${SITE}/${name}/${slug}/` }
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

const problems = []
const cell = (s = '') => String(s).replace(/\|/g, '\\|')
const video = (id) => (id ? `[Video](https://youtu.be/${id})` : '')

// The light derivative where there is one: the source renders are 3 MB each. Every image
// is checked here, because a renamed render is what broke this page before.
function panelImage(item, height = 150) {
  const name = basename(item.panel || '', extname(item.panel || ''))
  const light = `public/opt/${name}.med.webp`
  const full = `public${item.panel}`
  const src = existsSync(join(root, light)) ? light : full
  if (!existsSync(join(root, src))) problems.push(`${item.title}: no image at ${full}`)
  return `<img src="${src}" alt="${item.title} panel" height="${height}">`
}

function releaseTag(item) {
  return item.binary?.match(/\/releases\/download\/([^/]+)\//)?.[1] ?? ''
}

function releasedBlock(modules) {
  const rows = modules.filter((m) => m.live).map((m) => {
    const links = [video(m.video), m.firmware ? `[Source](${m.firmware})` : ''].filter(Boolean).join(' · ')
    const version = m.firmwareVersion || releaseTag(m)
    return `| <a href="${m.url}">${panelImage(m)}</a> | **[${cell(m.title)}](${m.url})**<br>${cell(m.summary)} | ${cell(m.platform)} | ${cell(version)} | ${links} |`
  })
  return ['| | Module | Runs on | Version | Links |', '| --- | --- | --- | --- | --- |', ...rows].join('\n')
}

function builtBlock(modules) {
  const rows = modules.filter((m) => m.draft === 'true').map((m) => {
    const image = panelImage(m)
    const title = `**${cell(m.title)}**<br>${cell(m.summary)}`
    return `| ${m.firmware ? `<a href="${m.firmware}">${image}</a>` : image} | ${title} | ${cell(m.platform)} | ${m.firmware ? `[Source](${m.firmware})` : ''} |`
  })
  return ['| | Module | Runs on | Links |', '| --- | --- | --- | --- |', ...rows].join('\n')
}

function readingBlock(tutorials, notes) {
  const line = (x) => `- **[${x.title}](${x.url})**: ${x.summary}${x.video ? ` ${video(x.video)}` : ''}`
  const section = (label, items) => (items.length ? [`**${label}**`, '', ...items.map(line)].join('\n') : '')
  return [section('Tutorials', tutorials.filter((t) => t.live)), section('Notes', notes.filter((n) => n.live))]
    .filter(Boolean)
    .join('\n\n')
}

function introBlock() {
  const home = JSON.parse(readFileSync(join(root, 'src/content/home.json'), 'utf8'))
  return [
    `# ${home.heading}`,
    '',
    home.intro,
    '',
    `[eight4awish.com](${SITE}) · [YouTube](https://www.youtube.com/@${OWNER}) · [Buy me a coffee](https://buymeacoffee.com/${OWNER.toLowerCase()})`,
  ].join('\n')
}

function skillsBlock() {
  const rows = readFileSync(join(root, 'skills/README.md'), 'utf8').match(/^\| \[.*$/gm) ?? []
  return rows
    .map((row) => {
      const [, name, description] = row.match(/^\| \[([^\]]+)\]\([^)]*\) \| (.*?) \|$/) ?? []
      if (!name) return ''
      // Just the opening clause; the skills page has the rest.
      const short = description.split(/: |\. /)[0].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      return `- **[${name}](skills/${name}/)**: ${short}.`
    })
    .filter(Boolean)
    .join('\n')
}

async function github(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'eight4awish-readme' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const res = await fetch(`https://api.github.com/${path}`, { headers, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
  return res.json()
}

// Null when GitHub can't be reached, which leaves the block as it is: a build on a train
// shouldn't fail or empty the list.
async function reposBlock() {
  let repos
  try {
    repos = await github(`users/${OWNER}/repos?per_page=100&sort=pushed`)
  } catch (err) {
    console.log(`readme: repo list unchanged (${err.message})`)
    return null
  }
  repos = repos.filter((r) => !r.private && !r.archived)
  const order = Object.keys(REPO_NOTES)
  const rank = (r) => (order.includes(r.name) ? order.indexOf(r.name) : order.length)
  const rows = repos
    .sort((a, b) => rank(a) - rank(b))
    .map((r) => {
      const note = REPO_NOTES[r.name] ?? `${r.description ?? ''}${r.fork ? ' (fork)' : ''}`
      return `| [${r.name}](${r.html_url}) | ${cell(note.trim())} |`
    })
  return ['| Repo | What it holds |', '| --- | --- |', ...rows].join('\n')
}

function replaceBlock(readme, name, body) {
  const pattern = new RegExp(`(<!-- generated:${name} -->)[\\s\\S]*?(<!-- /generated:${name} -->)`)
  if (!pattern.test(readme)) {
    problems.push(`README.md has no generated:${name} block`)
    return readme
  }
  return readme.replace(pattern, (_, open, close) => `${open}\n${body}\n${close}`)
}

// Everything the hand-written parts point at inside this repo.
function checkLocalReferences(readme) {
  const paths = [...readme.matchAll(/src="([^"]+)"|\]\(([^)#]+)\)/g)].map((m) => m[1] ?? m[2])
  for (const path of paths) {
    if (/^(https?:|mailto:)/.test(path)) continue
    if (!existsSync(join(root, path))) problems.push(`README.md points at ${path}, which isn't in the repo`)
  }
}

// --check: the source folders are in other repos, and a release can land before its page is
// updated. A 404 or a newer release is a problem; a failed request is not, as it says
// nothing about the page.
async function checkElsewhere(modules) {
  for (const m of modules) {
    if (m.firmware?.startsWith('https://github.com/') && (m.live || m.draft === 'true')) {
      const res = await fetch(m.firmware, { method: 'HEAD', signal: AbortSignal.timeout(15000) }).catch(() => null)
      if (res?.status === 404) problems.push(`${m.title}: source link is gone: ${m.firmware}`)
    }
  }
  const prefix = (tag) => tag.replace(/-v?\d[\w.]*$/, '')
  const releases = new Map()
  for (const m of modules.filter((x) => x.live && releaseTag(x))) {
    const repo = m.binary.match(/github\.com\/[^/]+\/([^/]+)\//)?.[1]
    if (!releases.has(repo)) {
      releases.set(repo, await github(`repos/${OWNER}/${repo}/releases?per_page=100`).catch(() => []))
    }
    const tag = releaseTag(m)
    const newest = releases
      .get(repo)
      .filter((r) => !r.draft && !r.prerelease && prefix(r.tag_name) === prefix(tag))
      .sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)))[0]
    if (newest && newest.tag_name !== tag) {
      problems.push(`${m.title}: the site offers ${tag}, but ${repo} has released ${newest.tag_name}`)
    }
  }
}

const modules = collection('modules')
let readme = readFileSync(join(root, 'README.md'), 'utf8')
readme = replaceBlock(readme, 'intro', introBlock())
readme = replaceBlock(readme, 'released', releasedBlock(modules))
readme = replaceBlock(readme, 'built', builtBlock(modules))
readme = replaceBlock(readme, 'reading', readingBlock(collection('tutorials'), collection('notes')))
readme = replaceBlock(readme, 'skills', skillsBlock())
const repos = await reposBlock()
if (repos) readme = replaceBlock(readme, 'repos', repos)
checkLocalReferences(readme)

const brokenPage = problems.length > 0
if (!brokenPage) {
  writeFileSync(join(root, 'README.md'), readme)
  console.log('readme: up to date')
}
if (CHECK) await checkElsewhere(modules)

if (problems.length) {
  for (const p of problems) console.error(`readme: ${p}`)
  process.exit(1)
}
