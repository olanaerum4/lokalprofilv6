import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'LokalProfil – Automatisk SMS-oppfølging for norske småbedrifter',
  description: 'Send automatiske SMS-påminnelser, få Google-anmeldelser og hold styr på kundene dine. For frisører, barberer, massasjeterapeuter og personlige trenere. Fra 299 kr/mnd.',
  keywords: 'SMS påminnelse, timebestilling, frisør, barberer, massasje, personlig trener, Google anmeldelse, kundeoppfølging, småbedrift, Norge',
  openGraph: {
    title: 'LokalProfil – Automatisk SMS-oppfølging',
    description: 'La systemet følge opp kundene. Du fokuserer på jobben.',
    type: 'website',
    locale: 'nb_NO',
    siteName: 'LokalProfil',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://lokalprofil.no' },
}

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
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "LokalProfil",
        "description": "SMS-basert kundeoppfølgingstjeneste for norske småbedrifter",
        "applicationCategory": "BusinessApplication",
        "offers": { "@type": "Offer", "price": "299", "priceCurrency": "NOK" },
        "url": "https://lokalprofil.no",
        "inLanguage": "nb",
      })}} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.35s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.5s ease both; }
        .float { animation: float 4s ease-in-out infinite; }
        .float-delayed { animation: float 4s 1.5s ease-in-out infinite; }
        .feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(22,163,74,0.1); }
        .sms-bubble { animation: slideIn 0.5s ease both; }
        .sms-bubble:nth-child(1) { animation-delay: 0.1s; }
        .sms-bubble:nth-child(2) { animation-delay: 0.3s; }
        .sms-bubble:nth-child(3) { animation-delay: 0.5s; }
        details summary::-webkit-details-marker { display: none; }
      `}</style>

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
            <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-green-200/60">
              Start gratis →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-24 pb-32 px-5 text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
            width: 700, height: 500,
            background: 'radial-gradient(ellipse, rgba(22,163,74,0.07) 0%, transparent 70%)',
          }}/>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="fade-up inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" style={{ animation: 'pulse-dot 2s infinite' }}/>
            7 dager gratis – ingen kredittkort nødvendig
          </div>

          <h1 className="fade-up-1 text-5xl md:text-[66px] font-bold text-gray-900 leading-[1.05] tracking-tight mb-6">
            La systemet følge opp.<br/>
            <span className="text-green-600">Du fokuserer på jobben.</span>
          </h1>

          <p className="fade-up-2 text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            LokalProfil sender automatiske SMS-påminnelser til kundene dine – og sørger for at fornøyde kunder legger igjen Google-anmeldelser.
          </p>

          <div className="fade-up-3 flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/register"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-9 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-green-200/60 w-full sm:w-auto"
              style={{ boxShadow: '0 8px 32px rgba(22,163,74,0.35)' }}>
              Kom i gang gratis →
            </Link>
            <a href="#slik-fungerer-det"
              className="text-gray-500 hover:text-gray-900 font-semibold px-6 py-4 rounded-2xl border border-gray-200 hover:border-gray-400 transition-all text-sm w-full sm:w-auto text-center">
              Se hvordan det fungerer ↓
            </a>
          </div>
          <p className="fade-up-4 text-xs text-gray-400">Ingen kredittkort · Avbryt når som helst · Norsk support</p>
        </div>

        {/* Floating SMS previews */}
        <div className="relative max-w-4xl mx-auto mt-20 hidden md:block" style={{ height: 200 }}>
          <div className="float absolute left-8" style={{ top: 20 }}>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-lg text-left" style={{ maxWidth: 260 }}>
              <p className="text-[11px] font-bold text-gray-400 mb-1">24t FØR</p>
              <p className="text-sm text-gray-700 font-mono leading-relaxed">Hei Sara! Påminnelse om din time hos Studio K i morgen kl 11:00. 😊</p>
            </div>
          </div>
          <div className="float-delayed absolute right-8" style={{ top: 10 }}>
            <div className="bg-green-600 rounded-2xl rounded-br-sm px-5 py-3 shadow-lg text-left" style={{ maxWidth: 260 }}>
              <p className="text-[11px] font-bold text-green-300 mb-1">1T ETTER</p>
              <p className="text-sm text-white font-mono leading-relaxed">Takk for besøket! 🌟 Legg gjerne igjen en anmeldelse: g.page/r/...</p>
            </div>
          </div>
          <div className="float absolute" style={{ left: '42%', top: 60 }}>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-lg text-left" style={{ maxWidth: 240 }}>
              <p className="text-[11px] font-bold text-gray-400 mb-1">2T FØR</p>
              <p className="text-sm text-gray-700 font-mono leading-relaxed">Din time er om 2 timer (kl 11:00). Vi gleder oss! 😊</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-6 border-y border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-5 grid grid-cols-3 gap-6 text-center">
          {[
            { num: '40%', label: 'færre no-shows' },
            { num: '3×', label: 'flere Google-anmeldelser' },
            { num: '5 min', label: 'oppsett' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{s.num}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO */}
      <section className="py-5 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 flex flex-wrap justify-center gap-x-10 gap-y-2">
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
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Alt du trenger. Ingenting du ikke trenger.</h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto">Sett opp én gang – systemet gjør resten.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '⏰', title: 'Automatiske påminnelser', desc: 'SMS 24t og 2t før timen – uten at du gjør noe. Kunden møter opp, du slipper å minne dem.', highlight: true },
              { icon: '🌟', title: 'Flere Google-anmeldelser', desc: 'Etter hvert besøk sendes lenke til Google-anmeldelse. Fornøyde kunder anmelder – med ett klikk.' },
              { icon: '💬', title: 'Send SMS direkte', desc: 'Meldingsboks med full historikk per kunde. Send og motta SMS direkte fra nettleseren.' },
              { icon: '✏️', title: 'Redigerbare maler', desc: 'Tilpass alle SMS-meldinger til din bedrift. Live-forhåndsvisning mens du skriver.' },
              { icon: '📊', title: 'Oversikt og statistikk', desc: 'Timeplan, no-show-rate og SMS-forbruk i et ryddig dashboard. Eksporter til CSV.' },
              { icon: '🤖', title: 'AI-kundeservice', desc: 'Innebygd AI-assistent som svarer på spørsmål fra kundene dine – 24/7.' },
            ].map(f => (
              <div key={f.title} className={`feature-card rounded-2xl p-6 ${f.highlight ? 'bg-green-600 text-white' : 'bg-white border border-gray-100'}`}>
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

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                { step: '01', title: 'Legg til en kunde', desc: 'Navn, nummer og tidspunkt. 10 sekunder – alt annet skjer selv.' },
                { step: '02', title: 'Påminnelser sendes', desc: 'Kunden får SMS 24t og 2t før timen. Du slipper å tenke på det.' },
                { step: '03', title: 'Hent inn anmeldelser', desc: '1 time etter besøket sendes Google-lenke. Fornøyde kunder klikker og anmelder.' },
              ].map(s => (
                <div key={s.step} className="flex gap-5 group">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0 border border-green-200 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all">
                    {s.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SMS bubbles */}
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Eksempel på SMS-flyt</p>
              {[
                { label: '24t før', msg: 'Hei Kari! Påminnelse om din time hos Hansens Frisør i morgen kl 10:00.', green: false },
                { label: '2t før', msg: 'Hei Kari! Din time er om 2 timer (kl 10:00). Vi gleder oss til å se deg! 😊', green: false },
                { label: '1t etter', msg: 'Takk for besøket! 🌟 Legg gjerne igjen en anmeldelse: g.page/r/hansens-frisor', green: true },
              ].map((item, i) => (
                <div key={i} className={`sms-bubble flex gap-3 ${item.green ? 'justify-end' : ''}`}>
                  {!item.green && <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full self-start mt-1 flex-shrink-0">{item.label}</span>}
                  <div className={`rounded-2xl px-4 py-3 text-xs font-mono leading-relaxed flex-1 ${item.green ? 'bg-green-600 text-white rounded-tr-sm max-w-xs ml-auto' : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm'}`}>
                    {item.msg}
                  </div>
                  {item.green && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full self-start mt-1 flex-shrink-0">{item.label}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pris" className="py-24 px-5 bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-3">Pris</p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Én plan. Alt inkludert.</h2>
          <p className="text-gray-500 mb-12">Ingen skjulte kostnader.</p>

          <div className="rounded-3xl p-10 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', boxShadow: '0 24px 64px rgba(22,163,74,0.3)' }}>
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}/>

            <div className="relative">
              <div className="mb-2">
                <span className="text-7xl font-bold tracking-tight">299</span>
                <span className="text-2xl font-medium text-green-200"> kr/mnd</span>
              </div>
              <p className="text-green-200 text-sm mb-8">100 SMS inkludert · 0,40 kr/SMS over kvoten</p>

              <ul className="space-y-3 mb-10 text-left max-w-xs mx-auto">
                {[
                  'Ubegrenset antall kunder',
                  'Automatiske påminnelser (24t og 2t)',
                  'Google-anmeldelseslenke etter besøk',
                  'Redigerbare SMS-maler',
                  'Meldingsboks og kundehistorikk',
                  'Statistikk og CSV-eksport',
                  'AI-kundeservice 24/7',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-green-100">
                    <svg className="w-4 h-4 flex-shrink-0 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/register" className="block w-full bg-white text-green-700 font-bold py-4 rounded-2xl text-base hover:bg-green-50 transition-all text-center"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                Start 7 dager gratis →
              </Link>
              <p className="text-green-300 text-xs mt-4">Ingen kredittkort · Avbryt når som helst</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Trenger du mer enn 100 SMS/mnd?{' '}
            <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline font-semibold">Kontakt oss</a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Ofte stilte spørsmål</h2>
          <div className="space-y-3">
            {[
              { q: 'Hva er LokalProfil?', a: 'LokalProfil er en SMS-basert kundeoppfølgingstjeneste for norske småbedrifter. Vi sender automatiske påminnelser og Google-anmeldelseslenker til kundene dine via SMS.' },
              { q: 'Hvilke bedrifter passer LokalProfil for?', a: 'Bedrifter med timebestillinger: frisører, barberer, massasjeterapeuter, personlige trenere, nagelstudio, hudpleie og lignende.' },
              { q: 'Trenger jeg teknisk kunnskap?', a: 'Nei. Du er klar på under 5 minutter – ingen koding, ingen komplisert oppsett.' },
              { q: 'Hva koster SMS utover kvoten?', a: '0,40 kr per SMS over 100 inkluderte. Faktureres automatisk ved månedsslutt.' },
              { q: 'Er tjenesten GDPR-compliant?', a: 'Ja. Data lagres i EU (Supabase), SMS sendes via 46elks. Full personvernerklæring tilgjengelig.' },
            ].map(faq => (
              <details key={faq.q} className="bg-gray-50 rounded-2xl border border-gray-100 group overflow-hidden">
                <summary className="px-5 py-4 text-sm font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(22,163,74,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(22,163,74,0.08) 0%, transparent 50%)'
        }}/>
        <div className="max-w-2xl mx-auto text-center relative">
          <Logo dark large />
          <h2 className="text-4xl font-bold text-white tracking-tight mt-8 mb-4">
            Klar til å automatisere<br/>kundeoppfølgingen?
          </h2>
          <p className="text-gray-400 mb-10 text-lg leading-relaxed">
            Kom i gang på 5 minutter. Helt gratis i 7 dager.
          </p>
          <Link href="/register"
            className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-10 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5"
            style={{ boxShadow: '0 8px 32px rgba(22,163,74,0.4)' }}>
            Start gratis prøveperiode →
          </Link>
          <p className="text-gray-600 text-sm mt-4">Ingen kredittkort · Norsk support · kontakt@lokalprofil.no</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-5 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
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
