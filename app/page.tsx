import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">LokalProfil</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Funksjoner</a>
            <a href="#hvordan" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Slik fungerer det</a>
            <a href="#pris" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Priser</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Logg inn</Link>
            <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Start gratis →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 pb-24 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          7 dager gratis – ingen kredittkort nødvendig
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
          Automatisk SMS-oppfølging<br className="hidden md:block" />
          <span className="text-green-600"> for bedriften din</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Påminnelser, tilbakemeldinger og Google-anmeldelser – helt automatisk. Sett opp på 5 minutter. La systemet gjøre resten.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-green-200">
            Start 7 dager gratis →
          </Link>
          <a href="#hvordan" className="text-gray-500 hover:text-gray-900 font-semibold px-6 py-4 rounded-2xl border border-gray-200 hover:border-gray-400 transition-colors text-sm">
            Se hvordan det fungerer
          </a>
        </div>
        <p className="text-xs text-gray-400">Ingen kredittkort · Ingen bindingstid · Avbryt når som helst</p>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-8 border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-3">
          {['Frisører og barberer', 'Massasjeterapeuter', 'Personlige trenere', 'Hudpleie og salong', 'Nagelstudio'].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Funksjoner</p>
          <h2 className="text-4xl font-bold text-gray-900">Alt du trenger, ingenting du ikke trenger</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '⏰', title: 'Automatiske påminnelser', desc: 'SMS sendes 24 timer og 2 timer før timen. Reduser no-shows uten å løfte en finger.' },
            { icon: '⭐', title: 'Tilbakemeldinger via SMS', desc: 'Kunder svarer med 1–5 etter besøket. Du ser alt i dashbordet.' },
            { icon: '🌟', title: 'Google-anmeldelser', desc: 'Fornøyde kunder sendes automatisk til din Google-anmeldelsesside.' },
            { icon: '❌', title: 'Enkel avbestilling', desc: 'Kunder avbestiller med én klikk via lenke i SMS. Du ser det med én gang.' },
            { icon: '💬', title: 'Meldingsboks', desc: 'Send og motta SMS direkte fra dashbordet. Full historikk per kunde.' },
            { icon: '📊', title: 'Oversikt og statistikk', desc: 'Se snittkarakter, no-shows, avbestillinger og eksporter til CSV.' },
          ].map(f => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="hvordan" className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Slik fungerer det</p>
            <h2 className="text-4xl font-bold text-gray-900">3 steg, så er du i gang</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Legg til en kunde', desc: 'Navn, telefonnummer og tidspunkt for timen. Tar 10 sekunder.' },
              { step: '2', title: 'Alt sendes automatisk', desc: 'Systemet sender påminnelse 24t og 2t før. 1t etter ber vi om tilbakemelding.' },
              { step: '3', title: 'Få Google-anmeldelser', desc: 'Kunder som er fornøyde sendes rett til Google-anmeldelsessiden din.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-bold text-xl mx-auto mb-5 border border-green-200">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* SMS flow preview */}
          <div className="mt-16 bg-white rounded-3xl border border-gray-100 p-8 max-w-lg mx-auto">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 text-center">SMS-flyten</p>
            <div className="space-y-3">
              {[
                { label: '24t før', msg: 'Hei Kari! Påminnelse om din time hos Hansens Frisør i morgen kl 10:00. Avbestill her: ...' },
                { label: '2t før', msg: 'Hei Kari! Din time er om 2 timer (kl 10:00). Vi gleder oss til å se deg! 😊' },
                { label: '1t etter', msg: 'Hei Kari! Takk for besøket 😊 Hvordan var opplevelsen? 1=Dårlig ... 5=Fantastisk' },
                { label: 'Svar 5 ⭐', msg: 'Så glad du er fornøyd! 🌟 Legg igjen en anmeldelse her: g.page/r/...', incoming: true },
              ].map((item, i) => (
                <div key={i} className={`flex gap-3 ${item.incoming ? 'flex-row-reverse' : ''}`}>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 self-start mt-1 ${item.incoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs px-4 py-3 rounded-2xl leading-relaxed flex-1 font-mono ${item.incoming ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-50 text-gray-700 rounded-bl-sm border border-gray-100'}`}>
                    {item.msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pris" className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Pris</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Én plan. Alt inkludert.</h2>
          <p className="text-gray-500 mb-12">Ingen skjulte kostnader. Ingen valg du må ta.</p>

          <div className="bg-green-600 rounded-3xl p-10 text-white shadow-2xl shadow-green-200">
            <div className="mb-8">
              <span className="text-7xl font-bold">299</span>
              <span className="text-2xl font-medium text-green-200"> kr/mnd</span>
            </div>

            <ul className="space-y-4 mb-10 text-left max-w-xs mx-auto">
              {[
                '100 SMS inkludert per måned',
                'Automatiske påminnelser (24t og 2t)',
                'Google-anmeldelseslenke etter besøk',
                'Avbestillingslenke i SMS',
                'Meldingsboks og kundehistorikk',
                'Redigerbare SMS-maler',
                'Ubegrenset antall kunder',
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-green-100">
                  <svg className="w-5 h-5 flex-shrink-0 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register"
              className="block w-full bg-white text-green-600 font-bold py-4 rounded-2xl text-base hover:bg-green-50 transition-colors text-center">
              Start 7 dager gratis →
            </Link>
            <p className="text-green-300 text-xs mt-4">Ingen kredittkort · Ingen bindingstid · Avbryt når som helst</p>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Trenger du mer enn 100 SMS? <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">Kontakt oss</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Klar til å sende din første SMS?</h2>
          <p className="text-gray-400 mb-10 text-lg">Kom i gang på under 5 minutter. Ingen teknisk kunnskap nødvendig.</p>
          <Link href="/register" className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-10 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-green-900">
            Start 7 dager gratis →
          </Link>
          <p className="text-gray-600 text-sm mt-4">Ingen kredittkort · Ingen bindingstid</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <span className="font-bold text-gray-900">LokalProfil</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
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
