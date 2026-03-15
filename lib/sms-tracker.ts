// Server-only - never import in 'use client' files
import { adminClient } from '@/lib/supabase-server'

export async function trackSmsUsage(businessId: string) {
  const sb = adminClient()
  const today = new Date().toISOString().split('T')[0]
  const monthStart = today.substring(0, 7) + '-01'

  const { data: biz } = await sb
    .from('businesses')
    .select('sms_count_month, sms_period_start')
    .eq('id', businessId)
    .single()

  if (!biz) return

  const periodStart = biz.sms_period_start ?? monthStart
  const isNewMonth = periodStart < monthStart

  await sb.from('businesses').update({
    sms_count_month: isNewMonth ? 1 : (biz.sms_count_month ?? 0) + 1,
    sms_period_start: isNewMonth ? monthStart : periodStart,
  }).eq('id', businessId)
}
