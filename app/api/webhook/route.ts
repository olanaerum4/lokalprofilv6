import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase-server'
import { sendSMS, sms } from '@/lib/sms'

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') ?? ''
  let from = '', message = ''

  if (ct.includes('application/x-www-form-urlencoded')) {
    const p = new URLSearchParams(await req.text())
    from = p.get('from') ?? ''; message = p.get('message') ?? ''
  } else {
    const b = await req.json().catch(() => ({}))
    from = b.from ?? ''; message = b.message ?? ''
  }

  if (!from || !message) return NextResponse.json({ ok: false })

  const sb = adminClient()
  const text = message.trim()

  // Find customer
  const { data: customer } = await sb.from('customers')
    .select('*, businesses(id, name, google_review_link)')
    .eq('phone', from).order('appointment_time', { ascending: false }).limit(1).single()

  if (!customer) return NextResponse.json({ ok: true })

  const biz = customer.businesses as any
  const rating = parseInt(text)

  // Save incoming message to messages table
  await sb.from('messages').insert({
    business_id: biz.id, customer_id: customer.id, direction: 'in', body: text,
  })

  // Handle rating
  if (!isNaN(rating) && rating >= 1 && rating <= 5) {
    const { data: existing } = await sb.from('feedback')
      .select('id').eq('customer_id', customer.id)
      .order('created_at', { ascending: false }).limit(1).single()

    if (!existing) {
      await sb.from('feedback').insert({ customer_id: customer.id, business_id: biz.id, rating })
      if (rating >= 4) {
        const msg = biz.google_review_link ? sms.positive(biz.google_review_link) : `Så glad du er fornøyd! 🌟 Takk for at du valgte ${biz.name}!`
        await sendSMS(from, msg)
        await sb.from('messages').insert({ business_id: biz.id, customer_id: customer.id, direction: 'out', body: msg })
      } else {
        const msg = sms.negative()
        await sendSMS(from, msg)
        await sb.from('messages').insert({ business_id: biz.id, customer_id: customer.id, direction: 'out', body: msg })
      }
    }
    return NextResponse.json({ ok: true, action: 'rating' })
  }

  // Handle follow-up text after negative rating
  const { data: fb } = await sb.from('feedback')
    .select('id, rating, message').eq('customer_id', customer.id)
    .order('created_at', { ascending: false }).limit(1).single()

  if (fb && fb.rating <= 3 && !fb.message) {
    await sb.from('feedback').update({ message: text }).eq('id', fb.id)
  }

  return NextResponse.json({ ok: true })
}

export async function GET() { return NextResponse.json({ ok: true }) }
