import { serverClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

function fmt(ts: string) {
  return new Date(ts).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
}

export default async function Statistikk() {
  const sb = await serverClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: biz } = await sb.from('businesses').select('*').eq('id', user.id).single()
  if (!biz) redirect('/onboarding')

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString()

  const [
    { data: allCustomers },
    { data: allFeedback },
    { data: recentCustomers },
  ] = await Promise.all([
    sb.from('customers').select('*').eq('business_id', user.id).order('created_at'),
    sb.from('feedback').select('*').eq('business_id', user.id).order('created_at'),
    sb.from('customers').select('*').eq('business_id', user.id)
      .gte('created_at', thirtyDaysAgo).order('created_at'),
  ])

  const customers = allCustomers ?? []
  const feedback = allFeedback ?? []

  // Ratings distribution
  const ratingDist = [1,2,3,4,5].map(r => ({
    rating: r,
    count: feedback.filter(f => f.rating === r).length,
    label: ['Dårlig','OK','Bra','Veldig bra','Fantastisk'][r-1],
  }))
  const maxRating = Math.max(...ratingDist.map(d => d.count), 1)

  // SMS stats
  const totalSent = customers.filter(c => c.reminded_24h).length +
    customers.filter(c => c.reminded_2h).length +
    customers.filter(c => c.review_requested).length
  const cancelRate = customers.length
    ? Math.round((customers.filter(c => c.cancelled).length / customers.length) * 100)
    : 0
  const noShowRate = customers.length
    ? Math.round((customers.filter(c => c.no_show).length / customers.length) * 100)
    : 0
  const reviewRate = customers.filter(c => c.review_requested).length
    ? Math.round((feedback.length / customers.filter(c => c.review_requested).length) * 100)
    : 0

  // Avg rating
  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : null

  // Customers per weekday
  const weekdayCounts = [0,1,2,3,4,5,6].map(d => ({
    day: ['Man','Tir','Ons','Tor','Fre','Lør','Søn'][d],
    count: customers.filter(c => {
      const day = new Date(c.appointment_time).getDay()
      return day === (d + 1) % 7
    }).length,
  }))
  const maxWeekday = Math.max(...weekdayCounts.map(d => d.count), 1)

  // Customers per hour
  const hourCounts = Array.from({ length: 13 }, (_, i) => i + 7).map(h => ({
    hour: `${h}:00`,
    count: customers.filter(c => new Date(c.appointment_time).getHours() === h).length,
  }))
  const maxHour = Math.max(...hourCounts.map(h => h.count), 1)

  // Last 8 weeks signup trend
  const weeklySignups = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now.getTime() - (7 - i) * 7 * 86400000)
    const weekEnd = new Date(weekStart.getTime() + 7 * 86400000)
    return {
      label: `${weekStart.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}`,
      count: customers.filter(c => {
        const d = new Date(c.created_at)
        return d >= weekStart && d < weekEnd
      }).length,
    }
  })
  const maxWeekly = Math.max(...weeklySignups.map(w => w.count), 1)

  return (
    <div className="p-5 md:p-7 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Statistikk</h1>
        <p className="text-gray-400 text-sm mt-1">Innsikt om din bedrift og kunder</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Totale kunder', value: customers.length, icon: '👥' },
          { label: 'Snittkarakter', value: avgRating ? `${avgRating} ★` : '–', icon: '⭐' },
          { label: 'Avbestillingsrate', value: `${cancelRate}%`, icon: '❌', sub: `${customers.filter(c=>c.cancelled).length} avbestilte` },
          { label: 'No-show rate', value: `${noShowRate}%`, icon: '🚫', sub: `${customers.filter(c=>c.no_show).length} no-shows` },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide leading-tight">{s.label}</p>
              <span className="text-base">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Rating distribution */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Karakterfordeling</h2>
          {feedback.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Ingen tilbakemeldinger ennå</p>
          ) : (
            <div className="space-y-3">
              {ratingDist.reverse().map(d => (
                <div key={d.rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-24 flex-shrink-0">
                    <span className="text-xs font-bold text-gray-500 w-3">{d.rating}</span>
                    <span className="text-xs text-amber-400">{'★'.repeat(d.rating)}</span>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="h-3 rounded-full bg-amber-400 transition-all"
                      style={{ width: `${(d.count / maxRating) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-6 text-right">{d.count}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Svarprosent</span>
                  <span className="font-semibold text-gray-700">{reviewRate}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Weekday distribution */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Timer per ukedag</h2>
          {customers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Ingen kunder ennå</p>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {weekdayCounts.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-500">{d.count > 0 ? d.count : ''}</span>
                  <div className="w-full bg-gray-100 rounded-t-lg flex-1 flex items-end">
                    <div className="w-full bg-green-500 rounded-t-lg transition-all"
                      style={{ height: `${Math.max(4, (d.count / maxWeekday) * 100)}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{d.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly trend */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Nye kunder per uke (siste 8 uker)</h2>
          {customers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Ingen kunder ennå</p>
          ) : (
            <div className="flex items-end gap-1.5 h-28">
              {weeklySignups.map((w, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-500">{w.count > 0 ? w.count : ''}</span>
                  <div className="w-full bg-gray-100 rounded-t flex-1 flex items-end">
                    <div className="w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${Math.max(4, (w.count / maxWeekly) * 100)}%` }} />
                  </div>
                  <span className="text-[9px] text-gray-400 text-center leading-tight">{w.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular hours */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Populære timer</h2>
          {customers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Ingen kunder ennå</p>
          ) : (
            <div className="space-y-1.5">
              {hourCounts.filter(h => h.count > 0).sort((a,b) => b.count - a.count).slice(0,6).map(h => (
                <div key={h.hour} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500 w-10">{h.hour}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${(h.count / maxHour) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-4 text-right">{h.count}</span>
                </div>
              ))}
              {hourCounts.filter(h => h.count > 0).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Ingen timer booket</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SMS stats */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">SMS-statistikk</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '24t påminnelser sendt', value: customers.filter(c=>c.reminded_24h).length, color: 'text-green-600' },
            { label: '2t påminnelser sendt', value: customers.filter(c=>c.reminded_2h).length, color: 'text-green-600' },
            { label: 'Google-SMS sendt', value: customers.filter(c=>c.review_requested).length, color: 'text-blue-600' },
            { label: 'Totalt SMS sendt', value: totalSent, color: 'text-gray-900' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
