import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Get 1 row to see props
  const { data: urun, error: e1 } = await supabase.from('urun_bilgileri').select('*').limit(1)
  const { data: detay, error: e2 } = await supabase.from('karar_detaylari').select('*').limit(1)

  // Try broader count
  const { count: countBroad } = await supabase
    .from('urun_bilgileri')
    .select('*', { count: 'exact', head: true })
    .or('karar_sonucu.ilike.%mahkeme%,baslik.ilike.%mahkeme%,karar_sonucu.ilike.%iptal%,karar_sonucu.ilike.%bozma%')

  return NextResponse.json({
      urunKeys: urun?.[0] ? Object.keys(urun[0]) : [],
      detayKeys: detay?.[0] ? Object.keys(detay[0]) : [],
      countBroad,
      e1, e2
  })
}
