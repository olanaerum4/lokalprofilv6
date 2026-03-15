export default function Personvern() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <span className="font-bold text-gray-900">LokalProfil</span>
          </a>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-900">← Tilbake</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Personvernerklæring</h1>
        <p className="text-gray-400 text-sm mb-12">Sist oppdatert: mars 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Om LokalProfil</h2>
            <p>LokalProfil er en SMS-basert kundeoppfølgingstjeneste for norske småbedrifter. Vi behandler personopplysninger i henhold til EUs personvernforordning (GDPR) og norsk personopplysningslov.</p>
            <p className="mt-2">Behandlingsansvarlig: LokalProfil<br/>Kontakt: <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">kontakt@lokalprofil.no</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Hvilke opplysninger vi samler inn</h2>
            <p><strong className="text-gray-800">For bedrifter (brukere av tjenesten):</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>E-postadresse og passord (for innlogging)</li>
              <li>Bedriftsnavn og telefonnummer</li>
              <li>Google-anmeldelseslenke</li>
            </ul>
            <p className="mt-4"><strong className="text-gray-800">For sluttkundene (de som mottar SMS):</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Navn og telefonnummer</li>
              <li>Tidspunkt for timebestilling</li>
              <li>Tilbakemeldinger (karakter 1–5 og tekstsvar)</li>
              <li>SMS-kommunikasjonshistorikk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Formål med behandlingen</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sende SMS-påminnelser om timebestillinger</li>
              <li>Innhente tilbakemeldinger fra kunder</li>
              <li>Videresende fornøyde kunder til Google-anmeldelser</li>
              <li>Lagre meldingshistorikk for bedriften</li>
              <li>Levere og forbedre tjenesten</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Rettslig grunnlag</h2>
            <p>Behandling av opplysninger om bedriftens egne kunder skjer på grunnlag av <strong className="text-gray-800">berettiget interesse</strong> (GDPR art. 6(1)(f)) – å sende relevante påminnelser og innhente tilbakemeldinger. Bedriften som bruker LokalProfil er behandlingsansvarlig for sine kunders data. LokalProfil opptrer som databehandler.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Databehandlere og tredjeparter</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-gray-800">Supabase</strong> (database og autentisering) – data lagres i EU</li>
              <li><strong className="text-gray-800">46elks</strong> (SMS-leverandør) – svensk selskap, behandler meldingsinnhold</li>
              <li><strong className="text-gray-800">Vercel</strong> (hosting) – USA, standard kontraktsvilkår</li>
            </ul>
            <p className="mt-3">Vi deler aldri personopplysninger med andre tredjeparter enn de som er nødvendige for å levere tjenesten.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Lagringstid</h2>
            <p>Kundedata slettes automatisk når bedriften sletter kunden fra systemet. Bedriftskontoen og tilhørende data slettes ved oppsigelse av tjenesten. Vi oppbevarer ikke data lenger enn nødvendig.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Dine rettigheter</h2>
            <p>Du har rett til å:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Få innsyn i opplysninger vi har om deg</li>
              <li>Korrigere feilaktige opplysninger</li>
              <li>Kreve sletting av dine opplysninger</li>
              <li>Protestere mot behandling</li>
              <li>Klage til Datatilsynet (datatilsynet.no)</li>
            </ul>
            <p className="mt-3">Ta kontakt på <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">kontakt@lokalprofil.no</a> for å utøve dine rettigheter.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Informasjonskapsler (cookies)</h2>
            <p>LokalProfil bruker kun nødvendige informasjonskapsler for innlogging og sesjonshåndtering. Vi bruker ingen sporings- eller reklamecookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Kontakt</h2>
            <p>Spørsmål om personvern kan rettes til:<br/>
            E-post: <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">kontakt@lokalprofil.no</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
