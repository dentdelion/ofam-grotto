import { chromium } from 'playwright'

const shots = '/private/tmp/claude-501/-Users-lancea-grotto/f7e70582-2779-4ade-a931-460098c709cf/scratchpad'
const url = 'http://localhost:4173/'
const browser = await chromium.launch()
// Kiosk is a portrait 1080×1920 touchscreen
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, hasTouch: true })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto(url, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${shots}/0-language.png` })

// Language selection → home menu
await page.getByRole('button', { name: 'Українська' }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${shots}/1-home.png` })

// Gallery A
await page.getByRole('button', { name: 'Галерея' }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${shots}/2-gallery-a.png` })

// Open lightbox on first series
await page.getByRole('button', { name: /Stone Carvings/ }).click()
await page.waitForSelector('.pswp--open', { timeout: 5000 })
await page.waitForTimeout(600)
await page.screenshot({ path: `${shots}/3-lightbox.png` })
const counter1 = await page.textContent('.pswp__counter')

// Swipe forward like a visitor would (drag right-to-left across the photo)
await page.mouse.move(900, 960)
await page.mouse.down()
await page.mouse.move(180, 960, { steps: 15 })
await page.mouse.up()
await page.waitForTimeout(600)
const counter2 = await page.textContent('.pswp__counter')
const caption = await page.textContent('.pswp__series-caption')
await page.screenshot({ path: `${shots}/4-lightbox-next.png` })
console.log('counter:', counter1, '->', counter2, '| caption:', caption)

// Close lightbox, back to home
await page.click('.pswp__button--close')
await page.waitForTimeout(400)
await page.getByRole('button', { name: /Back/ }).click()
await page.waitForTimeout(300)

// Gallery B (reference materials)
await page.getByRole('button', { name: 'Довідникові матеріали' }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${shots}/5-gallery-b.png` })
await page.getByRole('button', { name: /Back/ }).click()

// Info screen
await page.getByRole('button', { name: 'Загальні відомості' }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${shots}/6-info.png` })
await page.getByRole('button', { name: /Back/ }).click()

// PROBE: language toggle swaps menu labels
await page.getByRole('button', { name: 'EN' }).click()
await page.waitForTimeout(200)
const enMenuVisible = await page.getByRole('button', { name: 'Gallery' }).isVisible()
console.log('EN menu after toggle:', enMenuVisible ? 'visible' : 'MISSING')
await page.screenshot({ path: `${shots}/7-home-en.png` })
await page.getByRole('button', { name: 'UA' }).click()

// PROBE: rapid double-tap on a series card (double lightbox?)
await page.getByRole('button', { name: 'Галерея' }).click()
const card = page.getByRole('button', { name: /Ancient Pottery/ })
await card.click()
await card.click({ force: true }).catch(() => {})
await page.waitForTimeout(800)
const pswpCount = await page.locator('.pswp').count()
console.log('pswp instances after double-tap:', pswpCount)
await page.screenshot({ path: `${shots}/8-doubletap.png` })
await page.keyboard.press('Escape')
await page.waitForTimeout(400)

// PROBE: service worker registered + offline reload (lands on language screen)
await page.waitForTimeout(1500) // let SW finish precaching
const swState = await page.evaluate(async () => {
  const reg = await navigator.serviceWorker.getRegistration()
  return reg ? (reg.active ? 'active' : 'registered') : 'none'
})
console.log('service worker:', swState)
await ctx.setOffline(true)
await page.reload({ waitUntil: 'load' }).catch((e) => console.log('offline reload failed:', e.message))
await page.waitForTimeout(800)
await page.screenshot({ path: `${shots}/9-offline-language.png` })
const offlineOk = await page.getByRole('button', { name: 'Українська' }).isVisible().catch(() => false)
console.log('offline language screen:', offlineOk ? 'ok' : 'MISSING')
await ctx.setOffline(false)

// PROBE: small window (scale shell) — kiosk shown on a laptop-sized screen
const small = await ctx.newPage()
await small.setViewportSize({ width: 1280, height: 800 })
await small.goto(url, { waitUntil: 'networkidle' })
await small.screenshot({ path: `${shots}/10-small-window.png` })

console.log('console/page errors:', errors.length ? errors : 'none')
await browser.close()
