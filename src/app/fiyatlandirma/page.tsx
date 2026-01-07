
import { Metadata } from 'next';
import PricingClient from '@/components/pricing/pricing-client';

export const metadata: Metadata = {
  title: 'Fiyatlandırma | EKAP.AI',
  description: 'İhtiyacınıza uygun kredi paketini seçin. Süresiz geçerli kredilerle kararları analiz edin ve dilekçe oluşturun.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      {/* Header / Hero */}
      <div className="py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-500 mb-4 tracking-tight">Fiyatlandırma</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          İhtiyacınıza uygun kredi paketini seçin ve zamanı verimli kullanmaya başlayın
        </p>
      </div>

      <PricingClient />
    </div>
  );
}
