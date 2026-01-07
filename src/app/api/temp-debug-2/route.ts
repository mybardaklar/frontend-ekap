import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  // Count "Mahkeme" in baslik_metin
  const { count: countText } = await supabase
    .from('urun_bilgileri')
    .select('*', { count: 'exact', head: true })
    .or('baslik_metin.ilike.%mahkeme%')

  return NextResponse.json({
      countText
  })
}
