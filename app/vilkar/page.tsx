export default function Vilkar() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#16a34a"/></linearGradient></defs>
              <path d="M10 6H36C44.837 6 52 13.163 52 22C52 30.837 44.837 38 36 38H22L10 52V38C6 38 6 35 6 32V12C6 8.686 8.686 6 12 6H10Z" stroke="url(#lg)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M16 18L28 26L40 18" stroke="url(#lg)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 18H40V32H16V18Z" stroke="url(#lg)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>LokalProfil</span>
          </a>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-900">← Tilbake</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Vilkår for bruk</h1>
        <p className="text-gray-400 text-sm mb-12">Sist oppdatert: mars 2026</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Om tjenesten</h2>
            <p>LokalProfil er en SMS-basert kundeoppfølgingstjeneste for norske småbedrifter. Tjenesten tilbys av LokalProfil og er tilgjengelig via lokalprofil.no.</p>
            <p className="mt-2">Ved å opprette en konto og bruke tjenesten aksepterer du disse vilkårene i sin helhet. Hvis du ikke aksepterer vilkårene, skal du ikke bruke tjenesten.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Prøveperiode og betaling</h2>
            <p>Nye brukere får 7 dagers gratis prøveperiode uten kredittkort. Etter prøveperioden er prisen <strong className="text-gray-800">299 kr per måned</strong>, som inkluderer 100 SMS.</p>
            <p className="mt-2">SMS-bruk over 100 per måned faktureres med <strong className="text-gray-800">0,40 kr per SMS</strong>. Overskytende beløp faktureres automatisk ved månedsslutt.</p>
            <p className="mt-2">Betalingslenke sendes på e-post etter prøveperioden. Manglende betaling kan føre til suspensjon av kontoen.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Oppsigelse</h2>
            <p>Du kan si opp abonnementet når som helst ved å kontakte oss på <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">kontakt@lokalprofil.no</a>. Det er ingen bindingstid.</p>
            <p className="mt-2">Ved oppsigelse beholder du tilgang ut inneværende betalingsperiode. Vi refunderer ikke allerede betalte perioder.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Brukerens ansvar</h2>
            <p>Du er ansvarlig for:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
              <li>At du har lovlig grunnlag for å sende SMS til kundene du registrerer</li>
              <li>At telefonnumre og personopplysninger du legger inn er korrekte</li>
              <li>At du ikke bruker tjenesten til å sende spam, svindel eller ulovlig innhold</li>
              <li>Å holde innloggingsinformasjonen din konfidensiell</li>
              <li>Å varsle oss umiddelbart ved mistanke om uautorisert tilgang til kontoen din</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. SMS og kommunikasjon</h2>
            <p>LokalProfil sender SMS på vegne av bedriften du representerer. Du er ansvarlig for innholdet i meldingene, inkludert eventuelle egendefinerte maler.</p>
            <p className="mt-2">Vi forbeholder oss retten til å stanse utsending av meldinger som bryter med norsk lov, 46elks sine retningslinjer eller disse vilkårene.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Tilgjengelighet og feil</h2>
            <p>Vi tilstreber høy oppetid, men garanterer ikke 100% tilgjengelighet. SMS-utsending kan i sjeldne tilfeller forsinkes eller feile grunnet tredjepartsleverandører (46elks, Supabase, Vercel).</p>
            <p className="mt-2">Vi er ikke ansvarlige for tap som skyldes nedetid, forsinkede meldinger eller tekniske feil utenfor vår kontroll.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Immaterielle rettigheter</h2>
            <p>LokalProfil og alt tilhørende innhold, design og kode tilhører LokalProfil. Du får en ikke-eksklusiv, ikke-overførbar rett til å bruke tjenesten i samsvar med disse vilkårene.</p>
            <p className="mt-2">Du beholder alle rettigheter til dataene du legger inn i tjenesten (kundenavn, telefonnumre o.l.).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Personvern</h2>
            <p>Behandling av personopplysninger er beskrevet i vår <a href="/personvern" className="text-green-600 hover:underline">personvernerklæring</a>. Ved å bruke tjenesten samtykker du til behandling av data i henhold til personvernerklæringen.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Endringer i vilkårene</h2>
            <p>Vi kan oppdatere disse vilkårene ved behov. Vesentlige endringer varsles på e-post med minimum 14 dagers varsel. Fortsatt bruk av tjenesten etter varselfristen anses som aksept av nye vilkår.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Gjeldende lov</h2>
            <p>Disse vilkårene er underlagt norsk lov. Eventuelle tvister skal forsøkes løst i minnelighet. Dersom dette ikke lykkes, skal tvisten behandles av norske domstoler med Trondheim tingrett som verneting.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Kontakt</h2>
            <p>Spørsmål om vilkårene rettes til:<br/>
            E-post: <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">kontakt@lokalprofil.no</a></p>
          </section>

        </div>
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 mt-8">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 text-sm text-gray-400">
          <a href="/personvern" className="hover:text-gray-700">Personvern</a>
          <a href="/privacy" className="hover:text-gray-700">Privacy Policy</a>
          <a href="/vilkar" className="hover:text-gray-700 text-gray-700 font-semibold">Vilkår for bruk</a>
          <a href="mailto:kontakt@lokalprofil.no" className="hover:text-gray-700">kontakt@lokalprofil.no</a>
        </div>
      </footer>
    </div>
  )
}
