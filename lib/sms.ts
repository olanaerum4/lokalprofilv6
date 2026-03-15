export async function sendSMS(to: string, message: string) {
  const u = process.env.ELKS_USERNAME!
  const p = process.env.ELKS_PASSWORD!
  try {
    const r = await fetch('https://api.46elks.com/a1/sms', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${u}:${p}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        from: 'LokalProfil', to, message,
        whenreply: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`,
      }),
    })
    return r.ok
  } catch { return false }
}

export const sms = {
  reminder24h: (name: string, biz: string, time: string, cancelUrl: string) =>
    `Hei ${name}! Påminnelse om din time hos ${biz} i morgen kl ${time}.\nAvbestill her: ${cancelUrl}`,
  reminder2h: (name: string, biz: string, time: string) =>
    `Hei ${name}! Din time hos ${biz} er om 2 timer (kl ${time}). Vi gleder oss til å se deg! 😊`,
  reviewRequest: (name: string, biz: string) =>
    `Hei ${name}! Takk for besøket hos ${biz} i dag 😊 Hvordan var opplevelsen?\n1=Dårlig 2=OK 3=Bra 4=Veldig bra 5=Fantastisk`,
  positive: (link: string) =>
    `Så glad du er fornøyd! 🌟 Det hadde betydd mye om du la igjen en anmeldelse: ${link}`,
  negative: () =>
    `Det er leit å høre! Vi ønsker å bli bedre. Hva kan vi gjøre annerledes? Svar på denne meldingen.`,
}

export function fmtTime(ts: string) {
  return new Date(ts).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
}

export function cancelUrl(token: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/avbestill/${token}`
}
