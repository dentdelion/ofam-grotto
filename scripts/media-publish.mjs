#!/usr/bin/env node
// Zip content/photos/ and attach it to a GitHub Release, then pin that release
// in content/photos.version.
//
//   npm run media:publish              -> new tag media-YYYYMMDD-HHMM
//   npm run media:publish media-foo    -> use tag "media-foo"
//
// Auth: the `gh` CLI if it is installed and logged in, otherwise GITHUB_TOKEN /
// GH_TOKEN with "contents: write". After it finishes, commit content/photos.version.

import { execFileSync, execSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import {
  ASSET_NAME,
  countImages,
  githubRepo,
  hasGh,
  photosDir,
  rel,
  token,
  versionFile,
} from './media-lib.mjs'

// GitHub caps a single release asset at 2 GB; split below that with headroom.
const SPLIT_AT = 1900 * 1024 * 1024

const imageCount = countImages(photosDir)
if (imageCount === 0) {
  console.error(`[media-publish] ${rel(photosDir)} has no images — nothing to publish.`)
  process.exit(1)
}

const tag = (process.argv[2] || defaultTag()).trim()
if (tag.includes(' ')) {
  console.error(`[media-publish] tag must not contain spaces: ${JSON.stringify(tag)}`)
  process.exit(1)
}

const { owner, repo } = githubRepo()
const work = resolve(tmpdir(), `grotto-media-publish-${process.pid}`)
rmSync(work, { recursive: true, force: true })
mkdirSync(work, { recursive: true })
const zipPath = resolve(work, ASSET_NAME)

try {
  console.log(`[media-publish] zipping ${imageCount} images from ${rel(photosDir)} …`)
  execFileSync(
    'zip',
    ['-r', '-q', '-X', zipPath, 'photos', '-x', '.DS_Store', '-x', '*/.DS_Store', '-x', '*/.media-version'],
    { cwd: resolve(photosDir, '..'), stdio: 'inherit' },
  )

  let assets
  const zipSize = statSync(zipPath).size
  console.log(`[media-publish] ${ASSET_NAME}: ${(zipSize / 1e6).toFixed(0)} MB`)
  if (zipSize > SPLIT_AT) {
    console.log('[media-publish] larger than 1.9 GB — splitting into parts …')
    execSync(`split -b ${SPLIT_AT} '${zipPath}' '${zipPath}.part-'`)
    rmSync(zipPath)
    assets = readdirSync(work)
      .filter((f) => f.startsWith(`${ASSET_NAME}.part-`))
      .sort()
      .map((f) => resolve(work, f))
  } else {
    assets = [zipPath]
  }

  if (hasGh()) publishWithGh(owner, repo, tag, assets)
  else await publishWithApi(owner, repo, tag, assets)

  writeFileSync(versionFile, tag + '\n')
} finally {
  rmSync(work, { recursive: true, force: true })
}

console.log('')
console.log(`[media-publish] published ${tag} and pinned it in ${rel(versionFile)}.`)
console.log('[media-publish] commit the pin so Netlify picks it up:')
console.log('')
console.log(`    git add ${rel(versionFile)}`)
console.log(`    git commit -m "Publish gallery media ${tag}"`)
console.log('    git push')

// ---------------------------------------------------------------------------

function defaultTag() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `media-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
}

function publishWithGh(owner, repo, tag, assets) {
  const R = `${owner}/${repo}`
  console.log(`[media-publish] uploading via gh to ${R} …`)
  const exists = tryGh(['release', 'view', tag, '--repo', R])
  if (exists) {
    execFileSync('gh', ['release', 'upload', tag, '--repo', R, '--clobber', ...assets], { stdio: 'inherit' })
  } else {
    execFileSync(
      'gh',
      ['release', 'create', tag, '--repo', R, '--title', tag, '--notes', `Gallery media bundle ${tag}`, ...assets],
      { stdio: 'inherit' },
    )
  }
}

async function publishWithApi(owner, repo, tag, assets) {
  const tok = token()
  if (!tok) {
    throw new Error('No `gh` CLI and no GITHUB_TOKEN/GH_TOKEN — cannot upload the release.')
  }
  const api = `https://api.github.com/repos/${owner}/${repo}`
  const h = { Authorization: `Bearer ${tok}`, Accept: 'application/vnd.github+json', 'User-Agent': 'grotto-media' }

  console.log(`[media-publish] uploading via API to ${owner}/${repo} …`)
  let res = await fetch(`${api}/releases/tags/${encodeURIComponent(tag)}`, { headers: h })
  let release
  if (res.status === 404) {
    res = await fetch(`${api}/releases`, {
      method: 'POST',
      headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag_name: tag, name: tag, body: `Gallery media bundle ${tag}` }),
    })
    if (!res.ok) throw new Error(`Creating release failed: ${res.status} ${await res.text()}`)
    release = await res.json()
  } else if (res.ok) {
    release = await res.json()
  } else {
    throw new Error(`Looking up release failed: ${res.status} ${await res.text()}`)
  }

  for (const a of release.assets || []) {
    if (a.name === ASSET_NAME || a.name.startsWith(`${ASSET_NAME}.part-`)) {
      await fetch(`${api}/releases/assets/${a.id}`, { method: 'DELETE', headers: h })
    }
  }

  for (const file of assets) {
    const name = file.split('/').pop()
    console.log(`[media-publish]   uploading ${name} …`)
    execFileSync(
      'curl',
      [
        '-fsS', '-X', 'POST',
        '-H', `Authorization: Bearer ${tok}`,
        '-H', 'Content-Type: application/zip',
        '-H', 'User-Agent: grotto-media',
        '--data-binary', `@${file}`,
        `https://uploads.github.com/repos/${owner}/${repo}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`,
      ],
      { stdio: ['ignore', 'ignore', 'inherit'] },
    )
  }
}

function tryGh(args) {
  try {
    execFileSync('gh', args, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}
