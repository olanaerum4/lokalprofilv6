export async function sendSMS(to: string, message: string): Promise<{ ok: boolean; error?: string }> {
  const u = process.env.ELKS_USERNAME!
  const p = process.env.ELKS_PASSWORD!
  const from = process.env.ELKS_FROM_NUMBER || 'LokalProfil'

  if (!u || !p) return { ok: false, error: 'ELKS_USERNAME eller ELKS_PASSWORD mangler' }

  try {
    const r = await fetch('https://api.46elks.com/a1/sms', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${u}:${p}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ from, to, message }),
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

// Default templates
export const DEFAULT_TEMPLATES = {
  reminder24h: 'Hei {navn}! Påminnelse om din time hos {bedrift} i morgen kl {tid}.\nAvbestill her: {avbestill}',
  reminder2h: 'Hei {navn}! Din time hos {bedrift} er om 2 timer (kl {tid}). Vi gleder oss til å se deg! 😊',
  afterAppointment: 'Hei {navn}! Takk for besøket hos {bedrift} i dag 😊 Det ville betydd mye om du la igjen en anmeldelse: {google}',
  afterAppointmentNoLink: 'Hei {navn}! Takk for besøket hos {bedrift} i dag 😊 Vi håper du var fornøyd!',
}

// Replace variables in template
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`)
}

export function buildReminder24h(
  custom: string | null,
  name: string, biz: string, time: string, cancelLink: string
): string {
  const tpl = custom || DEFAULT_TEMPLATES.reminder24h
  return fillTemplate(tpl, { navn: name, bedrift: biz, tid: time, avbestill: cancelLink })
}

export function buildReminder2h(
  custom: string | null,
  name: string, biz: string, time: string
): string {
  const tpl = custom || DEFAULT_TEMPLATES.reminder2h
  return fillTemplate(tpl, { navn: name, bedrift: biz, tid: time })
}

export function buildAfterAppointment(
  custom: string | null,
  name: string, biz: string, reviewLink: string | null
): string {
  if (reviewLink) {
    const tpl = custom || DEFAULT_TEMPLATES.afterAppointment
    return fillTemplate(tpl, { navn: name, bedrift: biz, google: reviewLink })
  } else {
    const tpl = custom || DEFAULT_TEMPLATES.afterAppointmentNoLink
    return fillTemplate(tpl, { navn: name, bedrift: biz })
  }
}

export function fmtTime(ts: string) {
  return new Date(ts).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
}

export function cancelUrl(token: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/avbestill/${token}`
}
