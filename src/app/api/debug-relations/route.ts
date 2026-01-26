import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  // 1. Analyze Mahkeme Table
  const { data: mahkemeStats, error: mError } = await supabase
    .from('mahkeme')
    .select('ihale_karar_no')
    .not('ihale_karar_no', 'is', null);

  if (mError) return NextResponse.json({ error: mError });

  const totalMahkemeWithNo = mahkemeStats?.length || 0;
  const uniqueMahkemeNos = new Set(mahkemeStats?.map(m => m.ihale_karar_no));

  // 2. Sample check for duplicates in Urun Bilgileri
  // We can't fetch all 130k product IDs.
  // But we can check our overlap for 1697 items.
  const sampleIds = Array.from(uniqueMahkemeNos).slice(0, 500); // Check first 500

  const { data: overlapData } = await supabase
    .from('urun_bilgileri')
    .select('karar_no')
    .in('karar_no', sampleIds);

  const overlapCount = overlapData?.length || 0;

  // Count counts per karar_no
  const countsPerNo: Record<string, number> = {};
  overlapData?.forEach((d: any) => {
      countsPerNo[d.karar_no] = (countsPerNo[d.karar_no] || 0) + 1;
  });

  const duplicates = Object.entries(countsPerNo).filter(([k, v]) => v > 1);

  return NextResponse.json({
      totalMahkemeRows: totalMahkemeWithNo,
      uniqueMahkemeKararNos: uniqueMahkemeNos.size,
      sampleCheckSize: sampleIds.length,
      foundInUrunBilgileri: overlapCount,
      multiplesFound: duplicates.length,
      sampleMultiples: duplicates.slice(0, 5),
      averageRatio: overlapCount / sampleIds.length
  })
}
