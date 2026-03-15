'use client'
import { useEffect, useState, useRef } from 'react'
import { browserClient } from '@/lib/supabase'
import { Customer } from '@/lib/types'

type Msg = { id: string; direction: 'in' | 'out'; body: string; created_at: string }

export default function Meldinger() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selected, setSelected] = useState<Customer | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [bizId, setBizId] = useState('')
  const [search, setSearch] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const sb = browserClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      setBizId(user.id)
      const { data } = await sb.from('customers').select('*').eq('business_id', user.id).order('created_at', { ascending: false })
      setCustomers(data ?? [])
    }
    load()
  }, [])

  useEffect(() => {
    if (!selected) return
    loadMessages(selected.id)
    const channel = sb.channel(`msgs-${selected.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `customer_id=eq.${selected.id}` },
        payload => setMessages(prev => [...prev, payload.new as Msg]))
      .subscribe()
    return () => { sb.removeChannel(channel) }
  }, [selected])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadMessages(customerId: string) {
    const { data } = await sb.from('messages').select('*').eq('customer_id', customerId).order('created_at')
    setMessages(data ?? [])
  }

  async function sendMessage() {
    if (!text.trim() || !selected) return
    setSending(true)
    const body = text.trim(); setText('')
    // Save to DB
    const { data } = await sb.from('messages').insert({
      business_id: (await sb.auth.getUser()).data.user?.id ?? bizId, customer_id: selected.id, direction: 'out', body,
    }).select().single()
    if (data) setMessages(prev => [...prev, data])
    // Send via API
    await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: selected.phone, message: body }),
    })
    setSending(false)
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  function fmtTime(ts: string) {
    const d = new Date(ts)
    const today = new Date()
    if (d.toDateString() === today.toDateString())
      return d.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  // Get last message per customer for preview

  return (
    <div className="flex h-screen md:h-[calc(100vh-0px)] overflow-hidden">
      {/* Customer list */}
      <div className={`${selected ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-72 bg-white border-r border-gray-100 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Meldinger</h1>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input className="input pl-9 text-xs" placeholder="Søk kunde..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-12 px-4">Ingen kunder ennå.<br/>Legg til kunder under Kunder.</p>
          )}
          {filtered.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 text-left transition-colors hover:bg-gray-50 ${selected?.id === c.id ? 'bg-green-50' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${selected?.id === c.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 truncate">{c.phone}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="md:hidden text-gray-400 hover:text-gray-700 mr-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 flex-shrink-0">
              {selected.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{selected.name}</p>
              <p className="text-xs text-gray-400">{selected.phone}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <p className="text-sm text-gray-400">Ingen meldinger ennå</p>
                <p className="text-xs text-gray-300 mt-1">Send en melding for å starte samtalen</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.direction === 'out'
                    ? 'bg-green-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                }`}>
                  <p>{m.body}</p>
                  <p className={`text-[10px] mt-1 ${m.direction === 'out' ? 'text-green-200' : 'text-gray-400'}`}>{fmtTime(m.created_at)}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 p-3 flex gap-2">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Skriv en melding..."
              rows={1}
              className="flex-1 input resize-none py-2.5 text-sm"
              style={{ minHeight: '42px', maxHeight: '120px' }}
            />
            <button onClick={sendMessage} disabled={sending || !text.trim()}
              className="btn-primary px-4 flex-shrink-0 flex items-center gap-1.5">
              {sending ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              )}
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Velg en kunde for å se meldinger</p>
          </div>
        </div>
      )}
    </div>
  )
}
