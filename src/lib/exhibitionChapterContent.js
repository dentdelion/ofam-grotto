// Rich chapter bodies for "Explore the Exhibition" (Figma node 2400:1457
// et al.). Each content/exhibition-chapters/<NN>/content.json holds an
// ordered list of blocks (quote / paragraph / image / document); blocks with
// a picture reference a filename in the same folder, resolved to a bundled
// URL here.
// Chapters with no content.json yet fall back to the generic placeholder
// (see App.jsx) — replace as each chapter's Figma frame is provided.
const contentModules = import.meta.glob('/content/exhibition-chapters/*/content.json', {
  eager: true,
  import: 'default',
})
const imageModules = import.meta.glob(
  '/content/exhibition-chapters/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' },
)

function imageUrl(folder, file) {
  const path = `/content/exhibition-chapters/${folder}/${file}`
  const url = imageModules[path]
  if (!url) throw new Error(`exhibition chapter image not found: ${path}`)
  return url
}

const chapterContent = {}
for (const [path, content] of Object.entries(contentModules)) {
  // path: /content/exhibition-chapters/<NN>/content.json
  const folder = path.split('/')[3]
  const index = Number.parseInt(folder, 10) - 1
  const blocks = content.blocks.map((block) => {
    // An image block is either a single picture (file/width/height) or a run of
    // them sharing one caption (images: [...]), as in chapter 7.
    if (Array.isArray(block.images)) {
      const images = block.images.map((img) => ({ ...img, src: imageUrl(folder, img.file) }))
      return { ...block, images }
    }
    return block.file ? { ...block, src: imageUrl(folder, block.file) } : block
  })
  // spread first so per-chapter settings alongside "blocks" (e.g. bodyHeight)
  // survive into the screen
  chapterContent[index] = { ...content, blocks }
}

export default chapterContent
