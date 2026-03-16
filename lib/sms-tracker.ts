// Server-only – never import in 'use client' files
import { adminClient } from '@/lib/supabase-server'

export async function trackSmsUsage(businessId: string) {
  if (!businessId) return

  const sb = adminClient()
  const today = new Date()

  const { data: biz } = await sb
    .from('businesses')
    .select('sms_count_month, sms_period_start, created_at')
    .eq('id', businessId)
    .single()

  if (!biz) return

  // Billing day = day of month they signed up (default to 1 if missing)
  const signupDay = biz.created_at ? new Date(biz.created_at).getDate() : 1

  // Find the most recent billing date (this month or last month)
  const yr = today.getFullYear()
  const mo = today.getMonth()
  let periodStart = new Date(yr, mo, signupDay)
  if (periodStart > today) {
    periodStart = new Date(yr, mo - 1, signupDay)
  }
  const periodStartStr = periodStart.toISOString().split('T')[0]

  // Reset if new period
  const stored = biz.sms_period_start
  const isNewPeriod = !stored || stored < periodStartStr

  const newCount = isNewPeriod ? 1 : (biz.sms_count_month ?? 0) + 1

  const { error } = await sb.from('businesses').update({
    sms_count_month: newCount,
    sms_period_start: isNewPeriod ? periodStartStr : stored,
  }).eq('id', businessId)

  if (error) console.error('[SMS Tracker] Update failed:', error.message)
}
