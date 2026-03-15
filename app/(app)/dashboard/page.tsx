import { serverClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TestSmsWidget from './TestSmsWidget'

function fmt(ts: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(ts).toLocaleString('nb-NO', opts)
}

const SMS_INCLUDED = 100
const SMS_OVERAGE_PRICE = 0.40

export default async function Dashboard() {
  const sb = await serverClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: biz } = await sb.from('businesses').select('*').eq('id', user.id).single()
  if (!biz) redirect('/onboarding')

  const now = new Date()
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0)
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999)
  const monthAgo = new Date(now.getTime() - 30 * 86400000)

  const [
    { data: todayC },
    { count: totalC },
    { data: allFeedback },
    { data: recentFeedback },
    { count: cancelledCount },
    { count: noShowCount },
  ] = await Promise.all([
    sb.from('customers').select('*').eq('business_id', user.id)
      .gte('appointment_time', todayStart.toISOString())
      .lte('appointment_time', todayEnd.toISOString())
      .order('appointment_time'),
    sb.from('customers').select('*', { count: 'exact', head: true }).eq('business_id', user.id),
    sb.from('feedback').select('rating').eq('business_id', user.id).gte('created_at', monthAgo.toISOString()),
    sb.from('feedback').select('*, customers(name)').eq('business_id', user.id)
      .order('created_at', { ascending: false }).limit(4),
    sb.from('customers').select('*', { count: 'exact', head: true }).eq('business_id', user.id).eq('cancelled', true),
    sb.from('customers').select('*', { count: 'exact', head: true }).eq('business_id', user.id).eq('no_show', true),
  ])

  const avg = allFeedback?.length
    ? (allFeedback.reduce((s, f) => s + f.rating, 0) / allFeedback.length).toFixed(1)
    : null
  const positive = allFeedback?.filter(f => f.rating >= 4).length ?? 0
  const satisfactionPct = allFeedback?.length ? Math.round((positive / allFeedback.length) * 100) : null
  const upcoming = todayC?.filter(c => new Date(c.appointment_time) >= now && !c.cancelled) ?? []
  const past = todayC?.filter(c => new Date(c.appointment_time) < now) ?? []

  // SMS usage
  const smsUsed = biz.sms_count_month ?? 0
  const smsOver = Math.max(0, smsUsed - SMS_INCLUDED)
  const smsExtraCost = smsOver * SMS_OVERAGE_PRICE
  const smsPct = Math.min(100, Math.round((smsUsed / SMS_INCLUDED) * 100))
  const isOverLimit = smsUsed > SMS_INCLUDED

  // Period
  const periodStart = biz.sms_period_start
    ? new Date(biz.sms_period_start).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })
    : null

  return (
    <div className="p-5 md:p-7 max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {now.toLocaleDateString('nb-NO', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </p>
        </div>
        <Link href="/kunder" className="btn-primary hidden md:inline-flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Ny kunde
        </Link>
      </div>

      {/* BILLING ALERT - shown prominently when over limit */}
      {isOverLimit && (
        <div className="mb-5 bg-red-50 border-2 border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-red-800 text-base">Du har brukt {smsUsed} av 100 inkluderte SMS</p>
              <p className="text-red-600 text-sm mt-1">
                {smsOver} SMS over kvoten → <strong>{smsExtraCost.toFixed(2).replace('.', ',')} kr</strong> ekstra denne måneden (à 0,40 kr/SMS)
              </p>
              <p className="text-red-500 text-xs mt-2">Faktureres ved månedsslutt. Kontakt oss på <a href="mailto:kontakt@lokalprofil.no" className="underline font-semibold">kontakt@lokalprofil.no</a> ved spørsmål.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Timer i dag', value: todayC?.filter(c => !c.cancelled).length ?? 0, icon: '📅' },
          { label: 'Totale kunder', value: totalC ?? 0, icon: '👥' },
          { label: avg ? 'Snitt (30d)' : 'Snitt', value: avg ? `${avg} ★` : '–', icon: '⭐', highlight: avg !== null && parseFloat(avg) >= 4, sub: satisfactionPct !== null ? `${satisfactionPct}% fornøyde` : undefined },
          { label: 'Avbestillinger', value: cancelledCount ?? 0, icon: '❌', sub: `${noShowCount ?? 0} no-shows` },
        ].map(s => (
          <div key={s.label} className={`card ${s.highlight ? 'border-green-200 bg-green-50' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide leading-tight">{s.label}</p>
              <span className="text-base leading-none">{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${s.highlight ? 'text-green-700' : 'text-gray-900'}`}>{s.value}</p>
            {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Today's schedule */}
        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Timeplan i dag</h2>
            <Link href="/kunder" className="text-xs text-green-600 font-semibold hover:underline">+ Legg til</Link>
          </div>
          {!todayC?.length ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-gray-400">Ingen timer booket i dag</p>
              <Link href="/kunder" className="text-xs text-green-600 font-semibold mt-2 inline-block hover:underline">Legg til første kunde →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {[...upcoming, ...past].map(c => {
                const isUpcoming = new Date(c.appointment_time) >= now && !c.cancelled
                return (
                  <div key={c.id} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 border ${
                    c.cancelled ? 'bg-red-50 border-red-100' :
                    c.no_show ? 'bg-orange-50 border-orange-100' :
                    isUpcoming ? 'bg-green-50 border-green-100' :
                    'bg-gray-50 border-gray-100'
                  }`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.cancelled ? 'bg-red-400' : c.no_show ? 'bg-orange-400' : isUpcoming ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${c.cancelled || c.no_show ? 'line-through text-gray-400' : !isUpcoming ? 'text-gray-500' : 'text-gray-900'}`}>{c.name}</p>
                      <p className="text-xs text-gray-400">{c.phone}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {c.cancelled && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Avbestilt</span>}
                      {c.no_show && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">No-show</span>}
                      {c.reminded_24h && !c.cancelled && <span className="text-[10px] bg-white text-green-600 border border-green-200 px-1.5 py-0.5 rounded-full font-semibold">SMS ✓</span>}
                      <span className={`text-xs font-mono font-semibold ${isUpcoming ? 'text-green-700' : 'text-gray-400'}`}>
                        {fmt(c.appointment_time, { hour:'2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* SMS usage widget */}
          <div className={`card ${isOverLimit ? 'border-red-200' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">SMS denne måneden</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isOverLimit ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                {smsUsed} / 100
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full transition-all ${isOverLimit ? 'bg-red-500' : smsPct > 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, smsPct)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>{smsUsed} sendt</span>
              <span>{Math.max(0, SMS_INCLUDED - smsUsed)} igjen</span>
            </div>
            {isOverLimit ? (
              <div className="bg-red-50 rounded-xl px-3 py-2.5 text-xs text-red-600 border border-red-100">
                <strong>{smsOver} SMS over kvoten</strong> = {smsExtraCost.toFixed(2).replace('.', ',')} kr ekstra
              </div>
            ) : smsPct > 75 ? (
              <div className="bg-amber-50 rounded-xl px-3 py-2.5 text-xs text-amber-700 border border-amber-100">
                Nærmer deg grensen på 100 SMS
              </div>
            ) : (
              <p className="text-xs text-gray-400">Inkluderer 100 SMS/mnd · 0,40 kr/SMS deretter</p>
            )}
            {periodStart && <p className="text-xs text-gray-300 mt-2">Periode startet {periodStart}</p>}
          </div>

          {/* Recent feedback */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Tilbakemeldinger</h2>
              <Link href="/tilbakemeldinger" className="text-xs text-green-600 font-semibold hover:underline">Se alle</Link>
            </div>
            {!recentFeedback?.length ? (
              <p className="text-xs text-gray-400 text-center py-4">Ingen ennå</p>
            ) : (
              <div className="space-y-2.5">
                {recentFeedback.map((f: any) => (
                  <div key={f.id} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                      {f.customers?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{f.customers?.name}</p>
                      <p className="text-xs text-amber-500">{'★'.repeat(f.rating)}<span className="text-gray-200">{'★'.repeat(5 - f.rating)}</span></p>
                    </div>
                    <span className="text-[10px] text-gray-300 flex-shrink-0">{fmt(f.created_at, { day:'numeric', month:'short' })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Hurtiglenker</h2>
            <div className="space-y-1.5">
              {[
                { href: '/meldinger', icon: '💬', label: 'Meldingsboks' },
                { href: '/api/export?type=kunder', icon: '📥', label: 'Eksporter kunder (CSV)', external: true },
                { href: '/innstillinger', icon: '⚙️', label: 'Innstillinger' },
              ].map(item => (
                item.external
                  ? <a key={item.href} href={item.href} target="_blank" rel="noopener" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600 hover:text-gray-900 font-medium"><span>{item.icon}</span>{item.label}</a>
                  : <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600 hover:text-gray-900 font-medium"><span>{item.icon}</span>{item.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Test SMS */}
      <TestSmsWidget bizPhone={biz.phone} />

      {!biz.google_review_link && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-xl">🌟</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Legg til Google-anmeldelseslenke</p>
            <p className="text-xs text-amber-600 mt-0.5">Sendes automatisk til kunder etter besøket.</p>
          </div>
          <Link href="/innstillinger" className="btn-primary text-xs px-4 py-2 flex-shrink-0">Sett opp</Link>
        </div>
      )}
    </div>
  )
}
