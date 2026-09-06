#!/usr/bin/env node
// Ensure content/photos/ is present and matches content/photos.version.
//
// Runs automatically before `npm run dev` / `npm run build` (see package.json
// "predev" / "prebuild"). Safe to run repeatedly: if the photos are already at
// the pinned tag it does nothing.
//
// Auth, in order of preference:
//   - GITHUB_TOKEN / GH_TOKEN in the env  -> GitHub API (needed for a private repo;
//     this is what you set in Netlify's environment variables)
//   - `gh` CLI logged in                  -> `gh release download`
//   - neither                             -> plain public release URL

import { execFileSync, execSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import {
  ASSET_NAME,
  countImages,
  githubRepo,
  hasGh,
  markerFile,
  photosDir,
  readVersion,
  rel,
  token,
} from './media-lib.mjs'

const tag = readVersion()

if (isUpToDate(tag)) {
  console.log(`[media-fetch] content/photos already at "${tag}" — nothing to do.`)
  process.exit(0)
}

const { owner, repo } = githubRepo()
const tok = token()
console.log(`[media-fetch] fetching photos "${tag}" from ${owner}/${repo} …`)

const work = resolve(tmpdir(), `grotto-media-fetch-${process.pid}`)
rmSync(work, { recursive: true, force: true })
mkdirSync(work, { recursive: true })

try {
  let parts
  if (tok) parts = await downloadViaApi(owner, repo, tag, tok, work)
  else if (hasGh()) parts = downloadViaGh(owner, repo, tag, work)
  else parts = downloadViaPublicUrl(owner, repo, tag, work)

  const zipPath = resolve(work, ASSET_NAME)
  if (!(parts.length === 1 && parts[0] === zipPath)) {
    // Reassemble split parts (used only when the zip would exceed GitHub's 2 GB
    // per-asset limit). Shell `cat` streams from disk — no giant Buffers.
    execSync(`cat ${parts.map((p) => `'${p}'`).join(' ')} > '${zipPath}'`)
  }

  rmSync(photosDir, { recursive: true, force: true })
  // The zip stores paths as "photos/…", so extract into content/.
  execFileSync('unzip', ['-q', '-o', zipPath, '-d', resolve(photosDir, '..')], { stdio: 'inherit' })
  writeFileSync(markerFile, tag + '\n')
} finally {
  rmSync(work, { recursive: true, force: true })
}

const count = countImages(photosDir)
if (count === 0) {
  console.error('[media-fetch] ERROR: extracted archive contained no images.')
  process.exit(1)
}
console.log(`[media-fetch] done — ${count} images under ${rel(photosDir)}.`)

// ---------------------------------------------------------------------------

function isUpToDate(wantTag) {
  try {
    if (readFileSync(markerFile, 'utf8').trim() !== wantTag) return false
  } catch {
    return false
  }
  return countImages(photosDir) > 0
}

async function downloadViaApi(owner, repo, tag, tok, work) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`,
    { headers: { Authorization: `Bearer ${tok}`, Accept: 'application/vnd.github+json', 'User-Agent': 'grotto-media' } },
  )
  if (!res.ok) {
    throw new Error(
      `GitHub API ${res.status} looking up release "${tag}". Check the tag exists and the token has "contents: read".`,
    )
  }
  const release = await res.json()
  const assets = (release.assets || [])
    .filter((a) => a.name === ASSET_NAME || a.name.startsWith(`${ASSET_NAME}.part-`))
    .sort((a, b) => a.name.localeCompare(b.name))
  if (!assets.length) throw new Error(`Release "${tag}" has no ${ASSET_NAME} asset.`)

  const files = []
  for (const a of assets) {
    const dest = resolve(work, a.name)
    console.log(`[media-fetch]   ${a.name}  (${mb(a.size)} MB)`)
    curl(a.url, dest, [
      `Authorization: Bearer ${tok}`,
      'Accept: application/octet-stream',
      'User-Agent: grotto-media',
    ])
    files.push(dest)
  }
  return files
}

function downloadViaGh(owner, repo, tag, work) {
  console.log('[media-fetch]   via gh release download')
  execFileSync(
    'gh',
    ['release', 'download', tag, '--repo', `${owner}/${repo}`, '--pattern', `${ASSET_NAME}*`, '--dir', work],
    { stdio: 'inherit' },
  )
  const files = readdirSync(work)
    .filter((f) => f === ASSET_NAME || f.startsWith(`${ASSET_NAME}.part-`))
    .sort()
    .map((f) => resolve(work, f))
  if (!files.length) throw new Error(`gh release download produced no ${ASSET_NAME}.`)
  return files
}

function downloadViaPublicUrl(owner, repo, tag, work) {
  const base = `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}`
  const single = resolve(work, ASSET_NAME)
  if (curl(`${base}/${ASSET_NAME}`, single, [], true)) return [single]

  const parts = []
  for (const suffix of splitSuffixes()) {
    const name = `${ASSET_NAME}.part-${suffix}`
    const dest = resolve(work, name)
    if (!curl(`${base}/${name}`, dest, [], true)) break
    parts.push(dest)
  }
  if (parts.length) return parts

  throw new Error(
    `Could not download ${ASSET_NAME} from release "${tag}" of ${owner}/${repo}.\n` +
      `If the repo is private, set GITHUB_TOKEN (or log in with the gh CLI).`,
  )
}

function curl(url, dest, headers = [], soft = false) {
  const args = [soft ? '-fsL' : '-fSL', '--retry', '3', '--retry-delay', '2', '-o', dest]
  for (const h of headers) args.push('-H', h)
  args.push(url)
  try {
    execFileSync('curl', args, { stdio: ['ignore', 'ignore', 'inherit'] })
    return true
  } catch (err) {
    if (soft) return false
    throw err
  }
}

function* splitSuffixes() {
  const a = 'abcdefghijklmnopqrstuvwxyz'
  for (const x of a) for (const y of a) yield x + y
}

function mb(bytes) {
  return (bytes / 1e6).toFixed(0)
}
