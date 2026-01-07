"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function PricingClient() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handlePurchase = async (packageCode: string) => {
    setLoading(packageCode);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.info("Satın alma işlemi için lütfen giriş yapın veya kayıt olun.");
        router.push('/?modal=sign_in');
        return;
      }

      const { data, error } = await supabase.functions.invoke('paytr-payment', {
        body: { packageCode }
      });

      if (error) throw error;

      if (data?.iframe_url) {
        window.location.href = data.iframe_url;
      } else {
        throw new Error('Ödeme linki alınamadı');
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Ödeme başlatılamadı.");
    } finally {
      setLoading(null);
    }
  };

  const packages = [
    {
      id: "mini",
      name: "Mini Paket",
      price: 390,
      credits: 10,
      pricePerCredit: 39.00,
      features: ["10 Kredi", "Süresiz geçerli", "Tek seferlik ödeme"],
      isPopular: false
    },
    {
      id: "standard",
      name: "Standart Paket",
      price: 1590,
      credits: 50,
      pricePerCredit: 31.80,
      features: ["50 Kredi", "Süresiz geçerli", "%18 tasarruf"],
      isPopular: true
    },
    {
      id: "maxi",
      name: "Maxi Paket",
      price: 2490,
      credits: 100,
      pricePerCredit: 24.90,
      features: ["100 Kredi", "Süresiz geçerli", "%36 tasarruf"],
      isPopular: false
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 pb-24">
        {/* Credit Packages Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Kredi Paketleri</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tek seferlik ödeme ile kredi satın alın</p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col p-8 bg-white dark:bg-zinc-900 rounded-3xl border transition-all duration-300 ${
                pkg.isPopular
                  ? 'border-blue-500 shadow-xl scale-105 z-10'
                  : 'border-gray-200 dark:border-zinc-800 hover:border-blue-200 hover:shadow-lg'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                   <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                     En Popüler
                   </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h3>
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                  {pkg.price} TL
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {pkg.pricePerCredit.toFixed(2)} TL/kredi
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8 pl-4">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading === pkg.id}
                className={`w-full py-6 text-base font-bold rounded-lg transition-transform active:scale-95 ${
                  pkg.isPopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading === pkg.id ? 'İşleniyor...' : 'Paketi Satın Al'}
              </Button>
            </div>
          ))}
        </div>

        {/* How it Works Section */}
        <div className="mt-24 pt-16 pb-16 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
            Krediler Nasıl Kullanılır?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto px-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg shadow-blue-200 dark:shadow-none">
                1
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">KİK Karar Analizi</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Standart kararlar: 5 kredi</li>
                <li>• Düzeltici/İptal kararları: 10 kredi</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg shadow-blue-200 dark:shadow-none">
                2
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Hukuki Dilekçeler</h3>
               <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Şikayet dilekçesi: 100 kredi</li>
                <li>• İtirazen şikayet: 200 kredi</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg shadow-blue-200 dark:shadow-none">
                3
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">AI Hukuk Danışmanı</h3>
               <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Mevzuat sorguları ve genel</li>
                <li>danışmanlık ücretsiz</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Split Section */}
        <div className="mt-24 bg-cyan-50/50 dark:bg-cyan-900/10 rounded-3xl p-8 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">

            {/* Left Col */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Neden Kredi Sistemi?</h3>
              <ul className="space-y-3">
                {[
                  "Sadece kullandığınız hizmetler için ödeme yapın",
                  "Krediler süresiz geçerli, hiçbir zaman yanmaz",
                  "Esnek kullanım imkanı",
                  "Şeffaf fiyatlandırma",
                  "İhtiyacınıza göre paket seçimi"
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                    <span className="mr-2 text-blue-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Col */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Güvenli Ödeme</h3>
              <ul className="space-y-3">
                {[
                  "SSL sertifikası ile güvenli ödeme",
                  "Güvenli ödeme altyapısı ile güvenilir işlem",
                  "Kredi kartı bilgileri saklanmaz",
                  "7 gün içinde iade garantisi",
                  "Fatura ve makbuz düzenlenir"
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                    <span className="mr-2 text-blue-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-800 dark:text-white">Sık Sorulan Sorular</h2>

          <div className="space-y-4">
             <FaqItem
               question="Krediler ne kadar süre geçerli?"
               answer="Satın aldığınız krediler süresiz geçerlidir ve hiçbir zaman yanmaz. İstediğiniz zaman kullanabilirsiniz."
             />
             <FaqItem
               question="İade politikası nedir?"
               answer="Kullanılmayan krediler için satın alma tarihinden itibaren 7 gün içinde iade talebinde bulunabilirsiniz."
             />
             <FaqItem
               question="Fatura düzenlenir mi?"
               answer="Evet, tüm satın alma işlemleriniz için e-fatura düzenlenir ve e-posta adresinize gönderilir."
             />
          </div>
        </div>
    </div>
  );
}

// Simple FAQ Item Component to resemble accordion
function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <span className="flex items-center">
            <span className="mr-2 text-xs text-gray-400">▶</span>
            {question}
        </span>
        {/* Helper icon if needed */}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-sm text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-zinc-800/20">
          {answer}
        </div>
      )}
    </div>
  );
}
