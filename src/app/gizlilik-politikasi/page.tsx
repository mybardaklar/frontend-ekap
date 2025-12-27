
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gizlilik Politikası | EKAP.AI",
  description: "EKAP.AI gizlilik ve KVKK politikası: kişisel verilerin işlenmesi ve güvenliği.",
  alternates: {
    canonical: 'https://ekap.ai/gizlilik-politikasi',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container py-16 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 gradient-text pb-2">Gizlilik Politikası</h1>
        <p className="text-muted-foreground">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">1. Giriş</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            AAB Mühendislik San. Tic. A.Ş. ("EKAP", "Şirket", "biz" veya "bizim") olarak,
            kişisel verilerinizin korunması konusunda hassasiyetimizi göstermek ve bu konudaki
            yaklaşımımızı açıklamak amacıyla bu Gizlilik Politikası'nı hazırladık.
          </p>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">2. Toplanan Kişisel Veriler</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Platformumuzda aşağıdaki kişisel veriler toplanmaktadır:</p>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300 list-none pl-0">
            <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <span><strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <span><strong>İletişim Bilgileri:</strong> Telefon numarası, adres bilgileri</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <span><strong>Ödeme Bilgileri:</strong> Fatura bilgileri (kredi kartı bilgileri saklanmaz)</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <span><strong>Kullanım Bilgileri:</strong> Platform kullanım istatistikleri, tercihler</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
                <span><strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı bilgileri, cihaz bilgileri</span>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <ul className="grid md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-300 list-none pl-0">
            <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Hizmet sunumu ve platform işleyişi
            </li>
            <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Kullanıcı hesabı yönetimi
            </li>
            <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Ödeme işlemlerinin gerçekleştirilmesi
            </li>
             <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Müşteri destek hizmetlerinin sağlanması
            </li>
             <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Yasal yükümlülüklerin yerine getirilmesi
            </li>
             <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Platform güvenliğinin sağlanması
            </li>
             <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> İstatistiksel analiz ve raporlama
            </li>
          </ul>
        </section>

        {/* ... Sections 4-8 ... */}
         <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 5. ve 6. maddelerinde
            belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-none pl-0">
            <li className="flex items-center gap-2">✔ Açık rızanızın bulunması</li>
            <li className="flex items-center gap-2">✔ Sözleşmenin kurulması veya ifasının gerekliliği</li>
            <li className="flex items-center gap-2">✔ Yasal yükümlülüğün yerine getirilmesi</li>
            <li className="flex items-center gap-2">✔ Meşru menfaatlerimizin gerekliliği</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-4">İletişim</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Kişisel verilerinizle ilgili sorularınız veya haklarınızı kullanmak için bizimle iletişime geçebilirsiniz:
          </p>
          <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-gray-200 dark:border-zinc-700">
            <p className="font-semibold text-lg mb-2">AAB Mühendislik San. Tic. A.Ş.</p>
            <p className="text-gray-600 dark:text-gray-300">Adalet Mah. Manas Blv. No:47/B D:2804 Bayraklı / İZMİR</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2"><strong>E-posta:</strong> ekap@ekap.ai</p>
          </div>
        </section>
      </div>
    </div>
  );
}
