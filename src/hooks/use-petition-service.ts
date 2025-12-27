
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export interface PetitionFormData {
  idare_adi: string;
  idare_adresi: string;
  basvuru_sahibi: string;
  kimlik_numarasi: string;
  vekil_bilgisi: string;
  ihale_kayit_numarasi: string;
  ihale_adi: string;
  farkina_varildigi_tarih: string;
  sikayet_konusu: string;
  email: string;
}

export interface PetitionRequest {
  petition_type: 'complaint' | 'objection';
  subject: string;
  content: string;
  amount?: number;
  form_data?: PetitionFormData;
}

export interface PetitionResponse {
  success: boolean;
  petition_id?: string;
  file_url?: string;
  message?: string;
  error?: string;
  current_balance?: number;
  required_amount?: number;
}

export const usePetitionService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const writePetition = async (request: PetitionRequest): Promise<PetitionResponse> => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Oturum Gerekli", {
          description: "Dilekçe yazmak için giriş yapmalısınız.",
        });
        return { success: false, error: "Kullanıcı girişi gerekli" };
      }

    //   console.log('Starting petition request:', request);

      const { data, error } = await supabase.functions.invoke('write-petition', {
        body: {
          user_id: user.id,
          ...request
        }
      });

      if (error) {
        console.error('Petition service error:', error);

        toast.error("Hata", {
          description: error.message || "Dilekçe oluşturulurken hata oluştu",
        });

        return { success: false, error: error.message };
      }

      if (data.current_balance !== undefined) {
        toast.error("Yetersiz Kredi", {
          description: `Mevcut bakiyeniz: ${data.current_balance} kredi. Gerekli: ${data.required_amount} kredi.`,
        });
        return { success: false, ...data };
      }

    //   console.log('Petition created successfully:', data);

      toast.success("Başarılı", {
        description: data.message || "Dilekçeniz başarıyla oluşturuldu",
      });

      return { success: true, ...data };

    } catch (error) {
      console.error('Petition service error:', error);

      toast.error("Bağlantı Hatası", {
        description: "Servis ile bağlantı kurulamadı. Lütfen tekrar deneyin.",
      });

      return { success: false, error: "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    writePetition,
    isLoading
  };
};
