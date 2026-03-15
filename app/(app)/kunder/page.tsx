'use client'
import { useEffect, useState } from 'react'
import { browserClient } from '@/lib/supabase'
import { Customer } from '@/lib/types'

export default function Kunder() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bizId, setBizId] = useState('')
  const sb = browserClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      setBizId(user.id)
      const { data } = await sb.from('customers').select('*').eq('business_id', user.id).order('appointment_time', { ascending: false })
      setCustomers(data ?? [])
    }
    load()
  }, [])

  async function addCustomer() {
    if (!name || !phone || !date || !time) return
    setLoading(true)
    const { data, error } = await sb.from('customers').insert({
      business_id: bizId, name, phone,
      appointment_time: new Date(`${date}T${time}`).toISOString(),
    }).select().single()
    if (!error && data) {
      setCustomers(prev => [data, ...prev])
      setName(''); setPhone(''); setDate(''); setTime('')
      setSuccess(true); setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  async function deleteCustomer(id: string) {
    await sb.from('customers').delete().eq('id', id)
    setCustomers(prev => prev.filter(c => c.id !== id))
  }

  async function toggleNoShow(id: string, current: boolean) {
    await sb.from('customers').update({ no_show: !current }).eq('id', id)
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, no_show: !current } : c))
  }

  const now = new Date()
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )
  const upcoming = filtered.filter(c => new Date(c.appointment_time) >= now && !c.cancelled)
  const cancelled = filtered.filter(c => c.cancelled)
  const past = filtered.filter(c => new Date(c.appointment_time) < now && !c.cancelled)

  return (
    <div className="p-5 md:p-7 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kunder</h1>
          <p className="text-gray-400 text-sm mt-0.5">{customers.length} totalt</p>
        </div>
        <a href="/api/export?type=kunder" className="btn-secondary text-xs hidden md:inline-flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Eksporter CSV
        </a>
      </div>

      <div className="grid md:grid-cols-5 gap-5">
        {/* Add form */}
        <div className="md:col-span-2 card self-start sticky top-5">
          <h2 className="font-semibold text-gray-900 mb-4">Legg til kunde</h2>
          <div className="space-y-3">
            {[
              { label: 'Navn', val: name, set: setName, ph: 'Ola Nordmann', type: 'text' },
              { label: 'Telefon', val: phone, set: setPhone, ph: '+47 900 00 000', type: 'tel' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                <input className="input" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} type={f.type} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Dato</label>
                <input className="input" value={date} onChange={e => setDate(e.target.value)} type="date" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tid</label>
                <input className="input" value={time} onChange={e => setTime(e.target.value)} type="time" />
              </div>
            </div>
            {success && <div className="bg-green-50 text-green-700 text-xs rounded-xl px-3 py-2 border border-green-100">✓ Lagt til! SMS sendes automatisk.</div>}
            <button onClick={addCustomer} disabled={loading || !name || !phone || !date || !time} className="btn-primary w-full">
              {loading ? 'Lagrer...' : 'Legg til kunde'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed border-t border-gray-50 pt-3">
            SMS med avbestillingslenke sendes 24t og 2t før. Tilbakemeldingsspørsmål 1t etter.
          </p>
        </div>

        {/* List */}
        <div className="md:col-span-3 space-y-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input className="input pl-10" placeholder="Søk navn eller telefon..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {upcoming.length > 0 && <>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Kommende ({upcoming.length})</p>
            {upcoming.map(c => <Row key={c.id} c={c} onDelete={deleteCustomer} onNoShow={toggleNoShow} />)}
          </>}

          {cancelled.length > 0 && <>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Avbestilt ({cancelled.length})</p>
            {cancelled.map(c => <Row key={c.id} c={c} onDelete={deleteCustomer} onNoShow={toggleNoShow} />)}
          </>}

          {past.length > 0 && <>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Tidligere ({past.length})</p>
            {past.map(c => <Row key={c.id} c={c} onDelete={deleteCustomer} onNoShow={toggleNoShow} />)}
          </>}

          {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-12">Ingen kunder funnet</p>}
        </div>
      </div>
    </div>
  )
}

function Row({ c, onDelete, onNoShow }: { c: Customer; onDelete: (id: string) => void; onNoShow: (id: string, cur: boolean) => void }) {
  const [confirm, setConfirm] = useState(false)
  const now = new Date()
  const upcoming = new Date(c.appointment_time) >= now && !c.cancelled

  return (
    <div className={`bg-white rounded-xl border p-3.5 flex items-center gap-3 ${
      c.cancelled ? 'border-red-100 bg-red-50' :
      c.no_show ? 'border-orange-100 bg-orange-50' :
      upcoming ? 'border-gray-100' : 'border-gray-50'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        c.cancelled ? 'bg-red-100 text-red-500' :
        c.no_show ? 'bg-orange-100 text-orange-600' :
        upcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {c.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${c.cancelled || c.no_show ? 'text-gray-400 line-through' : !upcoming ? 'text-gray-500' : 'text-gray-900'}`}>
          {c.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-xs text-gray-400">{c.phone}</p>
          {c.cancelled && <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-semibold">Avbestilt</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <p className={`text-xs font-mono font-semibold ${upcoming ? 'text-green-700' : 'text-gray-400'}`}>
            {new Date(c.appointment_time).toLocaleString('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
          <div className="flex gap-1 justify-end mt-1">
            {c.reminded_24h && <span className="text-[9px] bg-green-50 text-green-600 px-1 py-0.5 rounded font-semibold">24t</span>}
            {c.reminded_2h && <span className="text-[9px] bg-green-50 text-green-600 px-1 py-0.5 rounded font-semibold">2t</span>}
            {c.review_requested && <span className="text-[9px] bg-green-50 text-green-600 px-1 py-0.5 rounded font-semibold">★</span>}
          </div>
        </div>

        {!c.cancelled && new Date(c.appointment_time) < now && (
          <button onClick={() => onNoShow(c.id, c.no_show)}
            className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
              c.no_show ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-orange-300 hover:text-orange-500'
            }`}>
            {c.no_show ? '⚠ No-show' : 'No-show?'}
          </button>
        )}

        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        ) : (
          <div className="flex gap-1">
            <button onClick={() => onDelete(c.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-semibold">Slett</button>
            <button onClick={() => setConfirm(false)} className="text-xs text-gray-500 px-2 py-1 rounded-lg">Avbryt</button>
          </div>
        )}
      </div>
    </div>
  )
}
