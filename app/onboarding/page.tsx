'use client'
import { useState, useEffect } from 'react'
import { browserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const steps = ['Bedrift', 'Google', 'Test SMS', 'Ferdig']

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [link, setLink] = useState('')
  const [testPhone, setTestPhone] = useState('')
  const [testing, setTesting] = useState(false)
  const [testDone, setTestDone] = useState(false)
  const [testMsg, setTestMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState('')
  const sb = browserClient()
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data: biz } = await sb.from('businesses')
        .select('name, phone, google_review_link, onboarding_done')
        .eq('id', user.id).single()
      if (biz?.onboarding_done) { router.push('/dashboard'); return }
      if (biz?.name) setName(biz.name)
      if (biz?.phone) setPhone(biz.phone)
      if (biz?.google_review_link) setLink(biz.google_review_link)
      setReady(true)
    }
    check()
  }, [])

  async function saveStep1() {
    if (!name.trim()) return
    setSaving(true)
    await sb.from('businesses').upsert({
      id: userId, name, phone: phone || null, onboarding_done: false
    })
    setSaving(false)
    setStep(1)
  }

  async function saveStep2() {
    setSaving(true)
    await sb.from('businesses').upsert({
      id: userId, name, phone: phone || null,
      google_review_link: link || null, onboarding_done: false
    })
    setSaving(false)
    setStep(2)
  }

  async function sendTest() {
    if (!testPhone) return
    setTesting(true); setTestMsg('')
    try {
      const r = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testPhone, message: `Hei! Test-SMS fra LokalProfil for ${name}. Alt fungerer! 🎉` }),
      })
      const d = await r.json()
      if (d.ok) { setTestDone(true); setTestMsg('✓ SMS mottatt! Integrasjonen fungerer.') }
      else setTestMsg('✗ ' + (d.error ?? 'Sjekk ELKS_USERNAME og ELKS_PASSWORD'))
    } catch { setTestMsg('✗ Nettverksfeil') }
    setTesting(false)
  }

  async function finish() {
    setSaving(true)
    // Use upsert with ALL fields to guarantee the row exists and onboarding_done=true
    const { error } = await sb.from('businesses').upsert({
      id: userId,
      name,
      phone: phone || null,
      google_review_link: link || null,
      onboarding_done: true,
    })
    if (error) {
      console.error('Finish error:', error)
      setSaving(false)
      return
    }
    // Hard redirect to force server re-fetch of onboarding_done
    window.location.href = '/dashboard'
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <span className="text-xl font-bold text-gray-900">LokalProfil</span>
          </div>
          <p className="text-gray-500 text-sm">La oss sette opp kontoen din – tar 2 minutter</p>
        </div>

        {/* Progress */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-green-600 text-white' :
                  i === step ? 'bg-green-600 text-white ring-4 ring-green-100' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i < step
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    : i + 1}
                </div>
                <span className={`text-[10px] font-semibold ${i === step ? 'text-green-700' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mb-4 transition-all ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {step === 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Hva heter bedriften din?</h2>
              <p className="text-sm text-gray-400 mb-5">Brukes i alle SMS-meldinger til kundene dine.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Bedriftsnavn *</label>
                  <input className="input text-base" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Hansens Frisørsalong" autoFocus
                    onKeyDown={e => e.key === 'Enter' && name.trim() && saveStep1()} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Telefonnummer (valgfritt)</label>
                  <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+47 900 00 000" type="tel" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button onClick={saveStep1} disabled={!name.trim() || saving} className="btn-primary px-8">
                  {saving ? 'Lagrer...' : 'Neste →'}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Google-anmeldelseslenke</h2>
              <p className="text-sm text-gray-400 mb-5">Kunder som gir 4–5 stjerner får automatisk lenken din.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Google-lenke</label>
                <input className="input" value={link} onChange={e => setLink(e.target.value)}
                  placeholder="https://g.page/r/din-bedrift/review" type="url" />
                <p className="text-xs text-gray-400 mt-1.5">
                  Finn i <a href="https://business.google.com" target="_blank" rel="noopener" className="text-green-600 hover:underline">Google Business Profile</a> → Del anmeldelseslenke
                </p>
              </div>
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-semibold">💡 Vet du ikke lenken nå?</p>
                <p className="text-xs text-amber-600 mt-0.5">Du kan legge den til i innstillinger senere.</p>
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(0)} className="btn-secondary px-5">← Tilbake</button>
                <button onClick={saveStep2} disabled={saving} className="btn-primary px-8">
                  {saving ? 'Lagrer...' : 'Neste →'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Test SMS-utsending</h2>
              <p className="text-sm text-gray-400 mb-5">Bekreft at 46elks er koblet til riktig.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ditt mobilnummer</label>
                <div className="flex gap-2">
                  <input className="input flex-1" value={testPhone} onChange={e => setTestPhone(e.target.value)}
                    placeholder="+47 900 00 000" type="tel" />
                  <button onClick={sendTest} disabled={testing || !testPhone} className="btn-secondary flex-shrink-0">
                    {testing ? 'Sender...' : 'Send test'}
                  </button>
                </div>
                {testMsg && (
                  <div className={`mt-2 text-xs rounded-xl px-3 py-2.5 border ${testMsg.startsWith('✓') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {testMsg}
                  </div>
                )}
              </div>
              <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-500">
                Legg inn <code className="bg-gray-100 px-1 rounded">ELKS_USERNAME</code> og <code className="bg-gray-100 px-1 rounded">ELKS_PASSWORD</code> i Vercel Environment Variables
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-secondary px-5">← Tilbake</button>
                <button onClick={() => setStep(3)} className={`px-8 ${testDone ? 'btn-primary' : 'btn-secondary'}`}>
                  {testDone ? 'Neste →' : 'Hopp over →'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Du er klar! 🎉</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                {name} er satt opp. Legg til din første kunde og se SMS-flyten i aksjon.
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left mb-6 space-y-2.5">
                {[
                  { done: true, text: 'Bedriftsnavn satt: ' + name },
                  { done: !!link, text: link ? 'Google-lenke koblet til' : 'Google-lenke ikke satt (gjøres i innstillinger)' },
                  { done: testDone, text: testDone ? 'SMS-integrasjon testet og fungerer' : 'SMS ikke testet ennå' },
                ].map(item => (
                  <div key={item.text} className={`flex items-center gap-2 text-sm ${item.done ? 'text-gray-700' : 'text-gray-400'}`}>
                    <span className={`text-base ${item.done ? 'text-green-500' : 'text-gray-300'}`}>{item.done ? '✓' : '○'}</span>
                    {item.text}
                  </div>
                ))}
              </div>
              <button onClick={finish} disabled={saving} className="btn-primary w-full py-3 text-base">
                {saving ? 'Lagrer...' : 'Gå til dashbordet →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
