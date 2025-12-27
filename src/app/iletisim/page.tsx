
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: "İletişim | EKAP - Destek, İş Birliği ve Sorularınız",
  description: "EKAP ile iletişime geçin. Kamu ihale danışmanlığı, hukuki destek ve AI teknolojileri hakkında sorularınızı iletin. 7/24 e-posta desteği.",
  alternates: {
    canonical: 'https://ekap.ai/iletisim',
  },
};

export default function ContactPage() {
  return (
    <div className="container py-16 max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text pb-2">İletişim</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Sorularınız, önerileriniz veya iş birliği teklifleriniz için bizimle iletişime geçin.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* İletişim Formu */}
        <div className="order-2 lg:order-1">
            <ContactForm />
        </div>

        {/* İletişim Bilgileri */}
        <div className="order-1 lg:order-2 space-y-8">
          {/* Şirket Bilgileri */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-xl text-white">İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">Genel Merkez</p>
                  <p className="text-gray-300 leading-relaxed">
                    AAB MÜHENDİSLİK SAN.TİC.AŞ.<br />
                    Adalet Mah. Manas Blv. No:47/B<br />
                    D:2804 Bayraklı / İZMİR
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">E-posta</p>
                  <a href="mailto:ekap@ekap.ai" className="text-gray-300 hover:text-white hover:underline transition-colors">
                    ekap@ekap.ai
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Phone className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">Telefon</p>
                  <a href="tel:+905325804435" className="text-gray-300 hover:text-white hover:underline transition-colors">
                    0532 580 44 35
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Çalışma Saatleri */}
          <Card>
            <CardHeader>
              <CardTitle>Çalışma Saatleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-dashed">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Pazartesi - Cuma</span>
                  <span className="font-semibold">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Cumartesi</span>
                  <span className="font-semibold">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Pazar</span>
                  <span className="text-red-500 font-medium">Kapalı</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-6 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg text-center">
                * E-posta ile gönderilen mesajlar 24 saat içinde yanıtlanır.
              </p>
            </CardContent>
          </Card>

          {/* Hızlı Linkler */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Erişim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" asChild className="w-full justify-start h-12 text-base hover:bg-gray-50 dark:hover:bg-gray-800">
                <a href="/#kik">KİK Kararları</a>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start h-12 text-base hover:bg-gray-50 dark:hover:bg-gray-800">
                <a href="/fiyatlandirma">Kredi Satın Al</a>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start h-12 text-base hover:bg-gray-50 dark:hover:bg-gray-800">
                <a href="/ai-asistan">AI Asistan</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
