'use client'
import { useState } from 'react'

export default function TestSmsWidget({ bizPhone }: { bizPhone: string | null }) {
  const [phone, setPhone] = useState(bizPhone ?? '')
  const [message, setMessage] = useState('Hei! Dette er en test-SMS fra LokalProfil 🎉')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [open, setOpen] = useState(false)

  async function send() {
    if (!phone || !message) return
    setSending(true); setResult(null)
    try {
      const r = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, message }),
      })
      const d = await r.json()
      setResult(d.ok
        ? { ok: true, msg: '✓ SMS sendt! Sjekk telefonen.' }
        : { ok: false, msg: '✗ ' + (d.error ?? 'Ukjent feil') }
      )
    } catch { setResult({ ok: false, msg: '✗ Nettverksfeil' }) }
    setSending(false)
  }

  return (
    <div className="card">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-lg">📱</span>
          <h2 className="font-semibold text-gray-900">Test SMS-utsending</h2>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Telefonnummer</label>
            <input
              className="input"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+4741001984"
              type="tel"
            />
            <p className="text-xs text-gray-400 mt-1">Husk landskode, f.eks. +47 for Norge</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Melding</label>
            <textarea
              className="input resize-none"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          {result && (
            <div className={`text-sm rounded-xl px-4 py-3 border ${result.ok ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {result.msg}
            </div>
          )}
          <button onClick={send} disabled={sending || !phone || !message} className="btn-primary w-full">
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Sender...
              </span>
            ) : 'Send test-SMS'}
          </button>
        </div>
      )}
    </div>
  )
}
