import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase-server'
import { sendSMS, sms, fmtTime, cancelUrl } from '@/lib/sms'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = adminClient()
  const now = new Date()
  let sent = 0, errors = 0

  try {
    // 24h reminders
    const { data: r24 } = await sb.from('customers')
      .select('*, businesses(name, google_review_link)')
      .eq('reminded_24h', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() + 23.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() + 24.5 * 3600000).toISOString())

    for (const c of r24 ?? []) {
      const biz = c.businesses as any
      const { ok } = await sendSMS(c.phone, sms.reminder24h(c.name, biz.name, fmtTime(c.appointment_time), cancelUrl(c.cancel_token)))
      if (ok) { await sb.from('customers').update({ reminded_24h: true }).eq('id', c.id); sent++ }
      else errors++
    }

    // 2h reminders
    const { data: r2 } = await sb.from('customers')
      .select('*, businesses(name)')
      .eq('reminded_2h', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() + 1.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() + 2.5 * 3600000).toISOString())

    for (const c of r2 ?? []) {
      const biz = c.businesses as any
      const { ok } = await sendSMS(c.phone, sms.reminder2h(c.name, biz.name, fmtTime(c.appointment_time)))
      if (ok) { await sb.from('customers').update({ reminded_2h: true }).eq('id', c.id); sent++ }
      else errors++
    }

    // Post-appointment: send Google review link directly (MVP)
    const { data: rr } = await sb.from('customers')
      .select('*, businesses(name, google_review_link)')
      .eq('review_requested', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() - 1.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() - 0.5 * 3600000).toISOString())

    for (const c of rr ?? []) {
      const biz = c.businesses as any
      const msg = biz.google_review_link
        ? sms.reviewRequest(c.name, biz.name, biz.google_review_link)
        : sms.reviewRequestNoLink(c.name, biz.name)
      const { ok } = await sendSMS(c.phone, msg)
      if (ok) { await sb.from('customers').update({ review_requested: true }).eq('id', c.id); sent++ }
      else errors++
    }

    return NextResponse.json({ ok: true, sent, errors, ts: now.toISOString() })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
