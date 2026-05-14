import Image from 'next/image'
import { PASS_ASSETS } from '@/lib/passAssets'
import styles from './MapsPreview.module.css'

type Props = {
  mapImageUrl?: string
  /** When provided the entire thumbnail becomes a link opening the coordinates in Maps */
  href?: string
}

export function MapsPreview({ mapImageUrl, href }: Props) {
  const inner = (
    <>
      <div className={styles.bgWrap}>
        <Image
          src={mapImageUrl ?? PASS_ASSETS.mapsPreview}
          alt="Map of event venue"
          fill
          className={styles.bg}
          unoptimized
        />
      </div>
      <div className={styles.chip}>
        <span className={styles.chipDot} aria-hidden="true">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4" fill="#34A853" />
          </svg>
        </span>
        <span className={styles.chipText}>Maps</span>
      </div>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.container} ${styles.containerLink}`}
        aria-label="Open venue in Maps"
      >
        {inner}
      </a>
    )
  }

  return <div className={styles.container}>{inner}</div>
}
