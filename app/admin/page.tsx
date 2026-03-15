import { redirect } from 'next/navigation'
import { adminClient } from '@/lib/supabase-server'
import { serverClient } from '@/lib/supabase-server'
import Link from 'next/link'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'olanaerum4@gmail.com'
const PLAN_PRICE = 299
const SMS_OVERAGE = 0.40
const SMS_INCLUDED = 100

function fmt(ts: string) {
  return new Date(ts).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtTime(ts: string) {
  return new Date(ts).toLocaleString('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default async function AdminDashboard() {
  const sb = await serverClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard')

  const admin = adminClient()

  // Fetch all businesses with their stats
  const { data: businesses } = await admin
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false })

  const bizIds = businesses?.map(b => b.id) ?? []

  // Fetch customer counts per business
  const { data: customerCounts } = await admin
    .from('customers')
    .select('business_id')

  // Fetch feedback per business
  const { data: allFeedback } = await admin
    .from('feedback')
    .select('business_id, rating')

  // Fetch total messages sent per business
  const { data: allMessages } = await admin
    .from('messages')
    .select('business_id, direction, created_at')

  // Aggregate stats per business
  const bizStats = businesses?.map(biz => {
    const customers = customerCounts?.filter(c => c.business_id === biz.id).length ?? 0
    const feedback = allFeedback?.filter(f => f.business_id === biz.id) ?? []
    const avgRating = feedback.length
      ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
      : null
    const smsSent = biz.sms_count_month ?? 0
    const smsTotal = allMessages?.filter(m => m.business_id === biz.id && m.direction === 'out').length ?? 0
    const overage = Math.max(0, smsSent - SMS_INCLUDED)
    const monthlyRevenue = PLAN_PRICE + (overage * SMS_OVERAGE)
    const daysSinceSignup = Math.floor((Date.now() - new Date(biz.created_at).getTime()) / 86400000)

    return { ...biz, customers, avgRating, smsSent, smsTotal, overage, monthlyRevenue, daysSinceSignup }
  }) ?? []

  // Top-level stats
  const totalBusinesses = bizStats.length
  const activeThisMonth = bizStats.filter(b => (b.sms_count_month ?? 0) > 0).length
  const mrr = bizStats.length * PLAN_PRICE
  const totalOverage = bizStats.reduce((s, b) => s + (b.overage * SMS_OVERAGE), 0)
  const totalRevenue = mrr + totalOverage
  const totalCustomers = bizStats.reduce((s, b) => s + b.customers, 0)
  const totalSmsSent = bizStats.reduce((s, b) => s + (b.sms_count_month ?? 0), 0)
  const avgRatingAll = allFeedback?.length
    ? (allFeedback.reduce((s, f) => s + f.rating, 0) / allFeedback.length).toFixed(1)
    : null

  // New signups last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const newThisMonth = bizStats.filter(b => b.created_at > thirtyDaysAgo).length

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <h1 className="text-xl font-bold text-white">LokalProfil Admin</h1>
          </div>
          <p className="text-gray-500 text-sm">
            {new Date().toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Til app
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="MRR" value={`${mrr.toLocaleString('nb-NO')} kr`} sub={`+ ${totalOverage.toFixed(0)} kr overage`} accent="green" />
        <KpiCard label="Total inntekt (est.)" value={`${totalRevenue.toFixed(0)} kr`} sub="denne måneden" accent="green" />
        <KpiCard label="Betalende kunder" value={totalBusinesses} sub={`+${newThisMonth} siste 30 dager`} accent="blue" />
        <KpiCard label="Aktive denne mnd" value={activeThisMonth} sub={`av ${totalBusinesses} totalt`} accent="purple" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Totale sluttbrukere" value={totalCustomers} sub="kunder registrert" />
        <KpiCard label="SMS sendt (mnd)" value={totalSmsSent} sub={`${bizStats.filter(b => b.overage > 0).length} bedrifter over kvoten`} />
        <KpiCard label="Snittkarakter" value={avgRatingAll ? `${avgRatingAll} ★` : '–'} sub={`${allFeedback?.length ?? 0} tilbakemeldinger`} />
        <KpiCard label="Churn" value="0" sub="ingen avslutninger ennå" />
      </div>

      {/* Customer table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Alle bedrifter</h2>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">{totalBusinesses} totalt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Bedrift', 'E-post', 'Kunder', 'SMS (mnd)', 'Overage', 'Inntekt', 'Snitt', 'Registrert', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bizStats.map((biz, i) => (
                <tr key={biz.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-900/50'}`}>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-white">{biz.name || '–'}</p>
                      {biz.google_review_link && <p className="text-[10px] text-green-500 mt-0.5">✓ Google-lenke</p>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{biz.email}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-white">{biz.customers}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${biz.smsSent > 100 ? 'bg-red-500' : biz.smsSent > 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, (biz.smsSent / SMS_INCLUDED) * 100)}%` }} />
                      </div>
                      <span className={`font-semibold ${biz.smsSent > 100 ? 'text-red-400' : 'text-white'}`}>{biz.smsSent}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {biz.overage > 0
                      ? <span className="text-red-400 font-semibold">+{biz.overage} SMS</span>
                      : <span className="text-gray-600">–</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-green-400">{biz.monthlyRevenue.toFixed(0)} kr</span>
                    {biz.overage > 0 && <span className="text-xs text-red-400 ml-1">(+{(biz.overage * SMS_OVERAGE).toFixed(0)})</span>}
                  </td>
                  <td className="px-5 py-4">
                    {biz.avgRating
                      ? <span className="text-amber-400 font-semibold">{biz.avgRating} ★</span>
                      : <span className="text-gray-600">–</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    <div>{fmt(biz.created_at)}</div>
                    <div className="text-gray-600">{biz.daysSinceSignup}d siden</div>
                  </td>
                  <td className="px-5 py-4">
                    {biz.onboarding_done
                      ? <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full font-semibold">Aktiv</span>
                      : <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full font-semibold">Onboarding</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bizStats.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <p className="text-4xl mb-3">📭</p>
              <p>Ingen bedrifter registrert ennå</p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-semibold text-white mb-5">Inntektsfordeling</h2>
          <div className="space-y-3">
            <RevenueRow label="Abonnementer" value={`${totalBusinesses} × 299 kr`} amount={mrr} />
            <RevenueRow label="SMS overage" value={`${bizStats.reduce((s,b)=>s+b.overage,0)} × 0,40 kr`} amount={totalOverage} highlight />
            <div className="border-t border-gray-800 pt-3 mt-3">
              <RevenueRow label="Total (est.)" value="denne måneden" amount={totalRevenue} bold />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-semibold text-white mb-5">SMS-forbruk topp 5</h2>
          <div className="space-y-3">
            {bizStats
              .sort((a, b) => b.smsSent - a.smsSent)
              .slice(0, 5)
              .map(biz => (
                <div key={biz.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                    {biz.name?.charAt(0) ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-300 truncate">{biz.name || biz.email}</p>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1">
                      <div className={`h-1.5 rounded-full ${biz.smsSent > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (biz.smsSent / Math.max(...bizStats.map(b => b.smsSent), 1)) * 100)}%` }} />
                    </div>
                  </div>
                  <span className={`text-sm font-bold flex-shrink-0 ${biz.smsSent > 100 ? 'text-red-400' : 'text-gray-300'}`}>
                    {biz.smsSent}
                  </span>
                </div>
              ))}
            {bizStats.length === 0 && <p className="text-gray-600 text-sm">Ingen data</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  const colors: Record<string, string> = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    default: 'text-white',
  }
  const color = colors[accent ?? 'default']
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  )
}

function RevenueRow({ label, value, amount, highlight, bold }: { label: string; value: string; amount: number; highlight?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm ${bold ? 'font-bold text-white' : 'text-gray-300'}`}>{label}</p>
        <p className="text-xs text-gray-600">{value}</p>
      </div>
      <span className={`font-bold ${bold ? 'text-green-400 text-lg' : highlight ? 'text-red-400' : 'text-gray-300'}`}>
        {amount.toFixed(0)} kr
      </span>
    </div>
  )
}
