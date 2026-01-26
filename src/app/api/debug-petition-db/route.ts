import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) {
      return NextResponse.json({ error: 'Not authenticated. Please log in to test RPC.' }, { status: 401 });
  }

  // Attempt to call the RPC function with a dummy amount (0) to check existence
  // Note: logic might reject 0, or insufficient funds, but we just want to see if it *executes* vs *throws 404/500*

  const { data, error } = await supabase.rpc('deduct_credit_and_log', {
      p_user_id: user.id,
      p_amount: 0,
      p_description: 'Debug Check'
  });

  return NextResponse.json({
      testType: 'RPC Call to deduct_credit_and_log',
      user_id: user.id,
      rpc_result: data,
      rpc_error: error,
      status: error ? 'Failed' : 'Success'
  })
}
