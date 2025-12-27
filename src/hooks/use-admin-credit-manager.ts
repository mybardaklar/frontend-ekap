import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface CreditGift {
  id: string;
  to_user_id: string;
  credits_amount: number;
  reason: string;
  message?: string;
  gift_type: string;
  created_at: string;
  profiles?: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface AdminAction {
  id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: any;
  created_at: string;
}

export const useAdminCreditManager = () => {
  const [loading, setLoading] = useState(false);
  const [creditGifts, setCreditGifts] = useState<CreditGift[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const supabase = createClient();

  const giftCreditsToUser = async (
    userId: string,
    creditsAmount: number,
    reason: string,
    message?: string,
    sendEmail: boolean = true,
    sendNotification: boolean = true
  ) => {
    setLoading(true);
    try {
      console.log('🎁 Gifting credits:', { userId, creditsAmount, reason, message });

      const { error } = await supabase.rpc('gift_credits_to_user', {
        p_to_user_id: userId,
        p_credits_amount: creditsAmount,
        p_reason: reason,
        p_message: message,
        p_gift_type: 'manual',
        p_send_notification: sendNotification,
        p_send_email: sendEmail
      });

      if (error) throw error;

      // Send email if requested
      if (sendEmail) {
        try {
          await supabase.functions.invoke('send-credit-gift-email', {
            body: {
              userId,
              creditsAmount,
              reason,
              message
            }
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the whole operation if email fails
        }
      }

      toast.success(`${creditsAmount} kredi başarıyla hediye edildi.`);
      return true;
    } catch (error: any) {
      console.error('Credit gift error:', error);
      toast.error(error.message || "Kredi hediye edilirken bir hata oluştu.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserCredits = async (
    userId: string,
    newBalance: number,
    reason: string = 'Admin güncellemesi'
  ) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_user_credits', {
        p_user_id: userId,
        p_new_balance: newBalance,
        p_reason: reason
      });

      if (error) throw error;

      toast.success("Kullanıcı kredi bakiyesi güncellendi.");
      return true;
    } catch (error: any) {
      console.error('Credit update error:', error);
      toast.error(error.message || "Kredi güncellenirken bir hata oluştu.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditGifts = async () => {
    try {
      console.log('🎁 Fetching credit gifts...');
      const { data, error } = await supabase
        .from('credit_gifts')
        .select(`
          *,
          profiles!credit_gifts_to_user_id_fkey (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Credit gifts fetch error:', error);
        throw error;
      }

      // We can trust Supabase types or cast them here
      setCreditGifts(data as unknown as CreditGift[]);
    } catch (error) {
      console.error('Error fetching credit gifts:', error);
      toast.error("Kredi hediye geçmişi yüklenirken bir hata oluştu.");
    }
  };

  const fetchAdminActions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAdminActions(data as unknown as AdminAction[] || []);
    } catch (error) {
      console.error('Error fetching admin actions:', error);
    }
  };

  return {
    loading,
    creditGifts,
    adminActions,
    giftCreditsToUser,
    updateUserCredits,
    fetchCreditGifts,
    fetchAdminActions
  };
};
