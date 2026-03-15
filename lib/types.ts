export type Business = {
  id: string
  name: string
  email: string | null
  phone: string | null
  google_review_link: string | null
  onboarding_done: boolean
  sms_reminder_24h: string | null
  sms_reminder_2h: string | null
  sms_after_appointment: string | null
  sms_count_month: number
  sms_period_start: string | null
  created_at: string
}

export type Customer = {
  id: string; business_id: string; name: string; phone: string
  appointment_time: string; reminded_24h: boolean; reminded_2h: boolean
  review_requested: boolean; no_show: boolean
  cancel_token: string; cancelled: boolean; cancelled_at: string | null
  created_at: string
}

export type Feedback = {
  id: string; customer_id: string; business_id: string
  rating: number; message: string | null; created_at: string
  customers?: { name: string; phone: string }
}

export type Message = {
  id: string; business_id: string; customer_id: string
  direction: 'in' | 'out'; body: string; created_at: string
}
