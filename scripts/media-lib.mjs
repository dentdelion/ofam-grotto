// Shared helpers for the gallery-media scripts.
//
// The raw gallery scans (content/photos/, ~1 GB) are NOT in git. They are
// published as a zip attached to a GitHub Release and fetched at build time.
// content/photos.version pins which release tag to pull.
//   scripts/media-fetch.mjs    downloads + unzips it (runs from `prebuild`)
//   scripts/media-publish.mjs  zips + uploads a new release (run by hand)

import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const contentDir = resolve(repoRoot, 'content')
export const photosDir = resolve(contentDir, 'photos')
export const versionFile = resolve(contentDir, 'photos.version')
export const markerFile = resolve(photosDir, '.media-version')
export const ASSET_NAME = 'photos.zip'

export function rel(p) {
  return p.startsWith(repoRoot + '/') ? p.slice(repoRoot.length + 1) : p
}

export function readVersion() {
  if (!existsSync(versionFile)) {
    throw new Error(
      `Missing ${rel(versionFile)}. It must hold the media release tag, e.g. "media-20260906-1200".`,
    )
  }
  const tag = readFileSync(versionFile, 'utf8').trim()
  if (!tag || tag.includes(' ')) {
    throw new Error(`${rel(versionFile)} must contain a single release tag, got: ${JSON.stringify(tag)}`)
  }
  return tag
}

export function githubRepo() {
  // Netlify exposes REPOSITORY_URL; locally we read the git remote. MEDIA_REPO
  // ("owner/name") overrides both.
  const raw =
    process.env.MEDIA_REPO ||
    process.env.REPOSITORY_URL ||
    safeExec('git', ['config', '--get', 'remote.origin.url'])
  if (!raw) throw new Error('Cannot determine the GitHub repo — set MEDIA_REPO=owner/name.')
  const m =
    raw.match(/github\.com[/:]+([^/]+)\/(.+?)(?:\.git)?\/?$/i) ||
    raw.match(/^([\w.-]+)\/([\w.-]+)$/)
  if (!m) throw new Error(`Cannot parse a GitHub repo from "${raw}".`)
  return { owner: m[1], repo: m[2] }
}

export function token() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''
}

export function hasGh() {
  return Boolean(safeExec('gh', ['--version']))
}

export function countImages(dir) {
  if (!existsSync(dir)) return 0
  let n = 0
  for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name)) n++
  }
  return n
}

function safeExec(cmd, args) {
  try {
    return execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return ''
  }
}
