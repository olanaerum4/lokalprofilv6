'use client'
import { useState } from 'react'
import Link from 'next/link'

const tutorials = [
  {
    id: 1,
    icon: '🚀',
    title: 'Kom i gang på 5 minutter',
    desc: 'Sett opp bedriften din og legg til din første kunde.',
    steps: [
      'Gå til Innstillinger og fyll inn bedriftsnavn og telefonnummer',
      'Legg inn din Google-anmeldelseslenke (finn den i Google Business Profile)',
      'Gå til Kunder og klikk "Legg til kunde"',
      'Fyll inn navn, telefonnummer, dato og tidspunkt',
      'Klikk Legg til – SMS sendes automatisk 24t og 2t før timen!',
    ],
  },
  {
    id: 2,
    icon: '📱',
    title: 'Slik fungerer SMS-flyten',
    desc: 'Hva kunden mottar og når.',
    steps: [
      '24 timer før timen: Påminnelse sendes automatisk',
      '2 timer før timen: Siste påminnelse',
      '1 time etter timen: Melding med lenke til Google-anmeldelse',
      'Kunden klikker lenken og legger igjen en anmeldelse direkte på Google',
    ],
  },
  {
    id: 3,
    icon: '✏️',
    title: 'Tilpass SMS-meldingene',
    desc: 'Gjør meldingene personlige for din bedrift.',
    steps: [
      'Gå til Innstillinger → fanen "SMS-maler"',
      'Rediger teksten i hver mal som du vil',
      'Bruk {navn} for kundens navn, {bedrift} for bedriftsnavn, {tid} for klokkeslett',
      'Forhåndsvisningen under viser nøyaktig hva kunden vil motta',
      'Klikk Lagre endringer',
    ],
  },
  {
    id: 4,
    icon: '🌟',
    title: 'Få flere Google-anmeldelser',
    desc: 'Optimaliser for maksimalt antall anmeldelser.',
    steps: [
      'Finn din Google-anmeldelseslenke: Søk etter bedriften din på Google → klikk "Skriv anmeldelse" → kopier URL',
      'Legg inn lenken i Innstillinger → Google-anmeldelseslenke',
      'Kunder med 4-5 stjerner sendes automatisk dit',
      'Tips: SMS-meldingen etter besøket er den viktigste – tilpass den gjerne',
    ],
  },
  {
    id: 5,
    icon: '❌',
    title: 'Håndter avbestillinger',
    desc: 'Kunder kan avbestille selv via lenke.',
    steps: [
      'Avbestillingslenken sendes automatisk i 24t-påminnelsen',
      'Kunden klikker lenken og bekrefter avbestilling',
      'Du ser avbestillingen umiddelbart i dashbordet og kundeoversikten',
      'Kunder som avbestiller får ikke tilsendt Google-anmeldelses-SMS',
    ],
  },
  {
    id: 6,
    icon: '📊',
    title: 'Forstå dashbordet',
    desc: 'Hva betyr alle tallene?',
    steps: [
      'Timer i dag: Antall kunder med time denne dagen (ikke avbestilte)',
      'SMS denne måneden: Teller ned mot 100 inkluderte SMS',
      'Over 100 SMS: 0,40 kr per ekstra SMS faktureres ved månedsslutt',
      'Snittkarakter: Beregnes fra alle tilbakemeldinger siste 30 dager',
      'No-show: Merk kunder som ikke møtte opp for å unngå Google-SMS',
    ],
  },
]

const faqs = [
  { q: 'Når sendes SMS-meldingene?', a: 'Systemet sjekker for meldinger som skal sendes hvert 15. minutt (via cron-job). Påminnelser sendes innenfor en 1 times margin av det angitte tidspunktet.' },
  { q: 'Hva koster ekstra SMS?', a: '0,40 kr per SMS over 100 inkluderte. Vi varsler deg på dashbordet når du nærmer deg grensen, og overskytende faktureres via e-post ved månedsslutt.' },
  { q: 'Kan jeg bruke mitt eget telefonnummer som avsender?', a: 'Ja! Legg inn ELKS_FROM_NUMBER i miljøvariablene med et 46elks-nummer du har registrert. Ta kontakt på kontakt@lokalprofil.no for hjelp.' },
  { q: 'Hva skjer om kunden ikke har mobilnummer?', a: 'SMS-utsending feiler stille – kunden mottar ingenting, og timen forblir i systemet. Sjekk alltid at nummeret er riktig format (+47...).' },
  { q: 'Kan jeg slette en kunde?', a: 'Ja, gå til Kunder → trykk søppelbøtte-ikonet på kunden → bekreft sletting. All tilhørende historikk slettes også.' },
  { q: 'Hva er faktureringsdatoen min?', a: 'Faktureringsdatoen er den dagen i måneden du registrerte deg. SMS-kvoten nullstilles automatisk på denne datoen hver måned.' },
]

export default function Hjelp() {
  const [openTutorial, setOpenTutorial] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="p-5 md:p-7 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hjelpesenter</h1>
        <p className="text-gray-400 text-sm mt-1">Alt du trenger for å komme i gang og bruke LokalProfil</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <a href="mailto:kontakt@lokalprofil.no"
          className="card flex flex-col items-center gap-2 text-center hover:border-green-200 hover:bg-green-50 transition-all cursor-pointer group">
          <span className="text-2xl">✉️</span>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">Kontakt oss</p>
          <p className="text-xs text-gray-400">kontakt@lokalprofil.no</p>
        </a>
        <Link href="/personvern"
          className="card flex flex-col items-center gap-2 text-center hover:border-green-200 hover:bg-green-50 transition-all group">
          <span className="text-2xl">🔒</span>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">Personvern</p>
          <p className="text-xs text-gray-400">GDPR & persondata</p>
        </Link>
        <Link href="/innstillinger"
          className="card flex flex-col items-center gap-2 text-center hover:border-green-200 hover:bg-green-50 transition-all group">
          <span className="text-2xl">⚙️</span>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">Innstillinger</p>
          <p className="text-xs text-gray-400">SMS-maler & oppsett</p>
        </Link>
      </div>

      {/* Tutorials */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">Tutorials</h2>
        <div className="space-y-2">
          {tutorials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenTutorial(openTutorial === t.id ? null : t.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openTutorial === t.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {openTutorial === t.id && (
                <div className="px-5 pb-5">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    {t.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">Vanlige spørsmål</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                <p className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</p>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact card */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">💬</p>
        <h3 className="font-bold text-gray-900 mb-1">Finner du ikke svaret?</h3>
        <p className="text-sm text-gray-500 mb-4">Vi svarer vanligvis innen 24 timer på hverdager.</p>
        <a href="mailto:kontakt@lokalprofil.no"
          className="btn-primary inline-block">
          Send oss en e-post →
        </a>
      </div>
    </div>
  )
}
