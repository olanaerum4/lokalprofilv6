import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase-server'
import { sendSMS } from '@/lib/sms'
import { trackSmsUsage } from '@/lib/sms-tracker'

export async function POST(req: Request) {
  const sb = await serverClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })

  const { to, message } = await req.json()
  if (!to || !message) return NextResponse.json({ error: 'Mangler to eller message' }, { status: 400 })

  const result = await sendSMS(to, message)
  if (result.ok) {
    await trackSmsUsage(user.id)
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: result.error ?? 'SMS-sending feilet' }, { status: 500 })
}
