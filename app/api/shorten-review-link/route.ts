import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase-server'
import { shortenUrl } from '@/lib/bitly'

export async function POST(req: Request) {
  const sb = await serverClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })

  const { url } = await req.json()
  if (!url) return NextResponse.json({ short: null })

  const short = await shortenUrl(url)
  await sb.from('businesses').update({ google_review_short: short }).eq('id', user.id)

  return NextResponse.json({ short })
}
