import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_SUPABASE_URL is missing' }, { status: 500 });
  }

  const functionUrl = `${supabaseUrl}/functions/v1/paytr-payment`;

  try {
    // Attempt to call without auth first to check reachability (expecting 401 or 400)
    // or with anon key.
    const res = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ packageCode: 'test-ping' }),
    });

    const text = await res.text();
    let json = null;
    try {
        json = JSON.parse(text);
    } catch (e) {
        // ignore
    }

    return NextResponse.json({
      configuredUrl: functionUrl,
      status: res.status,
      statusText: res.statusText,
      responseBody: json || text,
      envCheck: {
          hasUrl: !!supabaseUrl,
          hasKey: !!anonKey
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Fetch failed',
      details: error.message,
      configuredUrl: functionUrl
    }, { status: 500 });
  }
}
