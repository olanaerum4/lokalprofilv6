import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'LokalProfil – Automatisk SMS-oppfølging for norske småbedrifter',
  description: 'Send automatiske SMS-påminnelser, få Google-anmeldelser og hold styr på kundene dine. For frisører, barberer, massasjeterapeuter og personlige trenere. Fra 299 kr/mnd.',
  keywords: 'SMS påminnelse, timebestilling, frisør, barberer, massasje, personlig trener, Google anmeldelse, kundeoppfølging, småbedrift, Norge',
  openGraph: {
    title: 'LokalProfil – Automatisk SMS-oppfølging',
    description: 'Aldri mer no-shows. Send automatiske SMS-påminnelser og få flere Google-anmeldelser. 7 dager gratis.',
    type: 'website',
    locale: 'nb_NO',
    siteName: 'LokalProfil',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LokalProfil – Automatisk SMS-oppfølging',
    description: 'Aldri mer no-shows. Send automatiske SMS-påminnelser og få flere Google-anmeldelser. 7 dager gratis.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://lokalprofilv6.vercel.app' },
}

// Reusable Logo SVG inline (no import needed for server component)
function Logo({ dark = false, large = false }: { dark?: boolean; large?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: large ? 12 : 8 }}>
      <svg width={large ? 48 : 32} height={large ? 48 : 32} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22c55e"/>
            <stop offset="100%" stopColor="#16a34a"/>
          </linearGradient>
        </defs>
        <path d="M10 6H36C44.837 6 52 13.163 52 22C52 30.837 44.837 38 36 38H22L10 52V38C6 38 6 35 6 32V12C6 8.686 8.686 6 12 6H10Z"
          stroke="url(#g1)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M16 18L28 26L40 18" stroke="url(#g1)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 18H40V32H16V18Z" stroke="url(#g1)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <span style={{ fontSize: large ? 28 : 18, fontWeight: 700, color: dark ? '#fff' : '#0f172a', letterSpacing: '-0.02em', fontFamily: "'DM Sans', sans-serif" }}>
        LokalProfil
      </span>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* SEO structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "LokalProfil",
        "description": "SMS-basert kundeoppfølgingstjeneste for norske småbedrifter",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "299", "priceCurrency": "NOK", "priceValidUntil": "2027-01-01" },
        "url": "https://lokalprofilv6.vercel.app",
        "inLanguage": "nb",
      })}} />

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <a href="#fordeler" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Fordeler</a>
            <a href="#slik-fungerer-det" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Slik fungerer det</a>
            <a href="#pris" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Pris</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors hidden md:block">Logg inn</Link>
            <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-green-200">
              Start gratis →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 pb-28 px-5 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
            7 dager gratis – ingen kredittkort nødvendig
          </div>
          <h1 className="text-5xl md:text-[64px] font-bold text-gray-900 leading-[1.05] tracking-tight mb-6">
            Aldri mer<br/>
            <span className="text-green-600">no-shows.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            LokalProfil sender automatiske SMS-påminnelser til kundene dine – og sørger for at fornøyde kunder legger igjen Google-anmeldelser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold px-9 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-green-200/60 w-full sm:w-auto">
              Kom i gang gratis →
            </Link>
            <a href="#slik-fungerer-det" className="text-gray-500 hover:text-gray-900 font-semibold px-6 py-4 rounded-2xl border border-gray-200 hover:border-gray-400 transition-all text-sm w-full sm:w-auto text-center">
              Se hvordan det fungerer ↓
            </a>
          </div>
          <p className="text-xs text-gray-400">Ingen kredittkort · Avbryt når som helst · Norsk support</p>
        </div>

        {/* Hero stats */}
        <div className="max-w-2xl mx-auto mt-16 grid grid-cols-3 gap-6">
          {[
            { num: '40%', label: 'færre no-shows i gjennomsnitt' },
            { num: '3×', label: 'flere Google-anmeldelser' },
            { num: '5 min', label: 'oppsett – ingen tech-kunnskap' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900">{s.num}</p>
              <p className="text-xs text-gray-400 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-6 border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {['✂️ Frisører', '💈 Barberer', '💆 Massasjeterapeuter', '🏋️ Personlige trenere', '💅 Nagelstudio', '🧖 Hudpleie'].map(item => (
            <span key={item} className="text-sm text-gray-500 font-medium">{item}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="fordeler" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-3">Fordeler</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Alt du trenger på ett sted</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">Sett opp én gang – systemet gjør resten automatisk mens du fokuserer på kundene dine.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: '⏰',
                title: 'Automatiske SMS-påminnelser',
                desc: 'Kunder mottar påminnelse 24 timer og 2 timer før timen – automatisk. Ingen manuell oppfølging nødvendig.',
                highlight: true,
              },
              {
                icon: '🌟',
                title: 'Flere Google-anmeldelser',
                desc: 'Etter hvert besøk sendes en melding med din Google-anmeldelseslenke. Fornøyde kunder anmelder – med ett klikk.',
              },
              {
                icon: '📱',
                title: 'Meldingsboks',
                desc: 'Send SMS direkte til kunder fra dashbordet. Full historikk per kunde.',
              },
              {
                icon: '💬',
                title: 'Send SMS direkte',
                desc: 'Meldingsboks med full historikk per kunde. Send og motta SMS direkte fra nettleseren.',
              },
              {
                icon: '✏️',
                title: 'Redigerbare maler',
                desc: 'Tilpass alle SMS-meldinger til din bedrift. Live-forhåndsvisning mens du skriver.',
              },
              {
                icon: '📊',
                title: 'Oversikt og statistikk',
                desc: 'Dashboard med timeplan, no-show-rate, avbestillinger og SMS-forbruk. Eksporter til CSV.',
              },
            ].map(f => (
              <div key={f.title} className={`rounded-2xl p-6 ${f.highlight ? 'bg-green-600 text-white' : 'bg-white border border-gray-100 hover:border-green-200 hover:shadow-sm'} transition-all`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className={`font-bold mb-2 ${f.highlight ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${f.highlight ? 'text-green-100' : 'text-gray-500'}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="slik-fungerer-det" className="py-24 px-5 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-3">Slik fungerer det</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Fra booking til anmeldelse – automatisk</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { step: '01', title: 'Legg til kunde', desc: 'Navn, telefonnummer og tidspunkt. Tar 10 sekunder – og alt annet skjer automatisk.' },
                { step: '02', title: 'Påminnelser sendes', desc: 'Kunden mottar SMS 24t og 2t før timen med en enkel avbestillingslenke.' },
                { step: '03', title: 'Hent inn anmeldelser', desc: '1 time etter besøket sendes lenke til Google-anmeldelse. Fornøyde kunder klikker og anmelder.' },
              ].map(s => (
                <div key={s.step} className="flex gap-5">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0 border border-green-200">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SMS preview */}
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Eksempel på SMS-flyt</p>
              <div className="space-y-3">
                {[
                  { label: '24t før', msg: 'Hei Kari! Påminnelse om din time hos Hansens Frisør i morgen kl 10:00.', out: true },
                  { label: '2t før', msg: 'Hei Kari! Din time hos Hansens Frisør er om 2 timer (kl 10:00). Vi gleder oss til å se deg! 😊', out: true },
                  { label: '1t etter', msg: 'Hei Kari! Takk for besøket hos Hansens Frisør 😊 Det ville betydd mye om du la igjen en anmeldelse: g.page/r/...', out: true },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full self-start mt-1 flex-shrink-0">{item.label}</span>
                    <div className="bg-green-50 border border-green-100 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-gray-700 font-mono leading-relaxed flex-1 whitespace-pre-line">
                      {item.msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / TRUST */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'Kundene mine husker timene sine mye bedre nå. Har nesten eliminert no-shows.', name: 'Frisørsalong, Trondheim' },
              { quote: 'Fikk 12 nye Google-anmeldelser den første måneden. Utrolig enkelt å sette opp.', name: 'Massasjeterapeut, Oslo' },
              { quote: 'Sparer meg for 30 minutter med manuell oppfølging hver eneste dag.', name: 'Personlig trener, Bergen' },
            ].map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">"{t.quote}"</p>
                <p className="text-xs text-gray-400 font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pris" className="py-24 px-5 bg-gray-50">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-3">Pris</p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Én plan. Alt inkludert.</h2>
          <p className="text-gray-500 mb-12">Ingen skjulte kostnader. Ingen valg du må ta.</p>

          <div className="bg-green-600 rounded-3xl p-10 text-white shadow-2xl shadow-green-300/40">
            <div className="mb-2">
              <span className="text-7xl font-bold tracking-tight">299</span>
              <span className="text-2xl font-medium text-green-200"> kr/mnd</span>
            </div>
            <p className="text-green-200 text-sm mb-8">100 SMS inkludert · 0,40 kr per ekstra SMS</p>

            <ul className="space-y-3 mb-10 text-left max-w-xs mx-auto">
              {[
                '100 SMS inkludert per måned',
                'Automatiske påminnelser (24t og 2t)',
                'Google-anmeldelseslenke etter besøk',
                'Avbestillingslenke i SMS',
                'Redigerbare SMS-maler',
                'Meldingsboks og kundehistorikk',
                'Statistikk og CSV-eksport',
                'AI-drevet kundesupport',
                'Ubegrenset antall kunder',
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-green-100">
                  <svg className="w-4 h-4 flex-shrink-0 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register" className="block w-full bg-white text-green-700 font-bold py-4 rounded-2xl text-base hover:bg-green-50 transition-colors text-center">
              Start 7 dager gratis →
            </Link>
            <p className="text-green-300 text-xs mt-4">Ingen kredittkort · Ingen bindingstid · Avbryt når som helst</p>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Trenger du mer enn 100 SMS/mnd?{' '}
            <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline font-semibold">Kontakt oss</a>
          </p>
        </div>
      </section>

      {/* FAQ for SEO */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Ofte stilte spørsmål</h2>
          <div className="space-y-4">
            {[
              { q: 'Hva er LokalProfil?', a: 'LokalProfil er en SMS-basert kundeoppfølgingstjeneste for norske småbedrifter. Vi sender automatiske påminnelser og Google-anmeldelseslenker til kundene dine via SMS.' },
              { q: 'Hvilke bedrifter passer LokalProfil for?', a: 'LokalProfil er laget for bedrifter med timebestillinger: frisører, barberer, massasjeterapeuter, personlige trenere, nagelstudio, hudpleie og lignende.' },
              { q: 'Trenger jeg teknisk kunnskap?', a: 'Nei! Du er klar på under 5 minutter. Ingen koding, ingen komplisert oppsett – bare legg inn bedriftsnavn, Google-lenke og legg til din første kunde.' },
              { q: 'Hva koster SMS utover kvoten?', a: '0,40 kr per SMS over 100 inkluderte. Du ser forbruket ditt i dashbordet og får varsel når du nærmer deg grensen. Overskytende faktureres månedlig.' },
              { q: 'Er tjenesten GDPR-compliant?', a: 'Ja. Data lagres i EU (Supabase), SMS sendes via 46elks (svensk selskap). Vi er behandlingsansvarlig og har full personvernerklæring tilgjengelig.' },
            ].map(faq => (
              <details key={faq.q} className="bg-gray-50 rounded-2xl border border-gray-100 group">
                <summary className="px-5 py-4 text-sm font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <Logo dark large />
          <h2 className="text-4xl font-bold text-white tracking-tight mt-8 mb-4">
            Klar til å sende din første SMS?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">Kom i gang på 5 minutter. Helt gratis i 7 dager.</p>
          <Link href="/register" className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-10 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-green-900/50">
            Start gratis prøveperiode →
          </Link>
          <p className="text-gray-600 text-sm mt-4">Ingen kredittkort · Norsk support · kontakt@lokalprofil.no</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-5 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <a href="mailto:kontakt@lokalprofil.no" className="hover:text-gray-700 transition-colors">kontakt@lokalprofil.no</a>
            <Link href="/personvern" className="hover:text-gray-700 transition-colors">Personvern</Link>
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <Link href="/login" className="hover:text-gray-700 transition-colors">Logg inn</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 LokalProfil</p>
        </div>
      </footer>
    </div>
  )
}
