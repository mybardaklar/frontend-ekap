
import { createClient } from '@/utils/supabase/client';

export interface CourtDecision {
  id: string;
  karar_no: string;
  karar_tarihi: string | null;
  karar: string;
  toplanti_no: string;
  gundem_no: string;
  ihale_karar_no: string | null;
  row_number: string | null;
}

export const hasCourtDecision = async (karar_no: string): Promise<boolean> => {
    // In this simplified version, we'll check against the supabase instance available on client side
    // or rely on server side checks in most cases.
    // For now, mirroring the legacy behavior or simple check.
    return false;
};

export const getCombinedDecisionText = async (karar_no: string): Promise<string> => {
  const supabase = createClient();
  try {
    // Only fetch KİK decision (secure)
    const { data: kikDecision, error: kikError } = await supabase
      .from('karar_detaylari')
      .select('karar')
      .eq('karar_no', karar_no)
      .single();

    if (kikError) {
      console.error('Error fetching KIK decision:', kikError);
      return 'Karar metni alınırken hata oluştu.';
    }

    return kikDecision?.karar || 'Karar metni bulunamadı.';
  } catch (error) {
    console.error('Error in getCombinedDecisionText:', error);
    return 'Karar metni alınırken hata oluştu.';
  }
};
