export async function sendWhatsApp(
  phone: string,       // E.164 e.g. +919876543210
  templateId: string,  // Gupshup template ID
  params: string[]     // template variable substitutions in order
): Promise<void> {
  const apiKey = process.env.GUPSHUP_API_KEY
  const source = process.env.GUPSHUP_SOURCE_NUMBER
  const appName = process.env.GUPSHUP_APP_NAME

  if (!apiKey || !source || !appName) {
    throw new Error('Gupshup env vars not configured (GUPSHUP_API_KEY, GUPSHUP_SOURCE_NUMBER, GUPSHUP_APP_NAME)')
  }

  const res = await fetch('https://api.gupshup.io/sm/api/v1/template/msg', {
    method: 'POST',
    headers: {
      apikey: apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      channel: 'whatsapp',
      source,
      destination: phone,
      'src.name': appName,
      template: JSON.stringify({ id: templateId, params }),
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Gupshup error ${res.status}: ${body}`)
  }
}

/** Send "selected" notification with pass link */
export async function notifySelected(
  phone: string,
  name: string,
  passUrl: string,
  templateId: string
): Promise<void> {
  return sendWhatsApp(phone, templateId, [name, passUrl])
}

/** Send reminder notification */
export async function notifyReminder(
  phone: string,
  name: string,
  date: string,
  venue: string,
  templateId: string
): Promise<void> {
  return sendWhatsApp(phone, templateId, [name, date, venue])
}

/** Send +1 invite notification */
export async function notifyPlusOne(
  plusOnePhone: string,
  plusOneName: string,
  primaryName: string,
  passUrl: string,
  templateId: string
): Promise<void> {
  return sendWhatsApp(plusOnePhone, templateId, [plusOneName, primaryName, passUrl])
}
