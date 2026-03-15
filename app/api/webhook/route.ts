import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase-server'
import { sendSMS, sms } from '@/lib/sms'

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') ?? ''
  let from = '', message = '', to = ''

  if (ct.includes('application/x-www-form-urlencoded')) {
    const p = new URLSearchParams(await req.text())
    from = p.get('from') ?? ''
    message = p.get('message') ?? ''
    to = p.get('to') ?? ''
    console.log('[Webhook] Form data:', { from, to, message })
  } else {
    const b = await req.json().catch(() => ({}))
    from = b.from ?? ''
    message = b.message ?? ''
    to = b.to ?? ''
    console.log('[Webhook] JSON data:', { from, to, message })
  }

  if (!from || !message) {
    console.log('[Webhook] Missing from or message')
    return NextResponse.json({ ok: false, error: 'Missing from or message' })
  }

  const sb = adminClient()
  const text = message.trim()

  // Find customer by phone
  const { data: customer, error: custError } = await sb.from('customers')
    .select('*, businesses(id, name, google_review_link)')
    .eq('phone', from)
    .order('appointment_time', { ascending: false })
    .limit(1)
    .single()

  console.log('[Webhook] Customer lookup:', { from, found: !!customer, error: custError?.message })

  if (!customer) {
    // Still save the message even if no customer found - log it
    console.log('[Webhook] No customer found for phone:', from)
    return NextResponse.json({ ok: true, note: 'no customer found' })
  }

  const biz = customer.businesses as any

  // Save incoming message
  const { error: msgError } = await sb.from('messages').insert({
    business_id: biz.id, customer_id: customer.id, direction: 'in', body: text,
  })
  console.log('[Webhook] Message saved:', { error: msgError?.message })

  const rating = parseInt(text)

  if (!isNaN(rating) && rating >= 1 && rating <= 5) {
    const { data: existing } = await sb.from('feedback')
      .select('id').eq('customer_id', customer.id)
      .order('created_at', { ascending: false }).limit(1).single()

    if (!existing) {
      await sb.from('feedback').insert({ customer_id: customer.id, business_id: biz.id, rating })
      const msg = rating >= 4
        ? (biz.google_review_link ? sms.positive(biz.google_review_link) : `Så glad du er fornøyd! 🌟 Takk for at du valgte ${biz.name}!`)
        : sms.negative()
      await sendSMS(from, msg)
      await sb.from('messages').insert({ business_id: biz.id, customer_id: customer.id, direction: 'out', body: msg })
    }
    return NextResponse.json({ ok: true, action: 'rating', rating })
  }

  // Follow-up text after negative rating
  const { data: fb } = await sb.from('feedback')
    .select('id, rating, message').eq('customer_id', customer.id)
    .order('created_at', { ascending: false }).limit(1).single()

  if (fb && fb.rating <= 3 && !fb.message) {
    await sb.from('feedback').update({ message: text }).eq('id', fb.id)
  }

  return NextResponse.json({ ok: true, action: 'message_saved' })
}

export async function GET() { return NextResponse.json({ ok: true }) }
