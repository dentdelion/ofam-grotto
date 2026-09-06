// Rich chapter bodies for "Explore the Exhibition" (Figma node 2400:1457
// et al.). Each content/exhibition-chapters/<NN>/content.json holds an
// ordered list of blocks (quote / paragraph / image); image blocks
// reference a filename in the same folder, resolved to a bundled URL here.
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
  const blocks = content.blocks.map((block) =>
    block.type === 'image' ? { ...block, src: imageUrl(folder, block.file) } : block,
  )
  chapterContent[index] = { blocks }
}

export default chapterContent
