import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://zero1byzerodha.com/inner-circle'),
  title: 'Zero1 Inner Circle',
  description: 'An offline community to solve REAL personal finance problems',
  openGraph: {
    title: 'Zero1 Inner Circle',
    description: 'An offline community to solve REAL personal finance problems',
    url: 'https://zero1byzerodha.com/inner-circle',
    siteName: 'Zero1 Inner Circle',
    images: [{ url: 'https://zero1byzerodha.com/inner-circle/opengraph-image', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero1 Inner Circle',
    description: 'An offline community to solve REAL personal finance problems',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
