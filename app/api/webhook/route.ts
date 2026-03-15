import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase-server'
import { sendSMS } from '@/lib/sms'

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') ?? ''
  let from = '', message = ''

  if (ct.includes('application/x-www-form-urlencoded')) {
    const p = new URLSearchParams(await req.text())
    from = p.get('from') ?? ''; message = p.get('message') ?? ''
    console.log('[Webhook] Received:', { from, message })
  } else {
    const b = await req.json().catch(() => ({}))
    from = b.from ?? ''; message = b.message ?? ''
    console.log('[Webhook] Received JSON:', { from, message })
  }

  if (!from || !message) return NextResponse.json({ ok: false })

  const sb = adminClient()
  const text = message.trim()

  const { data: customer } = await sb.from('customers')
    .select('*, businesses(id, name, google_review_link)')
    .eq('phone', from).order('appointment_time', { ascending: false }).limit(1).single()

  if (!customer) {
    console.log('[Webhook] No customer found for:', from)
    return NextResponse.json({ ok: true, note: 'no customer' })
  }

  const biz = customer.businesses as any

  // Save incoming message
  await sb.from('messages').insert({
    business_id: biz.id, customer_id: customer.id, direction: 'in', body: text,
  })

  return NextResponse.json({ ok: true })
}

export async function GET() { return NextResponse.json({ ok: true }) }
