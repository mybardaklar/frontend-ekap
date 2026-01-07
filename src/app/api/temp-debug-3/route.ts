import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  // Count "Mahkeme" in karart_detaylari (Full text)
  const { count: countFullText } = await supabase
    .from('karar_detaylari')
    .select('*', { count: 'exact', head: true })
    .or('karar.ilike.%mahkeme%')

  return NextResponse.json({
      countFullText
  })
}
