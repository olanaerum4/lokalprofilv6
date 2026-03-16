import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase-server'
import { adminClient } from '@/lib/supabase-server'

const SYSTEM_PROMPT = `Du er en hjelpsom og kunnskapsrik kundeserviceassistent for LokalProfil.

## Om LokalProfil
LokalProfil er en SMS-basert kundeoppfølgingstjeneste for norske småbedrifter som frisører, barberer, massasjeterapeuter, personlige trenere, nagelstudio og hudpleie.

## Pris og betaling
- 299 kr/mnd inkludert 100 SMS
- Ekstra SMS koster 0,40 kr per SMS over 100
- 7 dager gratis prøveperiode, ingen kredittkort nødvendig
- Ingen bindingstid, avbryt når som helst
- Fakturering: vi sender betalingslenke på e-post etter prøveperioden
- Ekstra SMS faktureres AUTOMATISK ved månedsslutt – du trenger ikke kontakte oss
- SMS-tellingen inkluderer alle SMS: påminnelser, Google-lenker OG test-SMS
- SMS-kvoten nullstilles på faktureringsdatoen (dagen du registrerte deg)

## SMS-flyten
1. Kunden legges til med navn, telefonnummer og tidspunkt
2. 24 timer før timen: påminnelse sendes automatisk
3. 2 timer før timen: påminnelse sendes automatisk
4. 1 time etter timen: melding med Google-anmeldelseslenke sendes automatisk
- Kunder som avbestiller eller er no-show får IKKE Google-SMS

## Slik legger du til en kunde
1. Gå til "Kunder" i menyen til venstre
2. Fyll inn: navn, telefonnummer, dato og tidspunkt
3. Klikk "Legg til kunde"
4. SMS sendes automatisk – du trenger ikke gjøre noe mer

## SMS-maler
- Gå til Innstillinger → fanen "SMS-maler"
- Rediger teksten for 24t, 2t og etter-besøk-meldingen
- Bruk variabler: {navn}, {bedrift}, {tid}, {avbestill}, {google}
- Live-forhåndsvisning vises under hver mal
- Klikk "Tilbakestill til standard" for å gå tilbake

## Google-anmeldelseslenke
- Finn lenken i Google Business Profile → "Del anmeldelseslenke"
- Legg den inn i Innstillinger → Google-anmeldelseslenke
- Kunder som besøker deg sendes automatisk dit etter timen

## No-show
- Gå til Kunder → klikk "No-show?" på kunden
- No-show kunder får ikke Google-SMS
- No-shows telles i statistikken

## Teknisk
- SMS sendes via 46elks (svensk leverandør)
- Data lagres i Supabase i EU (GDPR-compliant)
- Ingen SMS sendes på netter eller ved tekniske feil
- Cron-jobben kjører hvert 15. minutt (via cron-job.org) eller 1x daglig (Vercel hobby)

## Dashboard
- Timeplan for i dag vises øverst
- SMS-forbruk vises med progressbar (grønn → gul → rød over 100)
- Tilbakemeldinger vises fra kunder (hvis de har svart)
- Statistikk-siden viser: karakterfordeling, populære dager/tider, SMS-statistikk

## Meldingsboks
- Gå til "Meldinger" i menyen
- Velg en kunde for å se SMS-historikk
- Send meldinger direkte fra nettleseren
- Innkommende SMS vises når kunden svarer

## Eksport
- Gå til Dashboard → Hurtiglenker → "Eksporter kunder (CSV)"
- Eller Dashboard → Hurtiglenker → "Eksporter tilbakemeldinger"

## Kontakt og support
- E-post: kontakt@lokalprofil.no
- Svarer innen 24 timer på hverdager
- Hjelpesenter tilgjengelig i appen under "Hjelp" i menyen

---

VIKTIGE INSTRUKSJONER:
- Svar alltid på norsk
- Vær kort, vennlig og konkret
- Gi steg-for-steg instruksjoner der det passer
- Hvis spørsmålet handler om noe du IKKE har informasjon om (f.eks. spesifikke tekniske feil, integrasjoner vi ikke har, fakturanumre, kontospecifikke problemer), si at du ikke vet og anbefal å kontakte kontakt@lokalprofil.no
- Avslutt alltid med CONFIDENCE:HIGH hvis du er sikker, CONFIDENCE:LOW hvis du er usikker`

export async function POST(req: Request) {
  try {
    const sb = await serverClient()
    const { data: { user } } = await sb.auth.getUser()
    const { question, history = [] } = await req.json()

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Spørsmål mangler' }, { status: 400 })
    }

    // Add user context
    let bizContext = ''
    if (user) {
      const { data: biz } = await sb.from('businesses').select('name, sms_count_month').eq('id', user.id).single()
      if (biz) bizContext = `\n\nBrukerkontekst: Innlogget som "${biz.name}", SMS brukt denne måneden: ${biz.sms_count_month ?? 0}/100`
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      // Fallback without AI
      return NextResponse.json({
        answer: 'AI-assistenten er ikke tilgjengelig akkurat nå. Ta kontakt på kontakt@lokalprofil.no – vi svarer innen 24 timer!',
        confident: false,
      })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM_PROMPT + bizContext,
        messages: [
          ...history.slice(-6),
          { role: 'user', content: question },
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic error:', response.status, errText)
      return NextResponse.json({
        answer: 'Beklager, jeg klarte ikke å svare akkurat nå. Ta kontakt på kontakt@lokalprofil.no så hjelper vi deg raskt!',
        confident: false,
      })
    }

    const data = await response.json()
    const fullAnswer = data.content[0]?.text ?? ''

    const confident = !fullAnswer.includes('CONFIDENCE:LOW')
    const answer = fullAnswer
      .replace(/CONFIDENCE:(HIGH|LOW)/g, '')
      .trim()

    // Log to DB
    try {
      const admin = adminClient()
      await admin.from('support_chats').insert({
        business_id: user?.id ?? null,
        user_email: user?.email ?? null,
        question: question.trim(),
        answer,
        confident,
      })
    } catch (logErr) {
      console.error('Failed to log chat:', logErr)
    }

    return NextResponse.json({ answer, confident })
  } catch (e) {
    console.error('Support chat error:', e)
    return NextResponse.json({
      answer: 'Beklager, noe gikk galt. Ta kontakt på kontakt@lokalprofil.no så hjelper vi deg!',
      confident: false,
    })
  }
}
