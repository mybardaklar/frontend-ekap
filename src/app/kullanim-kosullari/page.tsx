
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kullanım Koşulları | EKAP.AI",
  description: "EKAP.AI platformunun kullanım koşulları ve yasal bilgiler.",
  alternates: {
    canonical: 'https://ekap.ai/kullanim-kosullari',
  },
};

export default function TermsPage() {
  return (
    <div className="container py-16 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 gradient-text pb-2">Kullanım Koşulları</h1>
        <p className="text-muted-foreground">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">1. Genel Hükümler</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Bu kullanım koşulları ("Koşullar"), AAB Mühendislik San. Tic. A.Ş. ("EKAP", "Şirket", "biz")
            tarafından sunulan EKAP platformunun ("Platform", "Hizmet") kullanımını düzenlemektedir.
            Platformu kullanarak bu koşulları kabul etmiş sayılırsınız.
          </p>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">2. Hizmet Tanımı</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            EKAP, aşağıdaki hizmetleri sunan yapay zeka destekli hukuk platformudur:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li>Kamu İhale Kurumu (KİK) kararlarına erişim ve analiz</li>
            <li>Hukuki dilekçe hazırlama desteği</li>
            <li>AI destekli mevzuat danışmanlığı</li>
            <li>Kamu ihale süreçlerine yönelik danışmanlık</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">3. Kredi Sistemi ve Ödeme</h2>
          <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">3.1. Kredi Sistemi</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 list-none pl-0">
                  <li className="flex items-center gap-2">🔹 Hizmetler kredi sistemi ile sunulmaktadır</li>
                  <li className="flex items-center gap-2">🔹 Krediler satın alma tarihinden itibaren süresiz geçerlidir</li>
                  <li className="flex items-center gap-2">🔹 Krediler başka hesaplara transfer edilemez</li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">3.2. Ödeme ve Faturalama</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 list-none pl-0">
                  <li className="flex items-center gap-2">🔹 Tüm ödemeler Türk Lirası (TL) cinsinden yapılır</li>
                  <li className="flex items-center gap-2">🔹 Ödemeler İyzico güvenli ödeme sistemi ile alınır</li>
                  <li className="flex items-center gap-2">🔹 Tüm satın alımlar için e-fatura düzenlenir</li>
                </ul>
            </div>

            <div>
                 <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">3.3. İade Politikası</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 list-none pl-0">
                  <li className="flex items-center gap-2">🔹 Kullanılmayan krediler için 7 gün içinde iade talep edilebilir</li>
                  <li className="flex items-center gap-2">🔹 İade taleplerinin geçerli sebebe dayanması gerekmektedir</li>
                </ul>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">4. Sorumluluk Sınırlaması</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Platform "olduğu gibi" sunulmaktadır. Kesintisiz veya hatasız çalışma garantisi verilmemektedir.
            AI destekli öneriler hukuki tavsiye niteliği taşımaz. Kullanıcılar nihai kararlarını kendi
            profesyonel değerlendirmelerine göre vermelidir.
          </p>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">İletişim</h2>
            <p className="text-gray-600 dark:text-gray-300">
            Bu koşullarla ilgili sorularınız için bizimle iletişime geçebilirsiniz: <a href="mailto:ekap@ekap.ai" className="text-blue-600 hover:underline">ekap@ekap.ai</a>
            </p>
        </section>
      </div>
    </div>
  );
}
