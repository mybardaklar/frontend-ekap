import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // 1. Get Categories distribution
  const { data: categories } = await supabase.from('urun_bilgileri').select('kategori')

  const categoryCounts: Record<string, number> = {};
  categories?.forEach((c: any) => {
      const k = c.kategori || 'Uncategorized';
      categoryCounts[k] = (categoryCounts[k] || 0) + 1;
  });

  // 2. Count "Danıştay"
  const { count: countDanistay } = await supabase
    .from('urun_bilgileri')
    .select('*', { count: 'exact', head: true })
    .or('karar_sonucu.ilike.%danıştay%,baslik.ilike.%danıştay%')

  // 3. Count "İptal"
  const { count: countIptal } = await supabase
    .from('urun_bilgileri')
    .select('*', { count: 'exact', head: true })
    .or('karar_sonucu.ilike.%iptal%,baslik.ilike.%iptal%')

  return NextResponse.json({
      categoryCounts,
      countDanistay,
      countIptal
  })
}
