import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const sb = await serverClient()
  const { data: { user }, error: authError } = await sb.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })
  }

  const body = await req.json()
  const { name, phone, google_review_link } = body

  const { error } = await sb.from('businesses').upsert({
    id: user.id,
    email: user.email,
    name,
    phone: phone || null,
    google_review_link: google_review_link || null,
    onboarding_done: true,
  })

  if (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
