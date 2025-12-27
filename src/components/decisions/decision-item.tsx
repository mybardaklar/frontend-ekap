
"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; // Added Link import
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Shield, Scale, Share2 } from "lucide-react";
import { getDecisionBadgeColor } from '@/utils/decisionUtils';
import { UrunBilgisi } from '@/types/kikDecisions';
import ProcurementTypeBadge from './procurement-type-badge';
import ShareButton from './share-button';
import {
  encodeProductParams,
  generateProductShareMessage,
  generateEmailSubject,
  shareTosocialMedia
} from '@/utils/shareUtils';
import { toast } from "sonner";

interface DecisionItemProps {
  product: UrunBilgisi;
  isPurchased?: boolean;
  isAdmin?: boolean;
  // onProductClick?: (product: UrunBilgisi) => void; // Removed as per instruction
}

const DecisionItem: React.FC<DecisionItemProps> = ({
  product,
  isPurchased = false,
  isAdmin = false,
  // onProductClick // Removed as per instruction
}) => {
  const handleSocialShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click
    e.stopPropagation();
    const success = await shareTosocialMedia(product);
    if (success) {
      toast.success(typeof navigator.share !== "undefined" ? "Sosyal medya paylaşımı başlatıldı" : "Paylaşım linki kopyalandı");
    } else {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // handleCardClick function removed as per instruction

  // Handle potential null/undefined values safely
  const title = product.baslik || "Başlıksız Karar";
  const summary = (product.baslik_metin || product.ozet || "Özet bulunmuyor");
  const isCourtDecision = !!product.hasCourtDecision || product.karar_sonucu?.toLowerCase().includes('mahkeme') || product.baslik?.toLowerCase().includes('mahkeme');

  // Determine badge colors
  // Accessing property that might not exist on interface yet, casting later if needed

  const searchParams = useSearchParams();
  const currentQuery = searchParams.toString();

  let targetUrl = `/p/${product.id}${currentQuery ? `?${currentQuery}` : ''}`;

  if (product.link) {
      if (product.link.includes('ekap.ai/kik/')) {
          // Internalize legacy external legacy links
          // Format: https://ekap.ai/kik/2046 -> /p/2046
          const parts = product.link.split('/kik/');
          if (parts.length > 1) {
              const id = parts[1];
              targetUrl = `/p/${id}${currentQuery ? `?${currentQuery}` : ''}`;
          }
      } else if (product.link.startsWith('http') || product.link.startsWith('/')) {
          targetUrl = product.link;
      } else {
          // Treat as slug
          targetUrl = `/p/${product.link}${currentQuery ? `?${currentQuery}` : ''}`;
      }
  }

  return (
    <Link
      href={targetUrl}
      className={`
        block group relative p-3 md:p-5 border rounded-xl cursor-pointer transition-all duration-300
        hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 active:scale-[0.98]
        ${isPurchased
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
          : isCourtDecision
          ? 'bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-200 dark:border-blue-700'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border-gray-200 dark:border-gray-700'
        }
        ${isAdmin ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}
      `}
    >
      {/* Stretched Link for the whole card - REMOVED as parent is now Link */}

      <div className="flex items-start justify-between gap-2 md:gap-4"> {/* Removed relative z-10 pointer-events-none */}
        <div className="flex-1 min-w-0"> {/* Removed pointer-events-auto */}
          <div className="flex items-center gap-1 md:gap-2 mb-3 flex-wrap">
            {/* Admin için Karar No, Normal kullanıcı için Ürün No */}
            {isAdmin ? (
              <Badge variant="outline" className="text-[9px] md:text-[11px] font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700">
                {product.karar_no}
              </Badge>
            ) : (
              (product.public_product_no || product.karar_no) && (
                <Badge variant="outline" className="text-[9px] md:text-[11px] font-medium bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                  {product.public_product_no || product.karar_no}
                </Badge>
              )
            )}

            {/* İhale Türü Badge */}
            <ProcurementTypeBadge kararNo={product.karar_no} />

            {/* Karar Sonucu Badge */}
            <Badge className={`text-[9px] md:text-[11px] font-medium ${getDecisionBadgeColor(product.karar_sonucu || null, isCourtDecision)}`}>
              {product.karar_sonucu || "Sonuç Belirsiz"}
            </Badge>

            {/* Mahkeme Kararı Badge */}
            {isCourtDecision && (
              <Badge className="text-[9px] md:text-[11px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                <Scale className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                Mahkeme Kararı
              </Badge>
            )}

            {product.kategori && (
              <Badge className="text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700 hidden sm:inline-flex">
                {product.kategori}
              </Badge>
            )}
             {isAdmin && (
               <Badge className="text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700">
                 <Shield className="h-3 w-3 mr-1" />
                 Yönetici
               </Badge>
             )}
           </div>
           {/* Güvenli Başlık */}
           <h3 className="font-extrabold text-[0.95rem] md:text-[1.05rem] leading-snug text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {summary}
          </p>

          {/* Mahkeme kararı ön bilgilendirmesi */}
          {isCourtDecision && (
            <p className="hidden sm:block text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
              ⚖️ Bu karara ait Mahkeme Kararı vardır.
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 md:gap-3 ml-2 md:ml-4 relative z-20"> {/* Removed pointer-events-auto */}
          <div className="flex items-center gap-1 md:gap-2 bg-gray-100 dark:bg-gray-700 px-2 md:px-3 py-1 md:py-1.5 rounded-full">
            <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span className="font-bold text-[10px] md:text-sm text-gray-900 dark:text-white">{product.price_in_credits || "10"}</span>
            <span className="font-bold text-[10px] md:text-sm text-gray-900 dark:text-white hidden sm:inline">Kredi</span>
          </div>

          <div className="flex items-center gap-2 relative z-10"> {/* Added relative z-10 to ensure buttons are clickable over the Link */}
            {isPurchased || isAdmin ? (
              <div className="flex items-center gap-1 md:gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm font-bold hidden sm:inline">
                  {isAdmin ? 'Yönetici' : 'Satın Alındı'}
                </span>
                <span className="text-xs md:text-sm font-bold sm:hidden">✓</span>
              </div>
            ) : null}

            {/* Admin Social Media Share Button */}
            {isAdmin && (
              <button
                onClick={handleSocialShare}
                className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                title="Sosyal medyada paylaş"
              >
                <Share2 className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            )}

            {/* Regular Share Button - wrapped to prevent default */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <ShareButton
                product={product}
                urlParams={encodeProductParams(product)}
                shareMessage={generateProductShareMessage(product)}
                emailSubject={generateEmailSubject('product', title)}
                emailBody={`KİK Kararı paylaşıyorum:\n\n${title}\nKredi: ${product.price_in_credits || 10}`}
                size="sm"
                variant="ghost"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile category */}
      <div className="flex items-center gap-2 mt-3 sm:hidden">
        {product.kategori && (
          <Badge className="text-[9px] font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700">
            {product.kategori}
          </Badge>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </Link>
  );
};

export default DecisionItem;
