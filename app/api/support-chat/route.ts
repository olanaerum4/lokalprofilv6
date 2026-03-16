import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase-server'
import { adminClient } from '@/lib/supabase-server'

const SYSTEM_PROMPT = `Du er en hjelpsom kundeserviceassistent for LokalProfil – en SMS-basert kundeoppfølgingstjeneste for norske småbedrifter (frisører, barberer, massasjeterapeuter, personlige trenere osv.).

LokalProfil sender automatisk SMS-påminnelser 24t og 2t før timebestillinger, og sender Google-anmeldelseslenke 1t etter besøket.

Pris: 299 kr/mnd inkl. 100 SMS. Ekstra SMS koster 0,40 kr/stk. 7 dager gratis prøveperiode, ingen kredittkort.

Funksjoner:
- Automatiske SMS-påminnelser (24t og 2t før)
- Google-anmeldelseslenke etter besøk
- Avbestillingslenke i SMS
- Redigerbare SMS-maler
- Meldingsboks (send/motta SMS)
- No-show markering
- CSV-eksport av kunder og tilbakemeldinger
- Dashboard med statistikk

Teknisk:
- SMS sendes via 46elks
- Data lagres i Supabase (GDPR-compliant, EU)
- Kontakt: kontakt@lokalprofil.no

Svar alltid på norsk, vær kortfattet og vennlig. Hvis du er usikker på svaret, si at du er usikker og anbefal å kontakte support.

VIKTIG: Avslutt svaret ditt med CONFIDENCE:HIGH eller CONFIDENCE:LOW basert på om du er sikker på svaret. LOW hvis spørsmålet er utenfor din kunnskap om LokalProfil.`

export async function POST(req: Request) {
  try {
    const sb = await serverClient()
    const { data: { user } } = await sb.auth.getUser()
    const { question, history = [] } = await req.json()

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Spørsmål mangler' }, { status: 400 })
    }

    // Get business info for context
    let bizContext = ''
    if (user) {
      const { data: biz } = await sb.from('businesses').select('name, sms_count_month').eq('id', user.id).single()
      if (biz) bizContext = `\n\nBrukerkontekst: Bedrift "${biz.name}", SMS brukt denne måneden: ${biz.sms_count_month ?? 0}/100`
    }

    const messages = [
      ...history.slice(-6).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: question },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT + bizContext,
        messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic error: ${response.status}`)
    }

    const data = await response.json()
    const fullAnswer = data.content[0]?.text ?? 'Beklager, jeg kunne ikke svare på det spørsmålet.'

    // Parse confidence
    const confident = !fullAnswer.includes('CONFIDENCE:LOW')
    const answer = fullAnswer
      .replace('CONFIDENCE:HIGH', '')
      .replace('CONFIDENCE:LOW', '')
      .trim()

    // Log to DB
    const admin = adminClient()
    await admin.from('support_chats').insert({
      business_id: user?.id ?? null,
      user_email: user?.email ?? null,
      question: question.trim(),
      answer,
      confident,
    })

    return NextResponse.json({ answer, confident })
  } catch (e) {
    console.error('Support chat error:', e)
    return NextResponse.json({
      answer: 'Beklager, noe gikk galt. Ta kontakt på kontakt@lokalprofil.no så hjelper vi deg.',
      confident: false,
    })
  }
}
