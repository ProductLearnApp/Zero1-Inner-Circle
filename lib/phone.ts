/** Normalize a phone number to E.164 format (+91XXXXXXXXXX for Indian numbers) */
export function normalizePhone(raw: string): string | null {
  // Strip all non-digit characters except leading +
  const stripped = raw.replace(/[^\d+]/g, '')

  // Already E.164 with country code
  if (/^\+\d{10,15}$/.test(stripped)) return stripped

  // Digits only — assume Indian (+91) if 10 digits
  if (/^\d{10}$/.test(stripped)) return `+91${stripped}`

  // 91 prefix without +
  if (/^91\d{10}$/.test(stripped)) return `+${stripped}`

  // 0-prefixed 11-digit Indian number (e.g. 09876543210 → +919876543210)
  if (/^0\d{10}$/.test(stripped)) return `+91${stripped.slice(1)}`

  return null
}
