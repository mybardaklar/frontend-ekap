"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export function usePurchase() {
  const [buying, setBuying] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const purchaseDecision = async (decisionId: string, currentCredits: number | null) => {
    setBuying(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Satın alma işlemi için giriş yapmalısınız.");
        return false;
      }

      if (currentCredits !== null && currentCredits < 10) {
        toast.error("Yetersiz bakiye. Kredi yüklemeniz gerekmektedir.");
        return false;
      }

      const { data, error } = await supabase.functions.invoke('purchase-decision', {
        body: { decisionId }
      });

      if (error) {
        console.error('Purchase API Error:', error);
        toast.error(error.message || "Satın alma işlemi başarısız oldu.");
        return false;
      }

      if (data && !data.success) {
        toast.error(data.error || "Satın alma başarısız.");
        return false;
      }

      toast.success(data.message || "Karar başarıyla açıldı!");
      // Dispatch custom event to update credit balance in header
      window.dispatchEvent(new Event('kik:credit_update'));
      // router.refresh(); // Moved to component level for better UX control
      return true;

    } catch (err) {
      console.error('Purchase unexpected error:', err);
      toast.error("Bir hata oluştu.");
      return false;
    } finally {
      setBuying(false);
    }
  };

  return { purchaseDecision, buying };
}
