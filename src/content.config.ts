import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// One file per module / tutorial, in src/content/. These fields are what Keystatic
// puts on the editing form, and what the templates read — add a field here and it
// appears in the CMS.

const modules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/modules' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),                       // drives "latest modules" order
    summary: z.string(),                         // the card blurb
    platform: z.string(),                        // red chip: Patch.Init, ESP32, Ksoloti...
    tags: z.array(z.string()).default([]),       // grey chips: oscillator, drums...
    panel: z.string(),                           // /renders/daisy_braids_flat.png
    photo: z.string().optional(),                // the built module, in the flesh
    photoCaption: z.string().optional(),
    status: z.enum(['built', 'in progress', 'planned']).default('built'),
    firmware: z.string().optional(),             // repo URL (for people who build it themselves)
    binary: z.string().optional(),               // compiled release asset — the no-compiler path
    firmwareVersion: z.string().optional(),      // so people know what they're flashing
    // extra builds of the same module (e.g. a screenless variant) — each gets its own button
    extraBinaries: z.array(z.object({
      label: z.string(),                         // e.g. "Joy Lite"
      url: z.string(),
      version: z.string().optional(),
    })).default([]),
    // depends on how the firmware is BUILT (Daisy BOOT_NONE vs BOOT_QSPI), not just the platform
    flashWith: z.enum(['daisy-direct', 'daisy-qspi', 'ksoloti', 'uf2']).optional(),
    // Per-module wording for the flashing section. Every field is optional and falls back
    // to the preset for flashWith, so a module only states what is different about it -
    // its filename, its "you should see this" - and a new module still gets working
    // instructions without writing any.
    flash: z.object({
      intro: z.string().optional(),
      warn: z.string().optional(),
      stepsTitle: z.string().optional(),
      bootSteps: z.array(z.string()).default([]),
      steps: z.array(z.string()).default([]),
      command: z.string().optional(),
      note: z.string().optional(),
    }).optional(),
    stl: z.string().optional(),
    step: z.string().optional(),
    video: z.string().optional(),                // YouTube id; blank = "coming soon"
    draft: z.boolean().default(false),
  }),
})

const tutorials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tutorials' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),                         // "Music as code"
    date: z.coerce.date(),
    summary: z.string(),
    graphic: z.string(),                         // /renders/tut_music.png
    chips: z.array(z.string()).default([]),
    repo: z.string().optional(),
    cta: z.string().optional(),                  // where the button goes
    order: z.number().default(0),
    video: z.string().optional(),                // YouTube id — the page leads with this
    draft: z.boolean().default(false),
    // The page leads with the video; below it, the real rig code annotated block by block.
    // One "song" per file; each block is a chunk of code beside the note that explains it.
    songs: z.array(z.object({
      title: z.string(),
      blurb: z.string().optional(),              // one line under the song heading
      videoTime: z.string().optional(),          // deep-link into the video, e.g. 4m12s
      download: z.string().optional(),           // /lessons/xxx.js — the full runnable file
      blocks: z.array(z.object({
        label: z.string().optional(),            // "Parts", "Movement"...
        code: z.string(),                        // the real rig code, verbatim
        note: z.string().optional(),             // plain text; `backticks` and **bold** render inline
      })).default([]),
    })).default([]),
  }),
})

export const collections = { modules, tutorials }
