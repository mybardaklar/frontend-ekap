import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  // 1. Get all unique ihale_karar_no from mahkeme
  const { data: mahkemeStats, error: mError } = await supabase
    .from('mahkeme')
    .select('ihale_karar_no')
    .not('ihale_karar_no', 'is', null);

  if (mError) return NextResponse.json({ error: mError })

  const uniqueIhaleNos = Array.from(new Set(mahkemeStats?.map(m => m.ihale_karar_no))).filter(Boolean);

  // 2. Count matches in urun_bilgileri (chunked if needed, but 1700 is small enough for 'in' maybe?)
  // Supabase limit for 'in' filter is usually high enough, but let's be safe with chunks of 500?
  // Actually, let's just try counting directly if Supabase supports a join-like count or just brute force check?
  // We can't do client-side join easily for count without fetching IDs.
  // 1700 IDs is okay for .in().

  let matchCount = 0;

  // Chunking
  const chunkSize = 500;
  for (let i = 0; i < uniqueIhaleNos.length; i += chunkSize) {
      const chunk = uniqueIhaleNos.slice(i, i + chunkSize);
      const { count } = await supabase
        .from('urun_bilgileri')
        .select('*', { count: 'exact', head: true })
        .in('karar_no', chunk); // Note: Assuming ihale_karar_no maps to karar_no
      matchCount += (count || 0);
  }

  return NextResponse.json({
      totalMahkemeRows: mahkemeStats?.length,
      uniqueIhaleKararNos: uniqueIhaleNos.length,
      matchedInUrunBilgileri: matchCount
  })
}
