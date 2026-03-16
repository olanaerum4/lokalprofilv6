'use client'
import { useState } from 'react'
import { browserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit() {
    setLoading(true); setError('')
    const { error } = await browserClient().auth.signInWithPassword({ email, password })
    if (error) setError('Feil e-post eller passord')
    else { router.push('/dashboard'); router.refresh() }
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
          <h1 className="text-2xl font-bold text-gray-900">Logg inn</h1>
          <p className="text-gray-500 text-sm mt-1">Velkommen tilbake</p>
        </div>
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-post</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="din@bedrift.no" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passord</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="••••••••" className="input" />
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">{error}</div>}
            <button onClick={submit} disabled={loading} className="btn-primary w-full">
              {loading ? 'Logger inn...' : 'Logg inn'}
            </button>
          </div>
          <div className="mt-4 text-center"><Link href="/glemt-passord" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Glemt passord?</Link></div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Ingen konto? <Link href="/register" className="text-green-600 font-semibold hover:underline">Registrer deg</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
