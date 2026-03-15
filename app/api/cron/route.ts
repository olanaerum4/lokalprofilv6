import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase-server'
import { sendSMS, buildReminder24h, buildReminder2h, buildAfterAppointment, fmtTime, cancelUrl } from '@/lib/sms'

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
      .select('*, businesses(name, google_review_link, sms_reminder_24h)')
      .eq('reminded_24h', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() + 23.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() + 24.5 * 3600000).toISOString())

    for (const c of r24 ?? []) {
      const biz = c.businesses as any
      const msg = buildReminder24h(biz.sms_reminder_24h, c.name, biz.name, fmtTime(c.appointment_time), cancelUrl(c.cancel_token))
      const { ok } = await sendSMS(c.phone, msg)
      if (ok) { await sb.from('customers').update({ reminded_24h: true }).eq('id', c.id); sent++ }
      else errors++
    }

    // 2h reminders
    const { data: r2 } = await sb.from('customers')
      .select('*, businesses(name, sms_reminder_2h)')
      .eq('reminded_2h', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() + 1.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() + 2.5 * 3600000).toISOString())

    for (const c of r2 ?? []) {
      const biz = c.businesses as any
      const msg = buildReminder2h(biz.sms_reminder_2h, c.name, biz.name, fmtTime(c.appointment_time))
      const { ok } = await sendSMS(c.phone, msg)
      if (ok) { await sb.from('customers').update({ reminded_2h: true }).eq('id', c.id); sent++ }
      else errors++
    }

    // Post-appointment
    const { data: rr } = await sb.from('customers')
      .select('*, businesses(name, google_review_link, sms_after_appointment)')
      .eq('review_requested', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() - 1.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() - 0.5 * 3600000).toISOString())

    for (const c of rr ?? []) {
      const biz = c.businesses as any
      const msg = buildAfterAppointment(biz.sms_after_appointment, c.name, biz.name, biz.google_review_link)
      const { ok } = await sendSMS(c.phone, msg)
      if (ok) { await sb.from('customers').update({ review_requested: true }).eq('id', c.id); sent++ }
      else errors++
    }

    return NextResponse.json({ ok: true, sent, errors, ts: now.toISOString() })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
