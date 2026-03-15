import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase-server'

export async function GET(req: Request) {
  const sb = await serverClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })

  const url = new URL(req.url)
  const type = url.searchParams.get('type') ?? 'kunder'

  if (type === 'kunder') {
    const { data } = await sb.from('customers').select('*').eq('business_id', user.id).order('appointment_time', { ascending: false })
    const rows = data ?? []
    const headers = ['Navn', 'Telefon', 'Tidspunkt', 'Avbestilt', 'No-show', '24t sendt', '2t sendt', 'Vurdert']
    const csv = [
      headers.join(';'),
      ...rows.map(r => [
        r.name, r.phone,
        new Date(r.appointment_time).toLocaleString('nb-NO'),
        r.cancelled ? 'Ja' : 'Nei',
        r.no_show ? 'Ja' : 'Nei',
        r.reminded_24h ? 'Ja' : 'Nei',
        r.reminded_2h ? 'Ja' : 'Nei',
        r.review_requested ? 'Ja' : 'Nei',
      ].join(';'))
    ].join('\n')
    return new NextResponse('\uFEFF' + csv, {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="kunder.csv"' }
    })
  }

  if (type === 'tilbakemeldinger') {
    const { data } = await sb.from('feedback').select('*, customers(name, phone)').eq('business_id', user.id).order('created_at', { ascending: false })
    const rows = data ?? []
    const headers = ['Kunde', 'Telefon', 'Karakter', 'Melding', 'Dato']
    const csv = [
      headers.join(';'),
      ...rows.map((r: any) => [
        r.customers?.name ?? '', r.customers?.phone ?? '',
        r.rating, r.message ?? '',
        new Date(r.created_at).toLocaleString('nb-NO'),
      ].join(';'))
    ].join('\n')
    return new NextResponse('\uFEFF' + csv, {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="tilbakemeldinger.csv"' }
    })
  }

  return NextResponse.json({ error: 'Ugyldig type' }, { status: 400 })
}
