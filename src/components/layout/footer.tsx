"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-16">
      <div className="container mx-auto px-4">
        {/* Mobile compact footer */}
        <div className="md:hidden">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm mb-4">
            <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kullanım Koşulları</Link>
            <Link href="/iletisim" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">İletişim</Link>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="more" className="border-none">
              <AccordionTrigger className="text-sm justify-center py-2 text-gray-600 dark:text-gray-300">Daha fazla</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-8 pt-4">
                  <div className="text-center">
                    <Link href="/" className="inline-block mb-6">
                       <Image
                           src="/images/logo.svg"
                           alt="EKAP Logo"
                           width={155}
                           height={52}
                           className="h-12 w-auto mx-auto"
                       />
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                      Türkiye'nin yapay zeka destekli kamu ihale danışmanlık platformu.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 text-center">
                    <div>
                        <h3 className="font-medium text-base mb-3 text-gray-900 dark:text-white">Platform</h3>
                        <ul className="space-y-2">
                        <li><Link href="/fiyatlandirma" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fiyatlandırma</Link></li>
                        <li><Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">KİK Kararları</Link></li>
                        <li><Link href="/chat-assistant" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Asistan</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-base mb-3 text-gray-900 dark:text-white">Kurumsal</h3>
                        <ul className="space-y-2">
                        <li><Link href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Hakkımızda</Link></li>
                        </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="font-medium text-base mb-3 text-gray-900 dark:text-white">İletişim</h3>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        <span className="block font-medium">AAB MÜHENDİSLİK SAN.TİC.AŞ.</span>
                        <span className="block">Adalet Mah. Manas Blv. No:47/B</span>
                        <span className="block">D:2804 Bayraklı / İZMİR</span>
                      </li>
                      <li className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <a href="mailto:ekap@ekap.ai" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">ekap@ekap.ai</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Desktop/full footer */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
               <Image
                   src="/images/logo.svg"
                   alt="EKAP Logo"
                   width={155}
                   height={52}
                   className="h-12 w-auto"
               />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Türkiye'nin yapay zeka destekli kamu ihale danışmanlık platformu.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/fiyatlandirma" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  KİK Kararları
                </Link>
              </li>
              <li>
                <Link href="/chat-assistant" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  AI Asistan
                </Link>
              </li>
              <li>
                <Link href="/kik" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sosyal Medya Sorgu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-4">Kurumsal</h3>
            <ul className="space-y-3">
                <li>
                  <Link href="/ai-asistan" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    AI Asistan
                  </Link>
                </li>
                <li>
                  <Link href="/sikayet-asistani" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    Şikayet Oluştur
                  </Link>
                </li>
                <li>
                  <Link href="/gizlilik-politikasi" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/kullanim-kosullari" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                    Kullanım Koşulları
                  </Link>
                </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                <span className="block font-medium text-gray-900 dark:text-gray-200">AAB MÜHENDİSLİK SAN.TİC.AŞ.</span>
                <span className="block">Adalet Mah. Manas Blv. No:47/B</span>
                <span className="block">D:2804 Bayraklı / İZMİR</span>
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-400">
                <a href="mailto:ekap@ekap.ai" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  ekap@ekap.ai
                </a>
              </li>
              <li className="pt-4">
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 3.987-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-3.987-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} EKAP - Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
