import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  // 1. Text Search on karar column
  const { count: countTextSearch, error: tsError } = await supabase
    .from('karar_detaylari')
    .select('*', { count: 'exact', head: true })
    .textSearch('karar', "'mahkeme'", { config: 'turkish' })

  // 2. Sunum Turu stats
  const { data: sunumTypes } = await supabase.from('urun_bilgileri').select('sunum_turu')
  const sunumCounts: Record<string, number> = {};
  sunumTypes?.forEach((c: any) => {
      const k = c.sunum_turu || 'Uncategorized';
      sunumCounts[k] = (sunumCounts[k] || 0) + 1;
  });

  return NextResponse.json({
      countTextSearch,
      tsError,
      sunumCounts
  })
}
