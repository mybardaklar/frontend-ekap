import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  // Query information_schema to check for tables
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (error) return NextResponse.json({ error });

  const tables = data?.map(t => t.table_name);

  return NextResponse.json({
      hasPaymentRequests: tables?.includes('payment_requests'),
      hasUserCredits: tables?.includes('user_credits'),
      hasTransactions: tables?.includes('credit_transactions'),
      hasInvoices: tables?.includes('invoices'),
      allTables: tables
  })
}
