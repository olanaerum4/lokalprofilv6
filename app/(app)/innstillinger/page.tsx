'use client'
import { useEffect, useState } from 'react'
import { browserClient } from '@/lib/supabase'
import { DEFAULT_TEMPLATES, fillTemplate } from '@/lib/sms'

const VARS_HELP = [
  { key: '{navn}', desc: 'Kundens navn' },
  { key: '{bedrift}', desc: 'Bedriftsnavn' },
  { key: '{tid}', desc: 'Tidspunkt for timen' },
  { key: '{google}', desc: 'Google-anmeldelseslenke (kun etter time)' },
]

const PREVIEW_VARS = {
  navn: 'Kari', bedrift: 'Hansens Frisør', tid: '10:00',
  avbestill: 'lokalprofil.no/avbestill/abc123',
  google: 'g.page/r/hansens-frisor',
}

export default function Innstillinger() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [link, setLink] = useState('')
  const [sms24h, setSms24h] = useState('')
  const [sms2h, setSms2h] = useState('')
  const [smsAfter, setSmsAfter] = useState('')
  const [testPhone, setTestPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testMsg, setTestMsg] = useState('')
  const [userId, setUserId] = useState('')
  const [activeTab, setActiveTab] = useState<'bedrift' | 'meldinger'>('bedrift')
  const sb = browserClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await sb.from('businesses').select('*').eq('id', user.id).single()
      if (data) {
        setName(data.name ?? '')
        setPhone(data.phone ?? '')
        setLink(data.google_review_link ?? '')
        setSms24h(data.sms_reminder_24h ?? '')
        setSms2h(data.sms_reminder_2h ?? '')
        setSmsAfter(data.sms_after_appointment ?? '')
      }
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    await sb.from('businesses').upsert({
      id: userId, name, phone,
      google_review_link: link || null,
      google_review_short: null, // reset so cron re-shortens
      sms_reminder_24h: sms24h || null,
      sms_reminder_2h: sms2h || null,
      sms_after_appointment: smsAfter || null,
    })
    // Auto-shorten Google review link via bitly
    if (link) {
      fetch('/api/shorten-review-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link }),
      }).catch(() => {}) // fire and forget
    }
    setSaved(true); setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  async function testSms() {
    if (!testPhone) return
    setTesting(true); setTestMsg('')
    const r = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: testPhone, message: `Hei! Test-SMS fra LokalProfil for ${name}. Alt fungerer! 🎉` }),
    })
    const d = await r.json()
    setTestMsg(d.ok ? '✓ SMS sendt! Sjekk telefonen.' : '✗ ' + (d.error ?? 'Feil'))
    setTesting(false)
  }

  // Preview with current template (or default)
  const previewVars = { ...PREVIEW_VARS, bedrift: name || 'Bedriften din', google: link || 'g.page/r/din-bedrift' }
  const preview24h = fillTemplate(sms24h || DEFAULT_TEMPLATES.reminder24h, previewVars)
  const preview2h = fillTemplate(sms2h || DEFAULT_TEMPLATES.reminder2h, previewVars)
  const previewAfter = fillTemplate(smsAfter || DEFAULT_TEMPLATES.afterAppointment, previewVars)

  return (
    <div className="p-5 md:p-7 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Innstillinger</h1>
        <p className="text-gray-400 text-sm mt-0.5">Bedriftsinformasjon og SMS-oppsett</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {([['bedrift', 'Bedrift'], ['meldinger', 'SMS-maler']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* BEDRIFT TAB */}
      {activeTab === 'bedrift' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Bedriftsinformasjon</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Bedriftsnavn *</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Hansens Frisørsalong" />
                <p className="text-xs text-gray-400 mt-1">Brukes i alle SMS-meldinger som {'{bedrift}'}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Telefonnummer</label>
                <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+47 900 00 000" type="tel" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Google-anmeldelseslenke</label>
                <input className="input" value={link} onChange={e => setLink(e.target.value)} placeholder="https://g.page/r/din-bedrift/review" type="url" />
                <p className="text-xs text-gray-400 mt-1">Brukes som {'{google}'} i SMS etter besøk</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-2">Test SMS</h2>
            <p className="text-xs text-gray-400 mb-3">Verifiser at 46elks-integrasjonen fungerer</p>
            <div className="flex gap-2">
              <input className="input flex-1" value={testPhone} onChange={e => setTestPhone(e.target.value)} placeholder="+4741001984" type="tel" />
              <button onClick={testSms} disabled={testing || !testPhone} className="btn-secondary flex-shrink-0">
                {testing ? 'Sender...' : 'Send test'}
              </button>
            </div>
            {testMsg && (
              <div className={`mt-2 text-xs rounded-xl px-3 py-2.5 border ${testMsg.startsWith('✓') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {testMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SMS MALER TAB */}
      {activeTab === 'meldinger' && (
        <div className="space-y-4">
          {/* Variable help */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-2">Tilgjengelige variabler:</p>
            <div className="flex flex-wrap gap-2">
              {VARS_HELP.map(v => (
                <div key={v.key} className="flex items-center gap-1.5">
                  <code className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-lg font-mono">{v.key}</code>
                  <span className="text-xs text-blue-500">{v.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 24h */}
          <div className="card">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-gray-900">24 timer før timen</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Påminnelse</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Sendes dagen før timebestillingen</p>
            <textarea
              className="input resize-none font-mono text-xs leading-relaxed"
              rows={4}
              value={sms24h}
              onChange={e => setSms24h(e.target.value)}
              placeholder={DEFAULT_TEMPLATES.reminder24h}
            />
            <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Forhåndsvisning</p>
              <p className="text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-wrap">{preview24h}</p>
            </div>
            <button onClick={() => setSms24h('')} className="text-xs text-gray-400 hover:text-gray-600 mt-2">
              ↩ Tilbakestill til standard
            </button>
          </div>

          {/* 2h */}
          <div className="card">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-gray-900">2 timer før timen</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Påminnelse</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Sendes 2 timer før timebestillingen</p>
            <textarea
              className="input resize-none font-mono text-xs leading-relaxed"
              rows={3}
              value={sms2h}
              onChange={e => setSms2h(e.target.value)}
              placeholder={DEFAULT_TEMPLATES.reminder2h}
            />
            <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Forhåndsvisning</p>
              <p className="text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-wrap">{preview2h}</p>
            </div>
            <button onClick={() => setSms2h('')} className="text-xs text-gray-400 hover:text-gray-600 mt-2">
              ↩ Tilbakestill til standard
            </button>
          </div>

          {/* After appointment */}
          <div className="card">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-gray-900">1 time etter timen</h2>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Google-anmeldelse</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Sendes 1 time etter at timen er ferdig. Bruk {'{google}'} for anmeldelseslenken.</p>
            <textarea
              className="input resize-none font-mono text-xs leading-relaxed"
              rows={4}
              value={smsAfter}
              onChange={e => setSmsAfter(e.target.value)}
              placeholder={DEFAULT_TEMPLATES.afterAppointment}
            />
            <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Forhåndsvisning</p>
              <p className="text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-wrap">{previewAfter}</p>
            </div>
            <button onClick={() => setSmsAfter('')} className="text-xs text-gray-400 hover:text-gray-600 mt-2">
              ↩ Tilbakestill til standard
            </button>
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="mt-5 space-y-3">
        {saved && (
          <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 border border-green-100 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
            Lagret!
          </div>
        )}
        <button onClick={save} disabled={saving} className="btn-primary w-full py-3">
          {saving ? 'Lagrer...' : 'Lagre endringer'}
        </button>
      </div>
    </div>
  )
}
