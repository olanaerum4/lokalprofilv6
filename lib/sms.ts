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

export const sms = {
  reminder24h: (name: string, biz: string, time: string, cancelUrl: string) =>
    `Hei ${name}! Påminnelse om din time hos ${biz} i morgen kl ${time}.\nAvbestill her: ${cancelUrl}`,

  reminder2h: (name: string, biz: string, time: string) =>
    `Hei ${name}! Din time hos ${biz} er om 2 timer (kl ${time}). Vi gleder oss til å se deg! 😊`,

  // MVP: send Google review link directly after appointment
  reviewRequest: (name: string, biz: string, reviewLink: string) =>
    `Hei ${name}! Takk for besøket hos ${biz} i dag 😊 Det ville betydd mye om du la igjen en anmeldelse her: ${reviewLink}`,

  // Fallback if no Google link set
  reviewRequestNoLink: (name: string, biz: string) =>
    `Hei ${name}! Takk for besøket hos ${biz} i dag 😊 Vi håper du var fornøyd!`,
}

export function fmtTime(ts: string) {
  return new Date(ts).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
}

export function cancelUrl(token: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/avbestill/${token}`
}
