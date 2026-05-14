'use client'

import { QRCodeSVG } from 'qrcode.react'
import type { QRConfig } from '@/types/pass'
import styles from './QRCode.module.css'

type Props = QRConfig & {
  className?: string
}

export function QRCode({
  value,
  size = 160,
  fgColor = '#000000',
  bgColor = '#ffffff',
  level = 'M',
  logoUrl,
  className,
}: Props) {
  const imageSettings = logoUrl
    ? { src: logoUrl, width: size * 0.2, height: size * 0.2, excavate: true }
    : undefined

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`} style={{ width: size, height: size }}>
      <QRCodeSVG
        value={value}
        size={size}
        fgColor={fgColor}
        bgColor={bgColor}
        level={level}
        imageSettings={imageSettings}
      />
    </div>
  )
}
