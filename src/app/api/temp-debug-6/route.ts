import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  // 1. Get keys
  const { data } = await supabase.from('karar_detaylari').select('*').limit(1)

  return NextResponse.json({
      keys: data && data[0] ? Object.keys(data[0]) : [],
  })
}
