import { PASS_ASSETS } from '@/lib/passAssets'
import styles from './EventMetaRow.module.css'

type Props = {
  date: string
  time: string
  location: string
}

export function EventMetaRow({ date, time, location }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.mobileLayout}>
        <div className={styles.mobileRow1}>
          <div className={styles.item}>
            <div className={styles.iconSm}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PASS_ASSETS.calendarIcon} alt="" className={styles.iconImgInset} />
            </div>
            <span className={styles.textSm}>{date}</span>
          </div>
          <div className={styles.item}>
            <div className={styles.iconSm}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PASS_ASSETS.clockIcon} alt="" className={styles.iconImgInset} />
            </div>
            <span className={styles.textSm}>{time}</span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.iconSm}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PASS_ASSETS.pinIcon} alt="" className={styles.iconImgFull} />
          </div>
          <span className={styles.textSm}>{location}</span>
        </div>
      </div>

      {/* ── Desktop: grid-stacking layout (Figma node 5903:119) ── */}
      <div className={styles.desktopLayout}>
        <div className={`${styles.item} ${styles.itemDate}`}>
          <div className={styles.iconLg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PASS_ASSETS.calendarIcon} alt="" className={styles.iconImgInset} />
          </div>
          <span className={styles.textLg}>{date}</span>
        </div>
        <div className={`${styles.item} ${styles.itemLocation}`}>
          <div className={styles.iconLg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PASS_ASSETS.pinIcon} alt="" className={styles.iconImgFull} />
          </div>
          <span className={styles.textLg}>{location}</span>
        </div>
        <div className={`${styles.item} ${styles.itemTime}`}>
          <div className={styles.iconLg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PASS_ASSETS.clockIcon} alt="" className={styles.iconImgInset} />
          </div>
          <span className={styles.textLg}>{time}</span>
        </div>
      </div>
    </div>
  )
}
