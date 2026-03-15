export default function Privacy() {
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
          <a href="/" className="text-sm text-gray-500 hover:text-gray-900">← Back</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-12">Last updated: March 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. About LokalProfil</h2>
            <p>LokalProfil is an SMS-based customer follow-up service for Norwegian small businesses. We process personal data in accordance with the EU General Data Protection Regulation (GDPR) and Norwegian privacy legislation.</p>
            <p className="mt-2">Data Controller: LokalProfil<br/>Contact: <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">kontakt@lokalprofil.no</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data We Collect</h2>
            <p><strong className="text-gray-800">For businesses (service users):</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Email address and password (for login)</li>
              <li>Business name and phone number</li>
              <li>Google review link</li>
            </ul>
            <p className="mt-4"><strong className="text-gray-800">For end customers (SMS recipients):</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Name and phone number</li>
              <li>Appointment date and time</li>
              <li>Feedback (rating 1–5 and text responses)</li>
              <li>SMS communication history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Purpose of Processing</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sending SMS appointment reminders</li>
              <li>Collecting customer feedback</li>
              <li>Directing satisfied customers to Google reviews</li>
              <li>Storing message history for the business</li>
              <li>Delivering and improving the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Legal Basis</h2>
            <p>Processing of data about a business's customers is based on <strong className="text-gray-800">legitimate interest</strong> (GDPR Art. 6(1)(f)) – sending relevant reminders and collecting feedback. The business using LokalProfil is the data controller for their customers' data. LokalProfil acts as a data processor.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Sub-processors and Third Parties</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-gray-800">Supabase</strong> (database and authentication) – data stored in EU</li>
              <li><strong className="text-gray-800">46elks</strong> (SMS provider) – Swedish company, processes message content</li>
              <li><strong className="text-gray-800">Vercel</strong> (hosting) – USA, standard contractual clauses</li>
            </ul>
            <p className="mt-3">We never share personal data with third parties beyond what is necessary to deliver the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p>Customer data is deleted when the business removes the customer from the system. Business account data is deleted upon cancellation of the service. We do not retain data longer than necessary.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Access the data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing</li>
              <li>Lodge a complaint with the Norwegian Data Protection Authority (datatilsynet.no)</li>
            </ul>
            <p className="mt-3">Contact us at <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">kontakt@lokalprofil.no</a> to exercise your rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
            <p>LokalProfil only uses necessary cookies for login and session management. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>Privacy inquiries: <a href="mailto:kontakt@lokalprofil.no" className="text-green-600 hover:underline">kontakt@lokalprofil.no</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
