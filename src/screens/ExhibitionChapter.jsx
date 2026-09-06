import BackButton from '../components/BackButton'
import chapters from '../lib/exhibitionChapters'
import nextArrow from '../assets/next-arrow.svg'
import styles from './ExhibitionChapter.module.css'

// Rich exhibition-chapter body (Figma node 2400:1457 for chapter 1; every
// chapter reuses this same template — see content/exhibition-chapters/<NN>).
export default function ExhibitionChapter({ chapterIndex, content, onNavigate, onNext }) {
  const hasNext = chapterIndex < chapters.length - 1
  return (
    <div className={styles.screen}>
      <BackButton onClick={() => onNavigate('explore-exhibition')} label="Return" style={{ top: '70px' }} />

      <div className={styles.titleRow}>
        <h1 className={styles.title}>
          {chapterIndex + 1}. {chapters[chapterIndex]}
        </h1>
        {hasNext && (
          <button className={styles.nextButton} onClick={onNext} aria-label="Next chapter">
            <img src={nextArrow} alt="" className={styles.nextIcon} />
          </button>
        )}
      </div>

      <div className={styles.body}>
        {content.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </div>
  )
}

function Block({ block }) {
  if (block.type === 'quote') {
    return (
      <div className={styles.quote}>
        {block.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    )
  }
  if (block.type === 'paragraph') {
    return (
      <div className={styles.paragraph}>
        {block.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    )
  }
  return (
    <figure className={styles.figure}>
      <div className={styles.imageBox} style={{ width: block.width, height: block.height }}>
        {block.crop ? (
          <div className={styles.cropWrap}>
            <img src={block.src} alt="" className={styles.cropImg} style={block.crop} />
          </div>
        ) : (
          <img src={block.src} alt="" className={styles.coverImg} />
        )}
      </div>
      <figcaption className={styles.caption}>
        {block.caption.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </figcaption>
    </figure>
  )
}
