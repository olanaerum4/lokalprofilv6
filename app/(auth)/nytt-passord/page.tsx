'use client'
import { useState, useEffect } from 'react'
import { browserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NyttPassord() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function submit() {
    if (!password || password.length < 6) { setError('Passordet må være minst 6 tegn'); return }
    if (password !== confirm) { setError('Passordene er ikke like'); return }
    setLoading(true); setError('')
    const { error } = await browserClient().auth.updateUser({ password })
    if (error) setError(error.message)
    else { setDone(true); setTimeout(() => router.push('/dashboard'), 2000) }
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
          <h1 className="text-2xl font-bold text-gray-900">Lag nytt passord</h1>
        </div>
        <div className="card">
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              </div>
              <p className="font-bold text-gray-900">Passord oppdatert!</p>
              <p className="text-sm text-gray-500 mt-1">Sender deg til dashbordet...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nytt passord</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minst 6 tegn" className="input" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bekreft passord</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Gjenta passord" className="input" />
              </div>
              {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">{error}</div>}
              <button onClick={submit} disabled={loading || !password || !confirm} className="btn-primary w-full">
                {loading ? 'Lagrer...' : 'Lagre nytt passord'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
