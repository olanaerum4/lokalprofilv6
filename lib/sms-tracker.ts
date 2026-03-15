// Server-only - never import in 'use client' files
import { adminClient } from '@/lib/supabase-server'

export async function trackSmsUsage(businessId: string) {
  const sb = adminClient()
  const today = new Date()

  const { data: biz } = await sb
    .from('businesses')
    .select('sms_count_month, sms_period_start, created_at')
    .eq('id', businessId)
    .single()

  if (!biz) return

  // Billing date = day of month when they registered
  const signupDate = new Date(biz.created_at)
  const billingDay = signupDate.getDate()

  // Find the most recent billing date
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  let periodStart = new Date(currentYear, currentMonth, billingDay)

  // If billing day hasn't arrived yet this month, use last month's billing date
  if (periodStart > today) {
    periodStart = new Date(currentYear, currentMonth - 1, billingDay)
  }

  const periodStartStr = periodStart.toISOString().split('T')[0]
  const storedPeriodStart = biz.sms_period_start

  // New billing period started since last SMS
  const isNewPeriod = !storedPeriodStart || storedPeriodStart < periodStartStr

  await sb.from('businesses').update({
    sms_count_month: isNewPeriod ? 1 : (biz.sms_count_month ?? 0) + 1,
    sms_period_start: isNewPeriod ? periodStartStr : storedPeriodStart,
  }).eq('id', businessId)
}
