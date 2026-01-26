"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { usePurchase } from "@/hooks/usePurchase";
import { useCredits } from "@/hooks/useCredits";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { UrunBilgisi } from "@/types/kikDecisions";
import { PurchaseSuccessDialog } from "./purchase-success-dialog";
import { useGlobalLoader } from "@/providers/global-loader-provider";

interface PurchaseCTAProps {
  product: UrunBilgisi;
  price: number;
}

export function PurchaseCTA({ product, price }: PurchaseCTAProps) {
  const [user, setUser] = useState<User | null>(null);
  const { purchaseDecision, buying } = usePurchase();
  const supabase = createClient();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const { credits, loading: creditsLoading } = useCredits(user);

  const { showLoader, hideLoader } = useGlobalLoader();
  const router = useRouter(); // Import useRouter from next/navigation

  const handleBuy = async () => {
    showLoader();
    try {
      const success = await purchaseDecision(product.id, credits);
      if (success) {
        setShowSuccessDialog(true);
      }
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
             <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-1">
               {price === 0 ? "Ücretsiz Görüntüleyin" : "Tam Metni Görüntüleyin"}
             </h3>
             <p className="text-sm text-blue-700 dark:text-blue-300">
               {price === 0
                 ? "Bu kararı görüntülemek için giriş yapmanız yeterlidir."
                 : "Kararın tamamını ve varsa mahkeme karar detaylarını görmek için kilidi açın."
               }
             </p>
          </div>

          <div className="flex items-center gap-4">
             {/* Credit Display (Contextual) */}
             {price > 0 && (
                 <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span className="font-extrabold text-xl text-primary">{price}</span>
                        <span className="font-medium text-sm text-muted-foreground">kredi</span>
                    </div>
                    {!creditsLoading && user && (
                    <span className="text-xs text-muted-foreground mt-1">
                        Mevcut: {credits} kredi
                    </span>
                    )}
                 </div>
             )}

             <Button
               variant="default"
               size="lg"
               className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
               onClick={handleBuy}
               disabled={buying || creditsLoading}
             >
               {buying ? <Loader2 className="animate-spin h-4 w-4" /> : (price === 0 && !user ? "Giriş Yap" : "Hemen Aç")}
             </Button>
          </div>
        </div>
      </div>

      <PurchaseSuccessDialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
            setShowSuccessDialog(open);
            if (!open) {
                router.refresh();
            }
        }}
        selectedProduct={product}
      />
    </>
  );
}
