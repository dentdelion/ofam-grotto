import BackButton from '../components/BackButton'
import chapters from '../lib/exhibitionChapters'
import nextArrow from '../assets/next-arrow.svg'
import styles from './ExhibitionChapter.module.css'

// Rich exhibition-chapter body (Figma node 2400:1457 for chapter 1; every
// chapter reuses this same template — see content/exhibition-chapters/<NN>).
export default function ExhibitionChapter({ chapterIndex, content, onNavigate, onPrev, onNext }) {
  const hasPrev = chapterIndex > 0
  const hasNext = chapterIndex < chapters.length - 1
  return (
    <div className={styles.screen}>
      <BackButton onClick={() => onNavigate('explore-exhibition')} label="Return" style={{ top: '70px' }} />

      <div className={styles.titleRow}>
        <h1 className={styles.title}>
          {chapterIndex + 1}. {chapters[chapterIndex]}
        </h1>
        <div className={styles.arrows}>
          {hasPrev && (
            <button className={styles.arrowButton} onClick={onPrev} aria-label="Previous chapter">
              <img src={nextArrow} alt="" className={styles.prevIcon} />
            </button>
          )}
          {hasNext && (
            <button className={styles.arrowButton} onClick={onNext} aria-label="Next chapter">
              <img src={nextArrow} alt="" className={styles.nextIcon} />
            </button>
          )}
        </div>
      </div>

      {/* keyed on the chapter so paging to the next one starts at the top.
          Credits (chapter 12) get a taller viewport so the whole list fits
          without scrolling — Figma node 2500:952. */}
      <div
        className={styles.body}
        key={chapterIndex}
        style={content.bodyHeight ? { height: content.bodyHeight } : undefined}
      >
        {content.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </div>
  )
}

function Block({ block }) {
  if (block.type === 'quote' || block.type === 'paragraph') {
    const style =
      block.paragraphGap === undefined ? undefined : { '--paragraph-gap': `${block.paragraphGap}px` }
    return (
      <div className={block.type === 'quote' ? styles.quote : styles.paragraph} style={style}>
        {block.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    )
  }
  // Credits list (Figma node 2500:952): semibold throughout, with each role
  // label followed by its names in the regular weight.
  if (block.type === 'credits') {
    return (
      <div className={styles.credits}>
        {block.lines.map((line, i) => (
          <p key={i}>
            {line.leadingBreak && <br />}
            {line.blank ? (
              ' '
            ) : line.label ? (
              <>
                {line.label} <span className={styles.creditsValue}>{line.value}</span>
              </>
            ) : (
              line.text
            )}
          </p>
        ))}
      </div>
    )
  }
  // Archive document: tall scan on the left, caption + transcript alongside it
  // (Figma node 2457:2508), both bottom-aligned.
  if (block.type === 'document') {
    return (
      <figure className={styles.document}>
        <div className={styles.imageBox} style={{ width: block.width, height: block.height }}>
          <img src={block.src} alt="" className={styles.coverImg} />
        </div>
        <figcaption className={`${styles.caption} ${styles.documentCaption}`}>
          {block.caption.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </figcaption>
      </figure>
    )
  }
  // One picture, or a run of them under a single caption (Figma node 2498:680).
  const images = block.images ?? [block]
  return (
    <figure className={styles.figure}>
      {images.map((image, i) => (
        <ImageBox key={i} image={image} />
      ))}
      <figcaption className={styles.caption}>
        {block.caption.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </figcaption>
    </figure>
  )
}

function ImageBox({ image }) {
  return (
    <div className={styles.imageBox} style={{ width: image.width, height: image.height }}>
      {image.crop ? (
        <div className={styles.cropWrap}>
          <img src={image.src} alt="" className={styles.cropImg} style={image.crop} />
        </div>
      ) : (
        <img src={image.src} alt="" className={styles.coverImg} />
      )}
    </div>
  )
}
