import jwt from 'jsonwebtoken'
import QRCode from 'qrcode'

export type QRPayload = {
  attendeeId: string
  eventId: string
  passType: 'primary' | 'plusone'
  name: string
  seatLabel: string
  issuedAt: number
}

export function generateQRPayload(data: Omit<QRPayload, 'issuedAt'>): string {
  const secret = process.env.QR_SECRET
  if (!secret) throw new Error('QR_SECRET not configured')
  return jwt.sign(
    { ...data, issuedAt: Date.now() },
    secret,
    { algorithm: 'HS256' }
    // No expiry — revocation is via checkedIn flag in DB
  )
}

export async function generateQRCodeImage(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    width: 280,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  })
}

export function verifyQRPayload(token: string): QRPayload {
  const secret = process.env.QR_SECRET
  if (!secret) throw new Error('QR_SECRET not configured')
  return jwt.verify(token, secret, { algorithms: ['HS256'] }) as QRPayload
}
