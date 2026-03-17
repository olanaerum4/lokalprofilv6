import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase-server'
import { sendSMS, toSenderName, buildReminder24h, buildReminder2h, buildAfterAppointment, fmtTime } from '@/lib/sms'
import { trackSmsUsage } from '@/lib/sms-tracker'
import { shortenUrl } from '@/lib/bitly'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = adminClient()
  const now = new Date()
  let sent = 0, errors = 0

  async function sendAndTrack(bizId: string, bizName: string, phone: string, msg: string) {
    const from = toSenderName(bizName)
    const { ok } = await sendSMS(phone, msg, from)
    if (ok) await trackSmsUsage(bizId)
    return ok
  }

  // Get or create shortened link for a business
  async function getShortLink(biz: any): Promise<string | null> {
    if (!biz.google_review_link) return null

    // Use cached short link if exists
    if (biz.google_review_short) return biz.google_review_short

    // Shorten and cache
    const short = await shortenUrl(biz.google_review_link)
    if (short !== biz.google_review_link) {
      await sb.from('businesses')
        .update({ google_review_short: short })
        .eq('id', biz.id)
    }
    return short
  }

  try {
    // 24h reminders
    const { data: r24 } = await sb.from('customers')
      .select('*, businesses(id, name, sms_reminder_24h)')
      .eq('reminded_24h', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() + 23.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() + 24.5 * 3600000).toISOString())

    for (const c of r24 ?? []) {
      const biz = c.businesses as any
      const msg = buildReminder24h(biz.sms_reminder_24h, c.name, biz.name, fmtTime(c.appointment_time))
      const ok = await sendAndTrack(biz.id, biz.name, c.phone, msg)
      if (ok) { await sb.from('customers').update({ reminded_24h: true }).eq('id', c.id); sent++ }
      else errors++
    }

    // 2h reminders
    const { data: r2 } = await sb.from('customers')
      .select('*, businesses(id, name, sms_reminder_2h)')
      .eq('reminded_2h', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() + 1.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() + 2.5 * 3600000).toISOString())

    for (const c of r2 ?? []) {
      const biz = c.businesses as any
      const msg = buildReminder2h(biz.sms_reminder_2h, c.name, biz.name, fmtTime(c.appointment_time))
      const ok = await sendAndTrack(biz.id, biz.name, c.phone, msg)
      if (ok) { await sb.from('customers').update({ reminded_2h: true }).eq('id', c.id); sent++ }
      else errors++
    }

    // Post-appointment – use short link
    const { data: rr } = await sb.from('customers')
      .select('*, businesses(id, name, google_review_link, google_review_short, sms_after_appointment)')
      .eq('review_requested', false).eq('cancelled', false).eq('no_show', false)
      .gte('appointment_time', new Date(now.getTime() - 1.5 * 3600000).toISOString())
      .lte('appointment_time', new Date(now.getTime() - 0.5 * 3600000).toISOString())

    for (const c of rr ?? []) {
      const biz = c.businesses as any
      const reviewLink = await getShortLink(biz)
      const msg = buildAfterAppointment(biz.sms_after_appointment, c.name, biz.name, reviewLink)
      const ok = await sendAndTrack(biz.id, biz.name, c.phone, msg)
      if (ok) { await sb.from('customers').update({ review_requested: true }).eq('id', c.id); sent++ }
      else errors++
    }

    return NextResponse.json({ ok: true, sent, errors, ts: now.toISOString() })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
