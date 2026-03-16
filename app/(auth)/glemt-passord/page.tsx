'use client'
import { useState } from 'react'
import { browserClient } from '@/lib/supabase'
import Link from 'next/link'

export default function GlemtPassord() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!email) return
    setLoading(true); setError('')
    const { error } = await browserClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nytt-passord`,
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <span className="text-xl font-bold text-gray-900">LokalProfil</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Glemt passord?</h1>
          <p className="text-gray-500 text-sm mt-1">Vi sender deg en tilbakestillingslenke</p>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h2 className="font-bold text-gray-900 mb-2">Sjekk e-posten din</h2>
              <p className="text-sm text-gray-500 mb-5">Vi har sendt en lenke til <strong>{email}</strong>. Klikk lenken for å lage nytt passord.</p>
              <Link href="/login" className="btn-primary block text-center">Tilbake til innlogging</Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-postadresse</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder="din@bedrift.no" className="input" autoFocus
                />
              </div>
              {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">{error}</div>}
              <button onClick={submit} disabled={loading || !email} className="btn-primary w-full">
                {loading ? 'Sender...' : 'Send tilbakestillingslenke'}
              </button>
              <Link href="/login" className="block text-center text-sm text-gray-400 hover:text-gray-700 transition-colors">
                ← Tilbake til innlogging
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
