
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Bot, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda | EKAP - Yapay Zeka Destekli Hukuk Teknolojileri",
  description: "EKAP hakkında bilgi edinin. AAB Mühendislik tarafından geliştirilen yapay zeka destekli hukuk platformu. Misyonumuz, vizyonumuz ve değerlerimiz.",
  alternates: {
    canonical: 'https://ekap.ai/hakkimizda',
  },
};

export default function AboutPage() {
  return (
    <div className="container py-16 max-w-5xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text pb-2">Hakkımızda</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          EKAP, yapay zeka destekli hukuk teknolojileri alanında öncü bir platform olarak,
          kamu ihale süreçlerini dijitalleştirmek ve hukuki danışmanlığı erişilebilir kılmak için kurulmuştur.
        </p>
      </div>

      {/* Misyon & Vizyon */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Misyonumuz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Kamu ihale süreçlerinde şeffaflığı artırmak, hukuki süreçleri kolaylaştırmak ve
              yapay zeka teknolojisi ile herkesi adalete eşit mesafede konumlandırmaktır.
              KİK kararlarından mevzuat danışmanlığına kadar geniş bir yelpazede hizmet sunarak,
              hukuki bilgiye erişimi demokratikleştiriyoruz.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <Scale className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              Vizyonumuz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Türkiye'nin en kapsamlı kamu ihale ve hukuki danışmanlık platformu olmak.
              Yapay zeka teknolojisini hukuk alanında etkin şekilde kullanarak,
              adalet hizmetlerinin daha hızlı, daha adil ve daha erişilebilir olmasını sağlamak.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Şirket Bilgileri */}
      <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-8 md:p-12 mb-16 border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-8 text-center">AAB Mühendislik San. Tic. A.Ş.</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Şirket Bilgileri</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">Ünvan:</span>
                <span>AAB MÜHENDİSLİK SAN.TİC.AŞ.</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">Merkez Adres:</span>
                <span className="text-right">Adalet Mah. Manas Blv. No:47/B<br/>D:2804 Bayraklı / İZMİR</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">E-posta:</span>
                <span>ekap@ekap.ai</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">Kuruluş Yılı:</span>
                <span>2016</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Faaliyet Alanları</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                Kamu ihale danışmanlığı
              </li>
              <li className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                 Yapay zeka destekli hukuki analiz
              </li>
              <li className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                 Mevzuat danışmanlığı
              </li>
              <li className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                 Hukuki doküman hazırlama
              </li>
              <li className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                 Dijital hukuk teknolojileri
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Değerlerimiz */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Değerlerimiz</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:-translate-y-1 transition-transform duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl w-20 h-20 flex items-center justify-center">
                <Scale className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Adalet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Herkesi adalete eşit mesafede konumlandırmak ve hukuki bilgiye erişimi demokratikleştirmek temel önceliğimizdir.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:-translate-y-1 transition-transform duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl w-20 h-20 flex items-center justify-center">
                <Bot className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>İnovasyon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                En son yapay zeka teknolojilerini hukuk alanına entegre ederek süreçleri hızlandırıyor ve hata payını minimize ediyoruz.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:-translate-y-1 transition-transform duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl w-20 h-20 flex items-center justify-center">
                <FileText className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Şeffaflık</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kamu ihale süreçlerinde şeffaflığı artırarak, tüm paydaşların doğru bilgiye anında ulaşmasını sağlıyoruz.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* İletişim CTA */}
      <div className="text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-4 text-white">Bizimle İletişime Geçin</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
          Sorularınız, önerileriniz veya iş birliği teklifleriniz için ekibimizle iletişime geçebilirsiniz. Size yardımcı olmaktan mutluluk duyarız.
        </p>
        <Button asChild size="lg" variant="secondary" className="font-semibold">
          <a href="/iletisim">İletişim Formu</a>
        </Button>
      </div>
    </div>
  );
}
