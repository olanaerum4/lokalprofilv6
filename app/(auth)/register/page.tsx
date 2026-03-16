'use client'
import { useState } from 'react'
import { browserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit() {
    if (!name || !email || !phone || !password) { setError('Fyll ut alle felt'); return }
    setLoading(true); setError('')
    const sb = browserClient()
    const { data, error: signUpError } = await sb.auth.signUp({ email, password })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      await sb.from('businesses').insert({ name, email, phone, id: data.user.id, onboarding_done: false })
    }
    router.push('/onboarding'); router.refresh()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#16a34a"/></linearGradient></defs>
              <path d="M10 6H36C44.837 6 52 13.163 52 22C52 30.837 44.837 38 36 38H22L10 52V38C6 38 6 35 6 32V12C6 8.686 8.686 6 12 6H10Z" stroke="url(#lg)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M16 18L28 26L40 18" stroke="url(#lg)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 18H40V32H16V18Z" stroke="url(#lg)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="text-xl font-bold text-gray-900" style={{letterSpacing: '-0.02em'}}>LokalProfil</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kom i gang</h1>
          <p className="text-gray-500 text-sm mt-1">7 dager gratis, ingen kredittkort</p>
        </div>
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedriftsnavn *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Hansens Frisørsalong" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-post *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="din@bedrift.no" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefonnummer *</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+47 900 00 000" className="input" />
              <p className="text-xs text-gray-400 mt-1">Vi sender deg betalingslenke etter prøveperioden</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passord *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Minst 6 tegn" className="input" />
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">{error}</div>}
            <button onClick={submit} disabled={loading} className="btn-primary w-full">
              {loading ? 'Oppretter konto...' : 'Start gratis prøveperiode →'}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
            Ved å registrere deg godtar du vår{' '}
            <Link href="/personvern" className="text-gray-500 hover:underline">personvernerklæring</Link>
            {' '}og{' '}
            <Link href="/privacy" className="text-gray-500 hover:underline">privacy policy</Link>.
          </p>
          <p className="text-center text-sm text-gray-500 mt-3">
            Har du konto? <Link href="/login" className="text-green-600 font-semibold hover:underline">Logg inn</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
