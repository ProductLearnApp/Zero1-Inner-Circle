'use client'

import { useEffect, useState } from 'react'

interface Props {
  payload: string
  size?: number
}

export default function QRCodeDisplay({ payload, size = 240 }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(payload, {
        width: size,
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      }).then(url => {
        if (!cancelled) setDataUrl(url)
      })
    })
    return () => { cancelled = true }
  }, [payload, size])

  if (!dataUrl) {
    return (
      <div className="rounded-xl bg-white flex items-center justify-center"
        style={{ width: size, height: size }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin border-gray-300" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} alt="QR Code" width={size} height={size}
      className="rounded-xl" />
  )
}
