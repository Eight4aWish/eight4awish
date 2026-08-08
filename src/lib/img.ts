// Card grids and posters link to the WebP derivatives in public/opt rather than the
// multi-megabyte originals — see tools/optimise-images.mjs, which generates them.
//
// Only local /renders and /images paths are rewritten; anything else (an external URL,
// an SVG, a missing field) is handed back untouched so it still resolves.

const DERIVED = /^\/(renders|images)\//

// og is JPEG rather than WebP — social scrapers are the least reliable consumers.
const EXT = { thumb: 'webp', med: 'webp', og: 'jpg' } as const

export const opt = (path?: string, size: keyof typeof EXT = 'thumb') => {
  if (!path || !DERIVED.test(path)) return path
  const stem = path.split('/').pop()!.replace(/\.[^.]+$/, '')
  return `/opt/${stem}.${size}.${EXT[size]}`
}
