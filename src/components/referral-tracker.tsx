"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

function ReferralTrackerContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // 1. Capture ref code from URL
    const refCode = searchParams.get('ref');
    if (refCode) {
      try {
        localStorage.setItem('pending_referrer_code', refCode);
      } catch (e) {
        console.error('Failed to save referral code:', e);
      }
    }

    // 2. Track Click API
    const trackClick = async () => {
      const code = refCode || localStorage.getItem('pending_referrer_code');
      if (!code) return;

      const { data: { user } } = await supabase.auth.getUser();

      await supabase.functions.invoke('track-referral-click', {
        body: {
            link_code: code,
            referred_user_id: user?.id
        }
      });
    };

    trackClick();

  }, [searchParams]);

  return null;
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralTrackerContent />
    </Suspense>
  );
}
