// Every image under content/language-bg/ is bundled at build time; staff
// just add/remove/replace files there, no code changes needed (see
// HOW-TO-EDIT-CONTENT.md). Used on the Language (entry) screen only.
const imageModules = import.meta.glob(
  '/content/language-bg/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' },
)

export default Object.keys(imageModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((path) => imageModules[path])
