"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export function useCredits(user: User | null) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    const fetchCredits = async () => {
      try {
        const { data, error } = await supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', user.id)
          .single(); // Change to maybeSingle() if using an older version, but here we handle error.

        // PGRST116 is the code for "The result contains 0 rows" when using single().
        if (error) {
           if (error.code === 'PGRST116') {
             // No row found - effectively 0 credits
             setCredits(0);
           } else {
             console.error('Error fetching credits:', JSON.stringify(error, null, 2));
             setCredits(0);
           }
        } else {
           setCredits(data?.balance ?? 0);
        }
      } catch (err) {
        console.error('Error in fetchCredits:', err);
        setCredits(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setCredits(payload.new.balance);
        }
      )
      .subscribe();

    // Listen for custom event for manual updates (e.g. after purchase)
    const handleCreditUpdate = () => {
      fetchCredits();
    };
    window.addEventListener('kik:credit_update', handleCreditUpdate);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('kik:credit_update', handleCreditUpdate);
    };
  }, [user]);

  return { credits, loading };
}
