import { adminClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function Avbestill({ params }: { params: { token: string } }) {
  const sb = adminClient()
  const { data: customer } = await sb.from('customers')
    .select('*, businesses(name)')
    .eq('cancel_token', params.token)
    .single()

  if (!customer) {
    return (
      <Page>
        <Icon color="red">✗</Icon>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Lenken er ugyldig</h1>
        <p className="text-sm text-gray-500">Denne avbestillingslenken finnes ikke eller er allerede brukt.</p>
      </Page>
    )
  }

  if (customer.cancelled) {
    return (
      <Page>
        <Icon color="gray">✓</Icon>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Allerede avbestilt</h1>
        <p className="text-sm text-gray-500">Denne timen er allerede avbestilt.</p>
      </Page>
    )
  }

  const biz = customer.businesses as any
  const apptDate = new Date(customer.appointment_time)
  const isPast = apptDate < new Date()

  if (isPast) {
    return (
      <Page>
        <Icon color="gray">📅</Icon>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Timen er allerede passert</h1>
        <p className="text-sm text-gray-500">Du kan ikke avbestille en time som allerede har vært.</p>
      </Page>
    )
  }

  // Cancel the appointment
  await sb.from('customers').update({ cancelled: true, cancelled_at: new Date().toISOString() }).eq('id', customer.id)

  const dateStr = apptDate.toLocaleString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

  return (
    <Page>
      <Icon color="green">✓</Icon>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Time avbestilt</h1>
      <p className="text-sm text-gray-500 mb-4">
        Din time hos <strong className="text-gray-700">{biz?.name}</strong> {dateStr} er avbestilt.
      </p>
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600">
        Ønsker du å booke en ny tid? Ta kontakt med {biz?.name} direkte.
      </div>
    </Page>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <span className="text-base font-bold text-gray-900">LokalProfil</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
          {children}
        </div>
      </div>
    </div>
  )
}

function Icon({ children, color }: { children: React.ReactNode; color: 'green' | 'red' | 'gray' }) {
  const colors = { green: 'bg-green-100 text-green-600', red: 'bg-red-100 text-red-500', gray: 'bg-gray-100 text-gray-500' }
  return (
    <div className={`w-14 h-14 rounded-full ${colors[color]} flex items-center justify-center text-2xl mx-auto mb-4`}>
      {children}
    </div>
  )
}
