'use client'

import { useState, useRef, useCallback } from 'react'
import { PASS_ASSETS } from '@/lib/passAssets'
import { QRCode } from '@/components/pass/qr/QRCode'
import type { QRConfig } from '@/types/pass'
import styles from './TicketCard.module.css'

type Pass = {
  qrConfig: QRConfig
  label: string
}

type Props = {
  passes: [Pass, Pass?]
  showPager?: boolean
  confirmed?: boolean
}

export function TicketCard({ passes, showPager = false, confirmed = false }: Props) {
  const hasTwoPasses = passes.length === 2 && passes[1] != null
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const el = carouselRef.current
    if (!el) return
    setActiveIndex(Math.round(el.scrollLeft / el.offsetWidth))
  }, [])

  const validPasses = passes.filter((p): p is Pass => p != null)

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card}${confirmed ? ` ${styles.cardConfirmed}` : ''}`}>

        {/* Ticket background shape — static */}
        <div
          className={`${styles.ticketBg}${confirmed ? ` ${styles.ticketBgConfirmed}` : ''}`}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PASS_ASSETS.ticketUnionMobile} alt="" className={styles.ticketBgMobile} />
        </div>

        {/* Branding — static, never scrolls */}
        <div className={styles.branding}>
          <div className={styles.brandRow}>
            <div className={styles.logoWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PASS_ASSETS.zero1Logo} alt="ZERO1" className={styles.logoImg} />
            </div>
            <span className={styles.presents}>presents</span>
          </div>
          <div className={styles.eventTitleWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PASS_ASSETS.eventTitle} alt="The Inner Circle" className={styles.eventTitleImg} />
          </div>
        </div>

        {/* QR area — carousel only when two passes, otherwise static */}
        {hasTwoPasses ? (
          <div
            ref={carouselRef}
            className={styles.qrCarousel}
            onScroll={handleScroll}
          >
            {validPasses.map((pass, i) => (
              <div key={i} className={styles.qrSlide}>
                <QRCode
                  value={pass.qrConfig.value}
                  size={160}
                  fgColor={pass.qrConfig.fgColor}
                  bgColor={pass.qrConfig.bgColor}
                  level={pass.qrConfig.level}
                  logoUrl={pass.qrConfig.logoUrl}
                />
                <button className={styles.downloadBtn} aria-label="Download pass" type="button">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PASS_ASSETS.downloadIcon} alt="" className={styles.downloadIcon} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.qrArea}>
            <div className={styles.qrBlock}>
              <QRCode
                value={passes[0].qrConfig.value}
                size={160}
                fgColor={passes[0].qrConfig.fgColor}
                bgColor={passes[0].qrConfig.bgColor}
                level={passes[0].qrConfig.level}
                logoUrl={passes[0].qrConfig.logoUrl}
              />
            </div>
            <button className={styles.downloadBtn} aria-label="Download pass" type="button">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PASS_ASSETS.downloadIcon} alt="" className={styles.downloadIcon} />
            </button>
          </div>
        )}

        {/* Pager — updates label as QR slides */}
        {showPager && hasTwoPasses && (
          <div className={styles.pager}>
            <div className={styles.pagerDots}>
              {validPasses.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot}${i === activeIndex ? ` ${styles.dotActive}` : ''}`}
                />
              ))}
            </div>
            <span className={styles.pagerLabel}>
              Pass {activeIndex + 1}/{validPasses.length}
            </span>
          </div>
        )}

      </div>
    </div>
  )
}
