import { redirect } from 'next/navigation'
import { adminClient } from '@/lib/supabase-server'
import { serverClient } from '@/lib/supabase-server'
import Link from 'next/link'

// Access: set ADMIN_EMAIL in Vercel env vars
// Fallback: allow any logged-in user to access /admin?secret=YOUR_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'lokalprofil-admin-2026'

const PLAN_PRICE = 299
const SMS_OVERAGE = 0.40
const SMS_INCLUDED = 100

function fmt(ts: string) {
  return new Date(ts).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminDashboard({ searchParams }: { searchParams: { secret?: string } }) {
  const sb = await serverClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  // Allow access if: email matches ADMIN_EMAIL, OR correct secret in URL
  const hasEmailAccess = ADMIN_EMAIL && user.email === ADMIN_EMAIL
  const hasSecretAccess = searchParams.secret === ADMIN_SECRET

  if (!hasEmailAccess && !hasSecretAccess) {
    redirect('/dashboard')
  }

  const admin = adminClient()

  const { data: businesses } = await admin
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: customerCounts } = await admin.from('customers').select('business_id')
  const { data: allFeedback } = await admin.from('feedback').select('business_id, rating')
  const { data: allMessages } = await admin.from('messages').select('business_id, direction')

  const bizStats = businesses?.map(biz => {
    const customers = customerCounts?.filter(c => c.business_id === biz.id).length ?? 0
    const feedback = allFeedback?.filter(f => f.business_id === biz.id) ?? []
    const avgRating = feedback.length ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : null
    const smsSent = biz.sms_count_month ?? 0
    const overage = Math.max(0, smsSent - SMS_INCLUDED)
    const monthlyRevenue = PLAN_PRICE + (overage * SMS_OVERAGE)
    const daysSinceSignup = Math.floor((Date.now() - new Date(biz.created_at).getTime()) / 86400000)
    const trialDaysLeft = Math.max(0, 7 - daysSinceSignup)
    return { ...biz, customers, avgRating, smsSent, overage, monthlyRevenue, daysSinceSignup, trialDaysLeft }
  }) ?? []

  const totalBusinesses = bizStats.length
  const paying = bizStats.filter(b => b.daysSinceSignup >= 7).length
  const trial = bizStats.filter(b => b.daysSinceSignup < 7).length
  const mrr = paying * PLAN_PRICE
  const totalOverage = bizStats.reduce((s, b) => s + (b.overage * SMS_OVERAGE), 0)
  const totalRevenue = mrr + totalOverage
  const totalCustomers = bizStats.reduce((s, b) => s + b.customers, 0)
  const totalSmsSent = bizStats.reduce((s, b) => s + (b.sms_count_month ?? 0), 0)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const newThisMonth = bizStats.filter(b => b.created_at > thirtyDaysAgo).length

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <h1 className="text-xl font-bold">LokalProfil Admin</h1>
          </div>
          <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('nb-NO', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">← Til app</Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KpiCard label="MRR" value={`${mrr.toLocaleString('nb-NO')} kr`} sub={`+ ${totalOverage.toFixed(0)} kr overage`} accent="green" />
        <KpiCard label="Total (est.)" value={`${totalRevenue.toFixed(0)} kr`} sub="denne måneden" accent="green" />
        <KpiCard label="Betalende" value={paying} sub={`${trial} i prøveperiode`} accent="blue" />
        <KpiCard label="Nye (30 dager)" value={newThisMonth} sub={`${totalBusinesses} totalt`} accent="purple" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Sluttbrukere" value={totalCustomers} />
        <KpiCard label="SMS sendt (mnd)" value={totalSmsSent} sub={`${bizStats.filter(b=>b.overage>0).length} over kvoten`} />
        <KpiCard label="Churn" value="0" sub="ingen avslutninger" />
        <KpiCard label="ARPU" value={paying > 0 ? `${(totalRevenue/paying).toFixed(0)} kr` : '–'} sub="per betalende kunde" />
      </div>

      {/* Trial expiring soon */}
      {bizStats.filter(b => b.trialDaysLeft > 0 && b.trialDaysLeft <= 3).length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-5">
          <p className="text-amber-400 font-semibold text-sm mb-2">⚠️ Prøveperiode utløper snart – send betalingslenke</p>
          <div className="space-y-1">
            {bizStats.filter(b => b.trialDaysLeft > 0 && b.trialDaysLeft <= 3).map(b => (
              <div key={b.id} className="flex items-center gap-3 text-sm">
                <span className="text-amber-300 font-semibold w-16">{b.trialDaysLeft}d igjen</span>
                <span className="text-white font-medium">{b.name}</span>
                <span className="text-gray-400">{b.email}</span>
                <span className="text-gray-400">{b.phone}</span>
                <a href={`mailto:${b.email}?subject=Din LokalProfil prøveperiode utløper&body=Hei ${b.name}!%0A%0ADin 7 dagers gratis prøveperiode utløper snart. For å fortsette å bruke LokalProfil er prisen 299 kr/mnd inkl. 100 SMS.%0A%0ATa kontakt på kontakt@lokalprofil.no for betalingslink.%0A%0AHilsen LokalProfil`}
                  className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg hover:bg-amber-500/30 transition-colors ml-auto">
                  Send e-post →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold">Alle bedrifter</h2>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">{totalBusinesses} totalt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Bedrift', 'E-post', 'Tlf', 'Kunder', 'SMS', 'Inntekt', 'Snitt', 'Status', 'Registrert'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bizStats.map((biz, i) => (
                <tr key={biz.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{biz.name || '–'}</p>
                    {biz.google_review_link && <p className="text-[10px] text-green-500 mt-0.5">✓ Google</p>}
                  </td>
                  <td className="px-4 py-4">
                    <a href={`mailto:${biz.email}`} className="text-xs text-blue-400 hover:text-blue-300">{biz.email}</a>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">{biz.phone ?? '–'}</td>
                  <td className="px-4 py-4 font-semibold text-white">{biz.customers}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${biz.smsSent > 100 ? 'bg-red-500' : biz.smsSent > 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, (biz.smsSent / SMS_INCLUDED) * 100)}%` }} />
                      </div>
                      <span className={`text-xs font-semibold ${biz.smsSent > 100 ? 'text-red-400' : 'text-gray-300'}`}>{biz.smsSent}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-green-400 font-semibold text-xs">{biz.monthlyRevenue.toFixed(0)} kr</span>
                  </td>
                  <td className="px-4 py-4">
                    {biz.avgRating ? <span className="text-amber-400 font-semibold">{biz.avgRating}★</span> : <span className="text-gray-600">–</span>}
                  </td>
                  <td className="px-4 py-4">
                    {biz.trialDaysLeft > 0
                      ? <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full font-semibold">{biz.trialDaysLeft}d igjen</span>
                      : biz.onboarding_done
                        ? <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full font-semibold">Aktiv</span>
                        : <span className="text-[10px] bg-gray-500/20 text-gray-400 border border-gray-500/30 px-2 py-1 rounded-full font-semibold">Onboarding</span>}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{fmt(biz.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {bizStats.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <p className="text-4xl mb-3">📭</p>
              <p>Ingen bedrifter ennå</p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-semibold mb-5">Inntektsfordeling</h2>
          <div className="space-y-3">
            <RevenueRow label="Abonnementer" value={`${paying} × 299 kr`} amount={mrr} />
            <RevenueRow label="SMS overage" value={`${bizStats.reduce((s,b)=>s+b.overage,0)} × 0,40 kr`} amount={totalOverage} highlight />
            <div className="border-t border-gray-800 pt-3">
              <RevenueRow label="Total (est.)" value="denne måneden" amount={totalRevenue} bold />
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-semibold mb-5">SMS-forbruk topp 5</h2>
          <div className="space-y-3">
            {bizStats.sort((a,b) => b.smsSent - a.smsSent).slice(0,5).map(biz => (
              <div key={biz.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                  {biz.name?.charAt(0) ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-300 truncate">{biz.name || biz.email}</p>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1">
                    <div className={`h-1.5 rounded-full ${biz.smsSent > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, (biz.smsSent / Math.max(...bizStats.map(b=>b.smsSent),1)) * 100)}%` }} />
                  </div>
                </div>
                <span className={`text-sm font-bold ${biz.smsSent > 100 ? 'text-red-400' : 'text-gray-300'}`}>{biz.smsSent}</span>
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
  const colors: Record<string, string> = { green: 'text-green-400', blue: 'text-blue-400', purple: 'text-purple-400', default: 'text-white' }
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${colors[accent ?? 'default']}`}>{value}</p>
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
