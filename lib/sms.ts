// Sanitize business name to valid 46elks alphanumeric sender (3-11 chars, letters/digits only)
export function toSenderName(name: string | null | undefined): string {
  if (!name) return 'LokalProfil'
  const cleaned = name
    .replace(/[æÆ]/g, 'ae')
    .replace(/[øØ]/g, 'o')
    .replace(/[åÅ]/g, 'a')
    .replace(/[^a-zA-Z0-9 ]/g, '')  // remove special chars
    .replace(/\s+/g, '')             // remove spaces
    .substring(0, 11)                // max 11 chars
  return cleaned.length >= 3 ? cleaned : 'LokalProfil'
}

export async function sendSMS(to: string, message: string, from?: string): Promise<{ ok: boolean; error?: string }> {
  const u = process.env.ELKS_USERNAME!
  const p = process.env.ELKS_PASSWORD!
  const sender = from ?? process.env.ELKS_FROM_NUMBER ?? 'LokalProfil'

  if (!u || !p) return { ok: false, error: 'ELKS_USERNAME eller ELKS_PASSWORD mangler' }

  try {
    const r = await fetch('https://api.46elks.com/a1/sms', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${u}:${p}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ from: sender, to, message }),
    })
    if (!r.ok) {
      const text = await r.text()
      return { ok: false, error: `46elks feil ${r.status}: ${text}` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

export const DEFAULT_TEMPLATES = {
  reminder24h: 'Hei {navn}! Påminnelse om din time hos {bedrift} i morgen kl {tid}.',
  reminder2h: 'Hei {navn}! Din time hos {bedrift} er om 2 timer (kl {tid}). Vi gleder oss til å se deg! 😊',
  afterAppointment: 'Hei {navn}! Takk for besøket hos {bedrift} i dag 😊 Det ville betydd mye om du la igjen en anmeldelse: {google}',
  afterAppointmentNoLink: 'Hei {navn}! Takk for besøket hos {bedrift} i dag 😊 Vi håper du var fornøyd!',
}

export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`)
}

export function buildReminder24h(custom: string | null, name: string, biz: string, time: string): string {
  return fillTemplate(custom || DEFAULT_TEMPLATES.reminder24h, { navn: name, bedrift: biz, tid: time })
}

export function buildReminder2h(custom: string | null, name: string, biz: string, time: string): string {
  return fillTemplate(custom || DEFAULT_TEMPLATES.reminder2h, { navn: name, bedrift: biz, tid: time })
}

export function buildAfterAppointment(custom: string | null, name: string, biz: string, reviewLink: string | null): string {
  if (reviewLink) {
    return fillTemplate(custom || DEFAULT_TEMPLATES.afterAppointment, { navn: name, bedrift: biz, google: reviewLink })
  }
  return fillTemplate(custom || DEFAULT_TEMPLATES.afterAppointmentNoLink, { navn: name, bedrift: biz })
}

export function fmtTime(ts: string) {
  return new Date(ts).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
}
